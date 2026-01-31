import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Csignin = () => {
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
  const valueRead = () => {
    console.log(input)
    axios.post("http://localhost:3001/customer/signin", input)
      .then((response) => {
        console.log(response)
        if (response.data.status === "success") {
          sessionStorage.setItem("customerid", response.data.customerId)
          sessionStorage.setItem("customername", response.data.name)
          navigate("/view")
        } else {
          alert("Invalid credentials")
        }
      }).catch((err) => {
        console.error("Signin error:", err);
        alert("An error occurred during sign-in.");
      })
  }
  return (
    <div className="container">
      <div className="row mt-5">
        <div className=" col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
          <div className="card bg-secondary-subtle text-danger-emphasis">
            <div className="card-body">
              <h5 className="card-title">Customer Sign In</h5>
              <div className="mb-3">
                <label htmlFor="emailInput" className="form-label">Email address</label>
                <input type="email" className="form-control" id="emailInput" name='email' value={input.email} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label htmlFor="passwordInput" className="form-label">Password</label>
                <input type="password" className="form-control" id="passwordInput" name="password" value={input.password} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <button type="submit" className="btn btn-primary w-100" onClick={valueRead}>Sign In</button>
              </div>
              <div className="mb-3">
                <Link to="/customer/signup" className="btn btn-outline-primary w-100">Sign Up as Customer</Link>
              </div>
              <div className="mb-3">
                <Link to="/seller/signin" className="btn btn-outline-primary w-100">Seller Sign In</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Csignin