import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';
const AddProducts = () => {
  const VALIDATION_PATTERNS = {
    name: {
      pattern: new RegExp("^[a-zA-Z0-9\\s-]+$"),
      message: "Please enter a valid product name (letters, numbers, spaces, and hyphens only)."
    },
    price: {
      pattern: new RegExp("^\\d+(\\.\\d{1,2})?$"),
      message: "Please enter a valid price (e.g., 19.99)."
    },
    description: {
      pattern: new RegExp("^\\S+(\\s+\\S+){4,}.*$"),
      message: "Please enter a description with at least 5 words."
    },
    quantity: {
      pattern: new RegExp("^[1-9]\\d*$"),
      message: "Please enter a valid quantity (a whole number greater than 0)."
    }
  };

  const sellerId = sessionStorage.getItem("sellerid");
  const navigate = useNavigate();
  const [input, setInput] = useState({
    name: "",
    price: "",
    description: "",
    quantity: "",
    sellerName: sessionStorage.getItem("sellername"),
    sellerId: sessionStorage.getItem("sellerid"),
    link: ""
  });

  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (!sellerId) {
      navigate("/");
    }
  }, [sellerId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    for (const field in VALIDATION_PATTERNS) {
      if (!input[field]) {
        newErrors[field] = "This field is required.";
      } else if (!VALIDATION_PATTERNS[field].pattern.test(input[field])) {
        newErrors[field] = VALIDATION_PATTERNS[field].message;
      }
    }
    if (input.price && parseFloat(input.price) < 1) {
      newErrors.price = "Price must be at least 1.";
    }
    if (input.quantity && parseInt(input.quantity, 10) < 1) {
      newErrors.quantity = "Quantity must be at least 1.";
    }
    return newErrors;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formErrors = validate();

    // Trigger the browser's built-in validation for the link field directly
    const linkInput = form.elements.link;
    if (linkInput && !linkInput.checkValidity()) {
      formErrors.link = linkInput.validationMessage;
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});

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
      <div className="row mt-3 justify-content-center">
        <div className="col-12 col-md-8">
          <div className="card bg-secondary-subtle text-danger-emphasis mb-3">
            <form className="card-body d-flex flex-column gap-3" onSubmit={handleSubmit} noValidate>
              <h5 className="card-title">Add Product</h5>

              <div>
                <label htmlFor="name" className="form-label">Product Name</label>
                <input type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`} id="name" name='name' value={input.name} onChange={handleChange} required placeholder="e.g. Wireless Mouse" />
                {errors.name && <div className="invalid-feedback d-block">{errors.name}</div>}
              </div>
              <div>
                <label htmlFor="price" className="form-label">Price</label>
                <input type="number" className={`form-control ${errors.price ? 'is-invalid' : ''}`} id="price" name='price' value={input.price} onChange={handleChange} required min="1" placeholder="e.g. 499.99" />
                {errors.price && <div className="invalid-feedback d-block">{errors.price}</div>}
              </div>
              <div>
                <label htmlFor="description" className="form-label">Description</label>
                <textarea className={`form-control ${errors.description ? 'is-invalid' : ''}`} id="description" name='description' value={input.description} onChange={handleChange} required placeholder="Please enter a description with at least 5 words" />
                {errors.description && <div className="invalid-feedback d-block">{errors.description}</div>}
              </div>
              <div>
                <label htmlFor="quantity" className="form-label">Quantity</label>
                <input type="number" className={`form-control ${errors.quantity ? 'is-invalid' : ''}`} id="quantity" name='quantity' value={input.quantity} onChange={handleChange} required min="1" placeholder="e.g. 50" />
                {errors.quantity && <div className="invalid-feedback d-block">{errors.quantity}</div>}
              </div>
              <div>
                <label htmlFor="link" className="form-label">Link</label>
                <input type="url" className={`form-control ${errors.link ? 'is-invalid' : ''}`} id="link" name='link' value={input.link} onChange={handleChange} required placeholder="https://example.com/image.jpg" />
                {errors.link && <div className="invalid-feedback d-block">{errors.link}</div>}
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