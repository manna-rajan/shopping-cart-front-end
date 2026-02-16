import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';

const View = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [searchWord, setSearchWord] = useState("");
    const customerId = sessionStorage.getItem("customerid");
    const sellerId = sessionStorage.getItem("sellerid");


    const fetchAllProducts = useCallback(async () => {
        try {
            const response = await axios.post("http://localhost:3001/allproducts");
            setProducts(response.data);
        } catch (err) {
            console.error("Error fetching products:", err);
            alert("Could not fetch products.");
        }
    }, []);

    useEffect(() => {
        fetchAllProducts();
    }, [fetchAllProducts]);

    const handleSearchChange = (e) => {
        setSearchWord(e.target.value);
    };

    const handleSearch = async () => {
        if (searchWord.trim() === "") {
            fetchAllProducts();
            return;
        }
        try {
            const response = await axios.post("http://localhost:3001/searchproducts", { name: searchWord.trim() });
            if (response.data.length > 0) {
                setProducts(response.data);
            } else {
                alert("No products found with that name.");
                setProducts([]);
            }
        } catch (err) {
            console.error("Error searching products:", err);
            alert("An error occurred during search.");
        }
    }
    const handleDeleteProduct = async (productId) => {
        try {
            await axios.post(`http://localhost:3001/seller/removeproduct`, { productId, sellerId });
            fetchAllProducts();
        } catch (err) {
            console.error("Error deleting product:", err);
            // Display the specific error message from the backend if available
            alert(err.response?.data?.message || "Could not delete product.");
        }
    }
    const handleAddToCart = async (productId) => {
        if (!customerId) {
            alert("Please login first.");
            navigate("/customer/signin");
            return;
        }
        try {
            const response = await axios.post("http://localhost:3001/customer/addtocart", { customerId, productId });
            if (response.data.status === "success") {
                alert("Product added to cart successfully.");
            } else {
                alert(response.data.message || "Failed to add product to cart.");
            }
        } catch (err) {
            console.error("Error adding product to cart:", err);
            alert(err.response?.data?.message || "An error occurred while adding product to cart.");
        }
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <Nav />
                    <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                        <div className="row g-3 row-cols-1  align-items-center mt-3">
                            <div className="col-md">
                                <input
                                    type="search"
                                    className="form-control"
                                    name="search"
                                    value={searchWord}
                                    onChange={handleSearchChange}
                                    placeholder="Enter product name to search"
                                />
                            </div>
                            <div className="col-md-5 ">
                                <button type="submit" className="btn btn-primary w-100">Search</button>
                            </div>
                        </div>
                    </form>

                    <div className="row g-3 mt-3 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">

                        {products.length > 0 ? (
                            products.map((item) => (
                                <div key={item._id} className="col">
                                    <div className="card bg-secondary-subtle h-100">
                                        <div className="card-body d-flex flex-column">
                                            <img src={item.link} className="img-fluid rounded p-2 object-fit-contain" height={100} alt={item.name} />
                                            <h5 className="card-title">{item.name}</h5>
                                            <h6 className="card-subtitle mb-2 text-muted">₹{item.price ? item.price.toFixed(2) : '0.00'}</h6>
                                            <p className="card-text">{item.description}</p>
                                            <p className="card-text"><small className="text-muted">Quantity: {item.quantity}</small></p>
                                            <p className="card-text"><small className="text-muted">Sold by: {item.sellerName}</small></p>
                                            {item.quantity > 0 ? (
                                                <button className="btn btn-primary mt-auto" onClick={() => handleAddToCart(item._id)}>Add to Cart</button>
                                            ) : (
                                                <button className="btn btn-secondary mt-auto" disabled>Out of Stock</button>
                                            )}
                                            {sellerId && item.sellerId.toString() === sellerId && (
                                                <button className="btn btn-danger mt-2" onClick={() => handleDeleteProduct(item._id)}>Delete Product</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12">
                                <p>No products to display.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default View