import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';


const Ssignin = () => {
  const navigate = useNavigate();
  const [input, changeInput] = useState(
    {
      email: "",
      password: ""
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
      email: input.email.trim()
    };
    try {
      const response = await axios.post("http://localhost:3001/seller/signin", trimmedInput);
      if (response.data.status === "success") {
        sessionStorage.setItem("sellerid", response.data.sellerId);
        sessionStorage.setItem("sellername", response.data.sellerName);
        navigate("/seller/addproduct");
      } else {
        alert(response.data.message || "Invalid credentials.");
      }
    } catch (err) {
      console.error("Signin error:", err);
      alert(err.response?.data?.message || "An error occurred during sign-in.");
    }
  };
  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-12">
          <div className="card bg-secondary-subtle text-danger-emphasis">
            <div className="card-body d-flex flex-column gap-3">
              <h5 className="card-title">Seller Sign In</h5>
              <div>
                <label htmlFor="emailInput" className="form-label">Email address</label>
                <input type="email" className="form-control" id="emailInput" pattern='^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$' placeholder='e.g. john.doe@example.com' name='email' value={input.email} onChange={handleChange} required />
                <div className="invalid-feedback">Please provide a valid email address (e.g., alphanumeric._-@.-example.com).</div>
              </div>
              <div>
                <label htmlFor="passwordInput" className="form-label">Password</label>
                <input type="password" className="form-control" id="passwordInput" required pattern='^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$' placeholder='Min 8 chars, with letters, numbers & symbols' name='password' value={input.password} onChange={handleChange} />
                <div className="invalid-feedback">Password must be at least 8 characters long and include a letter, a number, and a special character (@$!%*?&._-).</div>
              </div>
              <div>
                <button type="submit" className="btn btn-primary w-100" onClick={valueRead}>Sign In</button>
              </div>
              <div>
                <Link to="/seller/signup" className="btn btn-outline-primary w-100">Sign Up as Seller</Link>
              </div>
              <div>
                <Link to="/customer/signin" className="btn btn-outline-primary w-100">Customer Sign In</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Ssignin