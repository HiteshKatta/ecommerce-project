
import './App.css'
import {Routes,Route} from 'react-router';
import { HomePage } from './pages/HomePage';
import { CheckoutPage } from './pages/CheckoutPage';


function App() {


  return (
    <Routes>
       <Route index element={<HomePage/>}/>
       <Route path="/checkout" element={<CheckoutPage/>}/>

    </Routes>

  )
}

export default App
