import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Csignin = () => {
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
      const response = await axios.post("http://localhost:3001/customer/signin", input);
      if (response.data.status === "success") {
        sessionStorage.clear();
        sessionStorage.setItem("customerid", response.data.customerId);
        sessionStorage.setItem("customername", response.data.name);
        navigate("/view");
      } else {
        alert(response.data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Signin error:", err);
      alert(err.response?.data?.message || "An error occurred during sign-in.");
    }
  };

  return (
    <div className="container">
      <div className="row mt-5">
        <div className=" col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
          <div className="card bg-secondary-subtle text-danger-emphasis">
            <form className={`card-body d-flex flex-column gap-3 ${validated ? 'was-validated' : ''}`} onSubmit={handleSubmit} noValidate>
              <h5 className="card-title">Customer Sign In</h5>
              <div>
                <label htmlFor="emailInput" className="form-label">Email address</label>
                <input type="text" className="form-control" id="emailInput" name='email' value={input.email} placeholder='e.g. john.doe@example.com' pattern={VALIDATION_PATTERNS.email} onChange={handleChange} onBlur={handleBlur} required />
                <div className="invalid-feedback">Please provide a valid email address (e.g., alphanumeric._-@.-example.com).</div>
              </div>
              <div>
                <label htmlFor="passwordInput" className="form-label">Password</label>
                <input type="text" className="form-control" id="passwordInput" name="password" pattern={VALIDATION_PATTERNS.password} placeholder='Min 8 chars, with letters, numbers & symbols' value={input.password} onChange={handleChange} onBlur={handleBlur} required />
                <div className="invalid-feedback">Please provide your password.</div>
              </div>
              <button type="submit" className="btn btn-primary w-100">Sign In</button>
              <div className="mb-3">
                <Link to="/customer/signup" className="btn btn-outline-primary w-100">Sign Up as Customer</Link>
              </div>
              <div className="mb-3">
                <Link to="/seller/signin" className="btn btn-outline-primary w-100">Seller Sign In</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Csignin