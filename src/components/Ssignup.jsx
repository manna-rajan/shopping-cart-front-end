import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Ssignup = () => {
    const navigate=useNavigate();
  const [input, changeInput] = useState(
    { 
        name: "",
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
    axios.post("http://localhost:3001/seller/signup", input)
      .then((response) => {
        console.log(response)
        if (response.data.status === "success") {
          alert("Signed up successfully! Please sign in.")
          navigate("/seller/signin")
        } else if (response.data.status === "used email") {
          alert("Email is already in use.")
        } else {
          alert("Sign up failed.")
        }
      }).catch((err) => {
        console.error("Signup error:", err);
        alert("An error occurred during sign-up.");
      })
  }
  return (
   <div className="container">
      <div className="row mt-5">
        <div className=" col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
          <div className="card bg-secondary-subtle text-danger-emphasis">
            <div className="card-body">
              <h5 className="card-title">Seller Sign Up</h5>
              <div className="mb-3">
                <label htmlFor="nameInput" className="form-label">Name</label>
                <input type="text" className="form-control" id="nameInput" name='name' value={input.name} onChange={handleChange}/>
              </div>
              <div className="mb-3">
                <label htmlFor="emailInput" className="form-label">Email address</label>
                <input type="email" className="form-control" id="emailInput" name='email' value={input.email} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label htmlFor="passwordInput" className="form-label">Password</label>
                <input type="password" className="form-control" id="passwordInput" name='password' value={input.password} onChange={handleChange}/>
              </div>
              <button type="submit" className="btn btn-primary" onClick={valueRead}>Sign Up</button>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ssignup