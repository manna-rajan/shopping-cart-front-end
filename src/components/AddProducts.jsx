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
  const valueRead = () => {
    console.log(input)
    axios.post("http://localhost:3001/seller/addproduct", input)
      .then((response) => {
        console.log(response)
        if (response.data.status == "success") {
          alert("Added successfully")
        } else {
          alert("Failed to add product")
        }
      }).catch((err) => {
        console.error("Error adding product:", err);
        alert("An error occurred.");
      });
  }
  return (
   <div className="container">
    <Nav />
      <div className="row g-3 mt-3">
        <div className=" col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
          <div className="card bg-secondary-subtle text-danger-emphasis mb-3">
            <div className="card-body">
              <h5 className="card-title">Add Product</h5>
              
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Product Name</label>
                <input type="text" className="form-control" id="name" name='name' value={input.name} onChange={handleChange}/>
              </div>
              <div className="mb-3">
                <label htmlFor="price" className="form-label">Price</label>
                <input type="number" className="form-control" id="price" name='price' value={input.price} onChange={handleChange}/>
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea className="form-control" id="description" name='description' value={input.description} onChange={handleChange}/>
              </div>
              <div className="mb-3">
                <label htmlFor="quantity" className="form-label">Quantity</label>
                <input type="number" className="form-control" id="quantity" name='quantity' value={input.quantity} onChange={handleChange}/>
              </div>
              <div className="mb-3">
                <label htmlFor="link" className="form-label">Link</label>
                <input type="text" className="form-control" id="link" name='link' value={input.link} onChange={handleChange}/>
              </div>
              <div className="mb-3">
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