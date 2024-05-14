import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../../context/UserContext';
import ProductCard from '../store/Card';
import Card from '../product/Card';




function Cart() {
  const { user } = useContext(UserContext);
  const [cart, setCart] = useState([]);
const [products, setProducts] = useState([]);

  async function getCarts() {
    try {
      const res = await fetch(`http://localhost:3000/api/carts`);
  
      if (!res.ok) {
        console.log("Error al obtener los carritos");
        return;
      }
  
      const parsed = await res.json();
      console.log("parsed", parsed);
  
      if (!Array.isArray(parsed)) {
        console.error("La respuesta no es un array de objetos");
        return;
      }
  
      const userCart = parsed.find(cart => cart.userId === parseInt(user.sub));
  
      if (!userCart) {
        console.log(user.sub)
        console.error("No se encontró el carrito del usuario");
        return;
      }
  
      console.log("Nuevo carrito del usuario:", userCart);
      setCart(userCart.products);
      
    } catch (error) {
      console.error("Error al obtener los carritos:", error);
    }
  }

  

  useEffect(() => {
    if (user) {
      getCarts()
    }
  }, [user]);

  return (
    <div className="products">
      {cart.map((product, index) => (
      <Card key={product.productId} product={product} index={index} button={false} />
            ))}
    </div>
  )
}

export default Cart