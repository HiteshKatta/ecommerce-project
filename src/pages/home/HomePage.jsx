import "./HomePage.css";
import axios from 'axios';
import { Header } from "../../components/Header";
import { useEffect,useState } from "react";

import { ProductsGrid } from "./ProductsGrid";
export function HomePage({cart}) {
  const [products,setProducts] =useState([]);
  
  useEffect(()=>{
    axios.get('api/products')
    .then((response) => {
      setProducts(response.data);
    });

    
  },[]);


  return (
    <>
      <title>Ecommerce Project</title>
      <Header cart={cart} />
      <ProductsGrid products={products} />

    </>
  );
}
