import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Ssignup = () => {
  const VALIDATION_PATTERNS = {
    name: "^[a-zA-Z0-9\\s]+$",
    email: "^[a-zA-Z0-9._-]+@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}$",
    password: "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&._-])[A-Za-z\\d@$!%*?&._-]{8,}$"
  };

  const navigate = useNavigate();
  const [input, changeInput] = useState(
    {
      name: "",
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

    const trimmedInput = {
      ...input,
      name: input.name.trim(),
      email: input.email.trim()
    };
    try {
      const response = await axios.post("http://localhost:3001/seller/signup", trimmedInput);
      if (response.data.status === "success") {
        alert("Signed up successfully! Please sign in.");
        navigate("/seller/signin");
      } else {
        alert(response.data.message || "Sign up failed for an unknown reason.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert(err.response?.data?.message || "An error occurred during sign-up.");
    }
  };
  return (
    <div className="container">
      <div className="row mt-5 ">
        <div className="col-12">
          <div className="card bg-secondary-subtle text-danger-emphasis">
            <form className={`card-body d-flex flex-column gap-3 ${validated ? 'was-validated' : ''}`} onSubmit={handleSubmit} noValidate>
              <h5 className="card-title">Seller Sign Up</h5>
              <div>
                <label htmlFor="nameInput" className="form-label">Name</label>
                <input type="text" className="form-control" pattern={VALIDATION_PATTERNS.name} placeholder='e.g. Acme Corp 2' required id="nameInput" name='name' value={input.name} onChange={handleChange} onBlur={handleBlur} />
                <div className="invalid-feedback">Please provide a valid name. Only letters, numbers, and spaces are allowed.</div>
              </div>
              <div>
                <label htmlFor="emailInput" className="form-label">Email address</label>
                <input type="email" className="form-control" id="emailInput" pattern={VALIDATION_PATTERNS.email} placeholder='e.g. john.doe@example.com' name='email' value={input.email} onChange={handleChange} onBlur={handleBlur} required />
                <div className="invalid-feedback">Please provide a valid email address (e.g., alphanumeric._-@.-example.com).</div>
              </div>
              <div>
                <label htmlFor="passwordInput" className="form-label">Password</label>
                <input type="password" className="form-control" id="passwordInput" required pattern={VALIDATION_PATTERNS.password} placeholder='Min 8 chars, with letters, numbers & symbols' name='password' value={input.password} onChange={handleChange} onBlur={handleBlur} />
                <div className="invalid-feedback">Password must be at least 8 characters long and include a letter, a number, and a special character (@$!%*?&._-).</div>
              </div>
              <button type="submit" className="btn btn-primary">Sign Up</button>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ssignup
