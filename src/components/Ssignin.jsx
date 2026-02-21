import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';


const Ssignin = () => {
  const VALIDATION_PATTERNS = {
    email: "^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\\.+[a-zA-Z]{2,}$",
    password: "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&._-])[A-Za-z\\d@$!%*?&._-]{8,}$"
  };

  const navigate = useNavigate();
  const [input, changeInput] = useState(
    {
      email: "",
      password: ""
    }
  );
  const [validated, setValidated] = useState(false);

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

    try {
      const response = await axios.post("http://localhost:3001/seller/signin", input);
      if (response.data.status === "success") {
        sessionStorage.clear();
        sessionStorage.setItem("sellerid", response.data.sellerId);
        sessionStorage.setItem("sellername", response.data.sellerName);
        navigate("/seller/addproduct");
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error("Signin error:", err);
      alert("An error occurred during sign-in.");
    }
  };

  return (
    <div className="container">
      <div className="row mt-5">
        <div className=" col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
          <div className="card bg-secondary-subtle text-danger-emphasis">
            <form className={`card-body d-flex flex-column gap-3 ${validated ? 'was-validated' : ''}`} onSubmit={handleSubmit} noValidate>
              <h5 className="card-title">Seller Sign In</h5>
              <div>
                <label htmlFor="emailInput" className="form-label">Email address</label>
                <input type="text" className="form-control" id="emailInput" name='email' value={input.email} onChange={handleChange} onBlur={handleBlur} required pattern={VALIDATION_PATTERNS.email} placeholder="e.g. seller@example.com" />
                <div className="invalid-feedback">Please provide a valid email.</div>
              </div>
              <div>
                <label htmlFor="passwordInput" className="form-label">Password</label>
                <input type="text" className="form-control" id="passwordInput" name="password" pattern={VALIDATION_PATTERNS.password} placeholder='Min 8 chars, with letters, numbers & symbols' value={input.password} onChange={handleChange} onBlur={handleBlur} required />
                <div className="invalid-feedback">Please provide your password.</div>
              </div>
              <button type="submit" className="btn btn-primary w-100">Sign In</button>
              <div className="mb-3">
                <Link to="/seller/signup" className="btn btn-outline-primary w-100">Sign Up as Seller</Link>
              </div>
              <div className="mb-3">
                <Link to="/customer/signin" className="btn btn-outline-primary w-100">Customer Sign In</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Ssignin