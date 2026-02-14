import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Csignup = () => {
  const navigate = useNavigate();
  const [input, changeInput] = useState(
    {
      name: "",
      email: "",
      password: "",
      phone: ""
    }
  )
  const handleChange = (e) => {
    changeInput({
      ...input,
      [e.target.name]: e.target.value
    });
  };
  const valueRead = async () => {
    const trimmedInput = {
      ...input,
      name: input.name.trim(),
      email: input.email.trim()
    };
    console.log(trimmedInput);
    try {
      const response = await axios.post("http://localhost:3001/customer/signup", trimmedInput);
      if (response.data.status === "success") {
        alert("Signed up successfully! Please sign in.");
        navigate("/customer/signin");
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
      <div className="row mt-5">
        <div className="col-12">
          <div className="card bg-secondary-subtle text-danger-emphasis">
            <div className="card-body d-flex flex-column gap-3">
              <h5 className="card-title">Customer Sign Up</h5>
              <div>
                <label htmlFor="nameInput" className="form-label">Name</label>
                <input type="text" className="form-control" pattern='^[a-zA-Z0-9\s]+$' placeholder='e.g. John Doe88' required id="nameInput" name='name' value={input.name} onChange={handleChange} />
                <div className="invalid-feedback">Please provide a valid name. Only letters, numbers, and spaces are allowed.</div>
              </div>
              <div>
                <label htmlFor="phone" className="form-label">Phone</label>
                <input type="tel" className="form-control" id="phone" pattern="^(\+91)?\-?[6-9][0-9]{9}$" required placeholder="e.g 10 digit number starting with 6-9, +91- is optional code" name="phone" value={input.phone} onChange={handleChange} />
                <div className="invalid-feedback">Please enter a valid 10-digit phone number starting with 6-9, optionally with a +91- prefix.</div>
              </div>
              <div>
                <label htmlFor="emailInput" className="form-label">Email address</label>
                <input type="email" className="form-control" id="emailInput" pattern='^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' placeholder='e.g. john.doe@example.com' name='email' value={input.email} onChange={handleChange} required />
                <div className="invalid-feedback">Please provide a valid email address (e.g., alphanumeric._-@.-example.com).</div>
              </div>
              <div>
                <label htmlFor="passwordInput" className="form-label">Password</label>
                <input type="password" className="form-control" id="passwordInput" required pattern='^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$' placeholder='Min 8 chars, with letters, numbers & symbols' name='password' value={input.password} onChange={handleChange} />
                <div className="invalid-feedback">Password must be at least 8 characters long and include a letter, a number, and a special character (@$!%*?&._-).</div>
              </div>
              <button type="submit" className="btn btn-primary" onClick={valueRead}>Sign Up</button>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Csignup