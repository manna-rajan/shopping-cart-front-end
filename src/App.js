import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Csignin from './components/Csignin';
import Ssignin from './components/Ssignin';
import Csignup from './components/Csignup';
import Ssignup from './components/Ssignup';
import View from './components/View';
import Cart from './components/Cart';
import SellerViewOrders from './components/SellerViewOrders';
import CustomerViewOrders from './components/CustomerViewOrders';
import AddProducts from './components/AddProducts';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      {/* The product view page can serve as the main landing page */}
      <Route path='/' element={<View />} />
      <Route path='/view' element={<View />} />

      {/* Customer Routes */}
      <Route path='/customer/signin' element={<Csignin />} />
      <Route path='/customer/signup' element={<Csignup />} />
      <Route path='/customer/cart' element={<Cart />} />
      <Route path='/customer/vieworders' element={<CustomerViewOrders />} />

      {/* Seller Routes */}
      <Route path='/seller/signin' element={<Ssignin />} />
      <Route path='/seller/signup' element={<Ssignup />} />
      <Route path='/seller/addproduct' element={<AddProducts />} />
      <Route path='/seller/vieworders' element={<SellerViewOrders />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
