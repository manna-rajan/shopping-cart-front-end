import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

const Nav = () => {
  const navigate = useNavigate();
  const customerId = sessionStorage.getItem("customerid");
  const sellerId = sessionStorage.getItem("sellerid");
  const isLoggedIn = customerId || sellerId;

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/customer/signin');
  };

  return (
    <div>
<nav className="navbar navbar-expand-lg bg-primary rounded-2 border border-warning-emphasis shadow-sm" data-bs-theme="dark">
          <div className="container-fluid ">
          <Link className="navbar-brand fw-bold text-white-emphasis outline-warning-emphasis" to="/">Shopping App</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav  ms-auto gap-2 px-3">
              <Link className="btn btn-outline-warning text-white-emphasis rounded-pill w-100" to="/view">View All</Link>
              {isLoggedIn ? (
                <>
                  {customerId && <Link className="btn btn-outline-warning text-white-emphasis rounded-pill w-100" to="/customer/cart">Cart</Link>}
                  {customerId && <Link className="btn btn-outline-warning text-white-emphasis rounded-pill w-100" to="/customer/vieworders">My Orders</Link>}
                  {sellerId && <Link className="btn btn-outline-warning text-white-emphasis rounded-pill w-100" to="/seller/addproduct">Add Product</Link>}
                  {sellerId && <Link className="btn btn-outline-warning text-white-emphasis rounded-pill w-100" to="/seller/vieworders">View Orders</Link>}
                  <button className="btn btn-outline-danger text-white-emphasis rounded-pill w-100" onClick={handleLogout}>Log out</button>
                </>
              ) : (
                <Link className="btn btn-outline-success text-warning-emphasis rounded-pill w-100" to="/customer/signin">Sign in</Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Nav