import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from './Nav';

const CustomerViewOrders = () => {
    const [orders, setOrders] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const customerId = sessionStorage.getItem("customerid");
    const location = useLocation();

    useEffect(() => {
        if (!customerId) {
            navigate("/customer/signin");
            return;
        }

        const processPageLoad = async () => {
            const params = new URLSearchParams(location.search);
            const cashfreeOrderId = params.get('order_id');
            const pendingOrderJSON = sessionStorage.getItem('pendingOrder');

            // 1. Handle return from Cashfree payment
            if (cashfreeOrderId && pendingOrderJSON) {
                const pendingOrder = JSON.parse(pendingOrderJSON);

                // Immediately remove item to prevent re-processing on refresh
                sessionStorage.removeItem('pendingOrder');

                try {
                    // Verify payment and create order on the backend
                    await axios.post("http://34.231.116.119:3001/orders", {
                        customerId,
                        items: pendingOrder.items,
                        cashfreeOrderId,
                        totalAmount: pendingOrder.totalAmount
                    });

                    setMessage('Payment successful! Your order has been placed.');
                } catch (err) {
                    console.error("Error verifying payment and creating order:", err);
                    const errorMessage = err.response?.data?.message || "Failed to verify your payment. Please contact support.";
                    setMessage(errorMessage);
                } finally {
                    // Clean up the URL. This triggers a re-render which will then fetch the orders.
                    navigate('/customer/vieworders', { replace: true });
                }
                return; // Stop further execution in this render
            } else {
                // 2. Fetch all orders for the customer (normal page load)
                const hasPreExistingMessage = message && !message.startsWith('Loading');
                if (!hasPreExistingMessage) {
                    setMessage('Loading your orders...');
                }

                try {
                    const response = await axios.post("http://34.231.116.119:3001/customer/vieworders", { customerId });
                    if (Array.isArray(response.data) && response.data.length > 0) {
                        const sortedOrders = response.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                        setOrders(sortedOrders);
                        if (!hasPreExistingMessage) setMessage(''); // Clear loading message, but preserve existing messages
                    } else {
                        setOrders([]);
                        if (!hasPreExistingMessage) setMessage(response.data.message || 'You have no past orders.');
                    }
                } catch (err) {
                    console.error("Error fetching orders:", err);
                    setOrders([]);
                    if (!hasPreExistingMessage) setMessage("Could not fetch your orders. Please try again later.");
                }
            }
        };

        processPageLoad();

    }, [customerId, location, navigate]); // Rerun when location changes (e.g., after redirect)

    return (
        <div className="container">
            <Nav />
            <div className="row mt-3">
                <div className="col">
                    <h2 className="mb-4">Your Past Orders</h2>

                    {/* Display a message if there is one */}
                    {message && !message.startsWith('Loading') && (
                        <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`} role="alert">
                            {message}
                            <button type="button" className="btn-close" onClick={() => setMessage('')} aria-label="Close"></button>
                        </div>
                    )}

                    {orders.length > 0 ? orders.map(order => (
                        <div key={order._id} className="card mb-4 shadow-sm">
                            <div className="card-header bg-light">
                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                                    <div className="mb-2 mb-md-0"><strong>Order ID:</strong> {order._id}</div>
                                    <div className="mb-2 mb-md-0"><strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</div>
                                    <div>
                                        <strong>Status:</strong>
                                        <span className={`badge ms-2 ${order.paymentStatus === 'Paid' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row row-cols-1 g-3">
                                    {order.items.map(item => (
                                        <div className="col" key={item._id}>
                                            <div className="card h-100">
                                                <div className="row g-0">
                                                    <div className="col-md-4 d-flex align-items-center justify-content-center p-2">
                                                        <img src={item.productId?.link} className="img-fluid rounded object-fit-contain" alt={item.productId?.name} height={100} />
                                                    </div>
                                                    <div className="col-md-8 d-flex flex-column justify-content-center">
                                                        <div className="card-body">
                                                            <h6 className="card-title mt-2">{item.productId ? item.productId.name : 'Product not found'}</h6>
                                                            <p className="card-text mb-1"><small className="text-muted">Unit Price: ₹{item.productId ? item.productId.price.toFixed(2) : 'N/A'}</small></p>
                                                            <p className="card-text mb-1"><small className="text-muted">Quantity: {item.quantity}</small></p>
                                                            <p className="card-text"><strong>Subtotal: ₹{item.productId ? (item.productId.price * item.quantity).toFixed(2) : 'N/A'}</strong></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="card-footer text-end bg-light">
                                <h5 className="mb-0">Order Total: <strong>₹{order.totalAmount.toFixed(2)}</strong></h5>
                            </div>
                        </div>
                    )) : (
                        // Only show this if there's no other message
                        !message && (
                            <div className="text-center">
                                <p>You have no past orders.</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerViewOrders