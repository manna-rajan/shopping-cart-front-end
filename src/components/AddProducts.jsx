import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';
const AddProducts = () => {
  const VALIDATION_PATTERNS = {
    productName: "^[a-zA-Z0-9\\s-]+$",
    price: "^\\d+(\\.\\d{1,2})?$",
    description: "^\\S+(\\s+\\S+){4,}.*$",
    quantity: "^[1-9]\\d*$"
  };

  const sellerId = sessionStorage.getItem("sellerid");
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
  );

  const [validated, setValidated] = useState(false);
  useEffect(() => {
    if (!sellerId) {
      navigate("/");
    }
  }, [sellerId, navigate]);

  const handleChange = (e) => {
    changeInput({
      ...input,
      [e.target.name]: e.target.value
    });
  };

  const handleBlur = (e) => {
    // If validation has already been triggered, do nothing.
    if (validated) return;

    // If the field that lost focus is invalid, turn on validation for the whole form.
    if (e.currentTarget.checkValidity() === false) {
      setValidated(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const trimmedInput = {
      ...input,
      sellerId: sellerId,
      name: input.name.trim(),
      description: input.description.trim(),
      link: input.link.trim(),
    };
    console.log("Input:", trimmedInput);
    try {
      const response = await axios.post("http://localhost:3001/seller/addproduct", trimmedInput);
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
            <form className={`card-body d-flex flex-column gap-3 ${validated ? 'was-validated' : ''}`} onSubmit={handleSubmit} noValidate>
              <h5 className="card-title">Add Product</h5>

              <div>
                <label htmlFor="name" className="form-label">Product Name</label>
                <input type="text" className="form-control" id="name" name='name' value={input.name} onChange={handleChange} onBlur={handleBlur} required pattern={VALIDATION_PATTERNS.productName} placeholder="e.g. Wireless Mouse" />
                <div className="invalid-feedback">Please enter a valid product name (letters, numbers, spaces, and hyphens only).</div>
              </div>
              <div>
                <label htmlFor="price" className="form-label">Price</label>
                <input type="text" className="form-control" id="price" name='price' value={input.price} pattern={VALIDATION_PATTERNS.price} onChange={handleChange} onBlur={handleBlur} required min="1" placeholder="e.g. 499.99" />
                <div className="invalid-feedback">Please enter a valid price min=1 (e.g., 19.99).</div>
              </div>
              <div>
                <label htmlFor="description" className="form-label">Description</label>
                <textarea className="form-control" id="description" name='description' value={input.description} onChange={handleChange} onBlur={handleBlur} required pattern={VALIDATION_PATTERNS.description} placeholder="Please enter a description with at least 5 words" />
                <div className="invalid-feedback">Please enter a description with at least 5 words.</div>
              </div>
              <div>
                <label htmlFor="quantity" className="form-label">Quantity</label>
                <input type="text" className="form-control" id="quantity" name='quantity' value={input.quantity} onChange={handleChange} onBlur={handleBlur} required min="1" pattern={VALIDATION_PATTERNS.quantity} placeholder="e.g. 50" />
                <div className="invalid-feedback">Please enter a valid quantity (a whole number).</div>
              </div>
              <div>
                <label htmlFor="link" className="form-label">Link</label>
                <input type="url" className="form-control" id="link" name='link' value={input.link} onChange={handleChange} onBlur={handleBlur} required placeholder="https://example.com/image.jpg" />
                <div className="invalid-feedback">Please enter a valid URL for the product image.</div>
              </div>
              <div>
                <button type="submit" className="btn btn-primary">Add Product</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddProducts