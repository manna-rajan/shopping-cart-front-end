import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';
const AddProducts = () => {

  const navigate = useNavigate();
  const [input, changeInput] = useState(
    {
      name: "",
      price: "",
      description: "",
      quantity: "",
      sellerName: sessionStorage.getItem("sellername"),
        sellerId: sessionStorage.getItem("sellerid"),
        link: ""
    }
  )
  useEffect(() => {
    if (!sessionStorage.getItem("sellerid")) {
      navigate("/");
    }
  },[]);

  const handleChange = (e) => {
    changeInput({
      ...input,
      [e.target.name]: e.target.value
    });
  };
  const valueRead = async () => {
    console.log(input);
    try {
      const response = await axios.post("http://localhost:3001/seller/addproduct", input);
      if (response.data.status === "success") {
        alert("Added successfully");
        // Navigate to the view page to see the new product
        navigate('/view');
      } else {
        alert(response.data.message || "Failed to add product.");
      }
    } catch (err) {
      console.error("Error adding product:", err);
      alert(err.response?.data?.message || "An error occurred.");
    }
  };
  return (
   <div className="container">
    <Nav />
      <div className="row mt-3">
        <div className="col-12">
          <div className="card bg-secondary-subtle text-danger-emphasis mb-3">
            <div className="card-body d-flex flex-column gap-3">
              <h5 className="card-title">Add Product</h5>
              
              <div>
                <label htmlFor="name" className="form-label">Product Name</label>
                <input type="text" className="form-control" id="name" name='name' value={input.name} onChange={handleChange} required pattern="^[a-zA-Z0-9\s-]+$" placeholder="e.g. Wireless Mouse" />
                <div className="invalid-feedback">Please enter a valid product name.</div>
              </div>
              <div>
                <label htmlFor="price" className="form-label">Price</label>
                <input type="number" className="form-control" id="price" name='price' value={input.price} onChange={handleChange} required min="1"  placeholder="e.g. 499.99" />
                <div className="invalid-feedback">Please enter a valid price (e.g., 19.99).</div>
              </div>
              <div>
                <label htmlFor="description" className="form-label">Description</label>
                <textarea className="form-control" id="description" name='description' value={input.description} onChange={handleChange} required minLength="10" placeholder="A short description of the product..." />
              </div>
              <div>
                <label htmlFor="quantity" className="form-label">Quantity</label>
                <input type="number" className="form-control" id="quantity" name='quantity' value={input.quantity} onChange={handleChange} required min="0" pattern="\d+" placeholder="e.g. 50" />
                <div className="invalid-feedback">Please enter a valid quantity (a whole number).</div>
              </div>
              <div>
                <label htmlFor="link" className="form-label">Link</label>
                <input type="url" className="form-control" id="link" name='link' value={input.link} onChange={handleChange} required placeholder="https://example.com/image.jpg" />
                <div className="invalid-feedback">Please enter a valid URL for the product image.</div>
              </div>
              <div>
              <button type="submit" className="btn btn-primary" onClick={valueRead}>Add Product</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default AddProducts