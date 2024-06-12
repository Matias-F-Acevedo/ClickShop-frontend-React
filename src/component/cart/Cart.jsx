import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import CardCart from './Card-Cart';

function Cart() {
    const { user } = useContext(UserContext);
    const [cart, setCart] = useState([]);
    
    async function getCarts() {
        try {
            const res = await fetch(`http://localhost:3000/api/cart/${user.sub}/items`);
            if (!res.ok) {
                console.error("Error al obtener los carritos");
                return;
            }

            const parsed = await res.json();
            setCart(parsed);
        } catch (error) {
            console.error("Error al obtener los carritos:", error);
        }
    }

    async function deleteProductFromCart(itemId) {
        try {
            const cartItem = cart.find(item => item.product_id === itemId);
            if (!cartItem) {
                throw new Error('Producto no encontrado en el carrito');
            }

            const cartItemId = cartItem.cartItem_id;
            const response = await fetch(`http://localhost:3000/api/cart/${user.sub}/items/${cartItemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error('Error al eliminar el producto del carrito');
            }
    
            console.log('Producto eliminado exitosamente');
            getCarts();
        } catch (error) {
            console.error('Error al eliminar el producto:', error.message);
        }
    }

    async function updateProductQuantity(cartItemId, quantity) {
        if (quantity < 1) return;
        console.log("cantidad", quantity)

        try {
            const response = await fetch(`http://localhost:3000/api/cart/${user.sub}/items/${cartItemId}/quantity`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity }),
            });
        
            if (!response.ok) {
                throw new Error('Error al actualizar la cantidad del producto');
            }
    
            const updatedCartItem = await response.json();
            console.log('Respuesta de la API al actualizar la cantidad del producto:', updatedCartItem);
    
            // Verifica si la respuesta contiene la cantidad actualizada
            if (updatedCartItem.quantity !== quantity) {
                throw new Error('La cantidad no se actualizó correctamente en el backend');
            }
    
            getCarts();
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto:', error.message);
        }
    }
    

    useEffect(() => {
        if (user) {
            getCarts();
        }
    }, [user]);

    return (
        <div className="products">
            {cart.map((cartItem, index) => (
                <CardCart
                    key={cartItem.cartItem_id}
                    product={cartItem.product}
                    index={index}
                    deleteProductFromCart={() => deleteProductFromCart(cartItem.product_id)}
                    updateProductQuantity={updateProductQuantity}
                    cartItem={cartItem}
                />
            ))}
        </div>
    );
}

export default Cart;

