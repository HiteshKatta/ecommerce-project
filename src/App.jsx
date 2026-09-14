
import './App.css'
import {Routes,Route} from 'react-router';
import { HomePage } from './pages/home/HomePage';
import { useEffect,useState } from 'react';
import axios from 'axios';
import { CheckoutPage } from './pages/checkout/CheckoutPage';
import {OrdersPage} from './pages/orders/OrdersPage';
import {TrackingPage} from './pages/TrackingPage';

function App() {
  const [cart,setCart] = useState([]);
   
  useEffect(()=>{
  axios.get('api/cart-items?expand=product ')
    .then((response) => {
      setCart(response.data);
    });
    },[]);


  return (
    <Routes>
       <Route index element={<HomePage   cart={cart}/>}/>
       <Route path="/checkout" element={<CheckoutPage  cart={cart}/>}/>
       <Route path="/orders" element={<OrdersPage  cart={cart}/>}/>
       <Route path="/tracking" element={<TrackingPage/>}/>

    </Routes>

  )
}

export default App
