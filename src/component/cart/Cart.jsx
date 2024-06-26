import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import CardCart from './Card-Cart';
import "./card-cart.css";
import BuyProduct from '../adressForm/BuyProduct';
import { getAll, getById, remove, updatePut } from '../../service/functionsHTTP';

function Cart() {
    const { user } = useContext(UserContext);
    const [cartItems, setCartItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedCartItem, setSelectCartItem] = useState(null);


    async function getCartItems() {
        try {
            const fullUrl = `http://localhost:3000/api/cart/${user.sub}/items`;
            const res = await getAll(fullUrl, user.jwt)
            const parsed = await res.json();
            setCartItems(parsed);
        } catch (error) {
            console.error("Error al obtener los carritos:", error);
        }
    }


    async function getCart() {
        try {
            const url = "http://localhost:3000/api/cart"
            const res = await getById(user.sub, url, user.jwt)

            if (!res.ok) {
                throw new Error('Failed to fetch cart of user');
            }
            const parsed = await res.json();
            setCart(parsed);
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
        }
    }

    async function deleteProductFromCart(itemId) {
        try {
            const fullUrl = `http://localhost:3000/api/cart/${user.sub}/items/${itemId}`;
            const res = await remove(fullUrl, user.jwt)
            if (!res.ok) {
                throw new Error('Failed to delete cartItem');
            }
            setCartItems(cartItems.filter(item => item.cartItem_id !== itemId));
            getCart()
        } catch (error) {
            console.error('Error al eliminar el producto:', error.message);
        }
    }


    async function updateProductQuantity(cartItemId, quantity) {
        if (quantity < 1) return;
        try {
            const fullUrl = `http://localhost:3000/api/cart/${user.sub}/items/${cartItemId}/quantity`;
            const body = { quantity: quantity }

            const res = await updatePut(fullUrl, body, user.jwt)

            if (!res.ok) {
                throw new Error('Error al actualizar la cantidad del producto');
            }

            const updatedCartItem = await res.json();

            // Verifica si la respuesta contiene la cantidad actualizada
            if (updatedCartItem.quantity !== quantity) {
                throw new Error('La cantidad no se actualizó correctamente en el backend');
            }

            // actualiza el estado localmente.
            setCartItems(prevCartItems =>
                prevCartItems.map(item =>
                    item.cartItem_id === cartItemId
                        ? { ...item, quantity: parseFloat(quantity) }
                        : item
                )
            );

            // actualiza el total del carrito.
            setCart(prevCart => {
                const previousQuantity = cartItems.find(item => item.cartItem_id === cartItemId).quantity;
                const newTotal = parseFloat(prevCart.total) + (parseFloat(quantity) - previousQuantity) * updatedCartItem.unitPrice;
                return {
                    ...prevCart,
                    total: newTotal.toFixed(2)
                };
            });

        } catch (error) {
            console.error('Error al actualizar la cantidad del producto:', error.message);
        }
    }

    useEffect(() => {
        if (user) {
            getCartItems();
            getCart()
        }
    }, [user]);

    return (
        <div className='container-cart-items'>
            <div className="CardCart">
                {cartItems.map((cartItem, index) => (
                    <CardCart
                        key={cartItem.cartItem_id}
                        product={cartItem.product}
                        index={index}
                        deleteProductFromCart={deleteProductFromCart}
                        updateProductQuantity={updateProductQuantity}
                        cartItem={cartItem}
                        onSelectProduct={setSelectedProduct}
                        onSelectCartItem={setSelectCartItem}
                    />
                ))}
                {selectedProduct && (
                    <BuyProduct product={selectedProduct} cartItem={selectedCartItem} /> // Renderizar BuyProduct si hay un producto seleccionado
                )}
            </div>

            <div className='container-resumen'>

                <h2>RESUMEN DEL PEDIDO</h2>
                <p>5 productos</p>
                <p>Envio: Gratis</p>

                <div className='total'>
                    Total: ${cart.total}
                </div>

                <button>Comprar Carrito</button>

            </div>


        </div>
    );
}

export default Cart;
