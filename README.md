# Shopping Cart Frontend

React frontend for a MERN shopping cart platform with dedicated customer and seller journeys, cart workflows, and checkout integration.

![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=white)
![Router](https://img.shields.io/badge/Routing-React%20Router-CA4245?logo=reactrouter&logoColor=white)
![Axios](https://img.shields.io/badge/API-Axios-5A29E4?logo=axios&logoColor=white)
![Bootstrap](https://img.shields.io/badge/UI-Bootstrap-7952B3?logo=bootstrap&logoColor=white)

## Live Links

| Deployment | URL |
| --- | --- |
| Frontend (Render) | https://shopping-cart-front-end.onrender.com/ |
| AWS EC2 | http://34.231.116.119:3000/ |
| Backend Repository | https://github.com/manna-rajan/shopping-cart-back-end |

## Highlights

- Separate customer and seller signup/signin flows
- Product browse and search
- Seller product add/remove actions
- Cart add/remove handling
- Cashfree-powered checkout
- Order history for both user types

## Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | React, React Router, Axios, Bootstrap |
| Backend (paired repo) | Node.js, Express, MongoDB, Mongoose |
| Payments | Cashfree |

## Quick Start

### 1. Prerequisites

- Node.js 14+
- npm
- Running backend API (local or remote)

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in this folder:

```env
REACT_APP_BACKEND_URL=http://localhost:3001
REACT_APP_CASHFREE_MODE=sandbox
```

Configuration notes:
- If `REACT_APP_BACKEND_URL` is missing, the app falls back to `http://34.231.116.119:3001`.
- Set `REACT_APP_CASHFREE_MODE=production` for live payments.

### 4. Run Locally

```bash
npm start
```

Frontend runs on http://localhost:3000

## Project Layout

| Path | Purpose |
| --- | --- |
| `shopping-cart-frontend/` | React client |
| `shopping-cart-backend/` | Node/Express API |

## Backend Quick Reference

From the project root:

```bash
cd shopping-cart-backend
npm install
node app.js
```

Example backend env (`shopping.env`):

```env
MONGO_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:3000
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
PORT=3001
```