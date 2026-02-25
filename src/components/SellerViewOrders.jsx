import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';

const SellerViewOrders = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const sellerId = sessionStorage.getItem("sellerid");

    useEffect(() => {
        if (!sellerId) {
            navigate("/seller/signin");
            return;
        }

        const fetchOrders = async () => {
            try {
                const { data } = await axios.post("http://34.231.116.119:3001/seller/vieworders", { sellerId });
                // Sort orders by date, newest first, for better UX
                const sortedOrders = data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                setOrders(sortedOrders);
            } catch (err) {
                console.error("Error fetching orders:", err);
                alert(err.response?.data?.message || "Could not fetch your orders.");
                setOrders([]); // Clear orders on error
            }
        };

        fetchOrders();
    }, [sellerId, navigate]);

    return (
        <div className="container">
            <Nav />
            <h2 className="mt-3">Your Orders</h2>
            <div className="row g-3 mt-3">
                {orders.length > 0 ? orders.map(order => (
                    <div key={order._id} className="col-12">
                        <div className="card mb-3">
                            <div className="card-header bg-light">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div><strong>Order ID:</strong> {order._id}</div>
                                    <div><strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</div>
                                    <div>
                                        <strong>Status:</strong>
                                        <span className={`badge ${order.paymentStatus === 'Paid' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">Customer: {order.customerId ? order.customerId.name : 'N/A'} ({order.customerId ? order.customerId.email : 'N/A'})</h5>
                                <p className="card-text text-muted"><small>This order contains at least one product sold by you. The total amount shown is for the customer's entire order.</small></p>
                                <div className="row row-cols-1 g-3">
                                    {order.items.map(item => {
                                        const isSoldByCurrentUser = item.productId && item.productId.sellerId === sellerId;
                                        return (
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
                                                                <span className={`badge ${isSoldByCurrentUser ? "bg-success" : "bg-secondary"}`}>
                                                                    {isSoldByCurrentUser ? 'Sold by you' : 'Sold by another seller'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="card-footer text-end">
                                <h5>Order Total Amount: ₹{order.totalAmount.toFixed(2)}</h5>
                            </div>
                        </div>
                    </div>
                )) : <div className="col-12"><p>No orders containing your products were found.</p></div>}
            </div>
        </div>
    );
};

export default SellerViewOrders