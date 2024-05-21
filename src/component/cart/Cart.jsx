import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import CardCart from './Card-Cart';

function Cart() {
    const { user } = useContext(UserContext);
    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState([]);

    async function getCarts() {
        try {
            const res = await fetch(`http://localhost:3000/api/carts`);
            console.log(res)
            if (!res.ok) {
                console.log("Error al obtener los carritos- var res");
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

    async function deleteProductFromCart(productId) {
        try {
            const response = await fetch(`http://localhost:3000/api/carts/${user.sub}/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId }),
            });

            if (!response.ok) {
                throw new Error('Error deleting product from cart');
            }

            console.log('Product deleted successfully');
            getCarts(); // Refrescar el carrito después de eliminar un producto

        } catch (error) {
            console.error('Error deleting product:', error.message);
        }
    }

    useEffect(() => {
        if (user) {
            getCarts();
        }
    }, [user]);

    return (
        <div className="products">
            {cart.map((product, index) => (
                <CardCart key={product.productId} product={product} index={index} deleteProductFromCart={deleteProductFromCart}></CardCart>
            ))}
        </div>
    )
}

export default Cart;  
