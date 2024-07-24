import "./card-cart.css";
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import CardCart from './Card-Cart';
import BuyProduct from '../adressForm/BuyProduct';
import { getAll, getById, remove, updatePut } from '../../service/functionsHTTP';

function Cart() {
    const { user } = useContext(UserContext);
    const [cartItems, setCartItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [isBuying, setIsBuying] = useState(false); // Nuevo estado para manejar si se está comprando
    const navigateTo = useNavigate();

    const handleBuyProduct = () => {
        if(cartItems.length === 0){
            setIsBuying(false);
            return;
        }
        setIsBuying(true); // Actualiza el estado para indicar que se está comprando
    };

    async function getCartItems() {
        try {
            const fullUrl = `http://localhost:3000/api/cart/${user.sub}/items`;
            const res = await getAll(fullUrl, user.jwt);
            const parsed = await res.json();
            const activeItems = parsed.filter(item =>
                item.product.isActive === undefined || item.product.isActive === true
            );
            setCartItems(activeItems);
        } catch (error) {
            console.error("Error al obtener los carritos:", error);
        }
    }

    async function getCart() {
        try {
            const url = "http://localhost:3000/api/cart";
            const res = await getById(user.sub, url, user.jwt);

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
            const res = await remove(fullUrl, user.jwt);
            if (!res.ok) {
                throw new Error('Failed to delete cartItem');
            }
            setCartItems(cartItems.filter(item => item.cartItem_id !== itemId));
            getCart();
        } catch (error) {
            console.error('Error al eliminar el producto:', error.message);
        }
    }

    async function updateProductQuantity(cartItemId, quantity) {
        if (quantity < 1) return;
        try {
            const fullUrl = `http://localhost:3000/api/cart/${user.sub}/items/${cartItemId}/quantity`;
            const body = { quantity: quantity };

            const res = await updatePut(fullUrl, body, user.jwt);

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
                const newQuantityTotal = prevCart.quantityTotal + (quantity - previousQuantity);
                return {
                    ...prevCart,
                    total: newTotal.toFixed(2),
                    quantityTotal: newQuantityTotal
                };
            });

        } catch (error) {
            console.error('Error al actualizar la cantidad del producto:', error.message);
        }
    }

    useEffect(() => {
        if (user) {
            getCartItems();
            getCart();
        }
    }, [user]);

    return (
        <div className='container-cart-items'>
            {isBuying ? (
                <BuyProduct cartItems={cartItems} /> // Renderiza BuyProduct si isBuying es true
            ) : (
                <>
                    <div className="CardCart">
                        {cartItems.length > 0 ? (
                            cartItems.map((cartItem, index) => (
                                <CardCart
                                    key={cartItem.cartItem_id}
                                    product={cartItem.product}
                                    index={index}
                                    deleteProductFromCart={deleteProductFromCart}
                                    updateProductQuantity={updateProductQuantity}
                                    cartItem={cartItem}
                                />
                            ))
                        ) : (
                            <div className="cart-empty">
                            <img src="src\assets\Empty_Cart-removebg-preview.png" alt="Carrito vacio" />
                            <p>No hay productos en el carrito...</p>
                            </div>
                            )}
                    </div>

                    <div className='container-resumen'>
                        <h2>RESUMEN DEL PEDIDO</h2>
                        <p> Cantidad de productos: {cart.quantityTotal}</p>
                        <p > Envio: <span className="span-envio">Gratis a todo el país</span></p>
                        <div className='total'>
                            Total: ${cart.total}
                        </div>
                        <button className='cardcart-btn-buy' onClick={handleBuyProduct}>
                            Comprar Producto
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;
