import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const customerId = sessionStorage.getItem("customerid");
    const navigate = useNavigate();

    const fetchCart = useCallback(async () => {
        if (customerId) {
            try {
                const response = await axios.post("http://34.231.116.119:3001/customer/viewcart", { customerId });
                setCart(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error("Error fetching cart:", err);
                alert("Could not fetch cart items.");
            }
        }
    }, [customerId]);

    useEffect(() => {
        if (!customerId) {
            // Redirect to signin page if not logged in
            navigate("/customer/signin");
            return;
        }
        fetchCart();
    }, [customerId, navigate, fetchCart]);

    useEffect(() => {
        const total = cart.reduce((acc, item) => {
            // Ensure item and its nested properties exist before calculation
            if (!item?.productId?.price) return acc;
            const quantity = parseInt(item.quantity, 10);
            if (isNaN(quantity) || quantity < 1) return acc;
            return acc + (item.productId.price * quantity);
        }, 0);
        setTotalPrice(total);
    }, [cart]); // Recalculate whenever the cart changes

    const handleQuantityChange = (productId, newQuantity) => {
        // Allow the input to be temporarily empty for a better user experience
        const quantityValue = newQuantity === '' ? '' : parseInt(newQuantity, 10);

        // Optimistically update the UI for responsiveness
        const updatedCart = cart.map(item => {
            if (item.productId?._id === productId) {
                return { ...item, quantity: quantityValue };
            }
            return item;
        });
        setCart(updatedCart);
    };

    const handleRemoveFromCart = async (productId) => {
        try {
            const response = await axios.post("http://34.231.116.119:3001/customer/removefromcart", { customerId, productId });
            if (response.data.status === "success") {
                alert("Product removed from cart.");
                fetchCart(); // Refresh cart
            } else {
                alert(response.data.message || "Failed to remove product from cart.");
            }
        } catch (err) {
            console.error("Error removing from cart:", err);
            alert("An error occurred while removing product from cart.");
        }
    };

    const handlePlaceOrder = async () => {
        const items = cart.filter(item => item.productId && item.quantity && parseInt(item.quantity, 10) > 0);
        if (items.length === 0 || totalPrice <= 0) {
            alert("Please ensure all items in your cart have a quantity of at least 1.");
            return;
        }

        try {
            // Step 1: Get session ID from backend
            const orderCreationResponse = await axios.post("http://34.231.116.119:3001/customer/create-payment-session", {
                customerId,
                totalAmount: totalPrice
            });

            const { payment_session_id } = orderCreationResponse.data;

            if (!payment_session_id) {
                alert("Could not initiate payment session.");
                return;
            }

            // Step 2: Initialize Cashfree (Updated for v3)
            if (typeof window.Cashfree !== 'function') {
                console.error("Cashfree SDK is not loaded.");
                alert("Cashfree SDK not loaded. Please check your index.html script tag.");
                return;
            }

            // Initialize the SDK object
            const cashfree = window.Cashfree({
                mode: "sandbox" // Use "production" for live
            });

            // Step 3: Save details and Redirect
            const orderDetailsForVerification = {
                items: items.map(item => ({
                    productId: item.productId._id,
                    quantity: parseInt(item.quantity, 10)
                })),
                totalAmount: totalPrice
            };
            sessionStorage.setItem('pendingOrder', JSON.stringify(orderDetailsForVerification));

            // Launch checkout
            let checkoutOptions = {
                paymentSessionId: payment_session_id,
                redirectTarget: "_self",
            };

            cashfree.checkout(checkoutOptions);

        } catch (err) {
            console.error("Error initiating payment:", err);
            if (err.response) {
                // Server responded with an error status (4xx, 5xx)
                alert(err.response.data.message || `Server error: ${err.response.status}.`);
            } else if (err.request) {
                // Request was made, but no response received (e.g., server is down)
                alert("Cannot connect to the server. Please ensure the backend is running and accessible.");
            } else {
                // Something else went wrong (e.g., other JS error)
                alert(err.message || "An error occurred while setting up the payment.");
            }
        }
    };

    return (
        <div className="container">
            <Nav />
            <div className="row mt-3">
                <div className="col-12">
                    <h2>Your Cart</h2>
                </div>
            </div>
            {cart.length > 0 ? (
                <div className="row mt-3 g-4 row-cols-1">
                    {cart.map((item) => (
                        item.productId && (
                            <div className="col" key={item.productId._id}>
                                <div className="card bg-secondary-subtle">
                                    <div className="row g-0">
                                        <div className="col-4 col-md-3 d-flex align-items-center justify-content-center p-2">
                                            <img src={item.productId.link} alt={item.productId.name} className="img-thumbnail img-fluid p-2 object-fit-contain" height={100} />
                                        </div>
                                        <div className="col-8 col-md-9">
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between">
                                                    <h5 className="card-title">{item.productId.name}</h5>
                                                    <button className="btn btn-danger" onClick={() => handleRemoveFromCart(item.productId._id)}>Remove</button>
                                                </div>
                                                <p className="card-text"><small className="text-muted">Price: ₹{item.productId.price.toFixed(2)}</small></p>
                                                <div className="d-flex align-items-center mb-3">
                                                    <label htmlFor={`quantity-${item.productId._id}`} className="form-label me-2 mb-0">Quantity:</label>
                                                    <input
                                                        id={`quantity-${item.productId._id}`}
                                                        type="number"
                                                        className="form-control"
                                                        style={{ width: '80px' }}
                                                        value={item.quantity}
                                                        onChange={(e) => handleQuantityChange(item.productId._id, e.target.value)}
                                                        min="1"
                                                    />
                                                </div>
                                                <h6 className="card-text">Subtotal: ₹{(item.productId.price * (parseInt(item.quantity, 10) || 0)).toFixed(2)}</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    ))}
                    <div className="col-12">
                        <div className="card shadow">
                            <div className="card-body">
                                <h5 className="card-title">Order Summary</h5>
                                <div className="d-flex justify-content-between align-items-center my-3">
                                    <h4>Total</h4>
                                    <h4><strong>₹{totalPrice.toFixed(2)}</strong></h4>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-success btn-lg w-100"
                                    onClick={handlePlaceOrder}
                                    disabled={totalPrice <= 0 || cart.length === 0}
                                >Place Order</button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center mt-5">
                    <p>Your cart is empty.</p>
                </div>
            )}
        </div>
    );
}

export default Cart