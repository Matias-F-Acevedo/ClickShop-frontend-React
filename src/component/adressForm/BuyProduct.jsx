import React from 'react';
import AddressForm from './AddressForm';
import { UserContext } from '../../context/UserContext';
import { useContext } from 'react';

function BuyProduct({ cartItems }) {
    const { user } = useContext(UserContext);
    const userId = user.sub;

    const renderCartItems = () => {
        console.log(cartItems)
        if (Array.isArray(cartItems)) {
            return cartItems.map((cartItem, index) => (
                <div key={index}>
                    <p>Nombre: {cartItem.product.product_name}</p>
                    <p>Precio: ${cartItem.product.price}</p>
                    <p>Cantidad: {cartItem.quantity}</p>
                </div>
            ));
        } else {
            return (
                <div>
                    <p>Nombre: {cartItems.product_name}</p>
                    <p>Precio: ${cartItems.price}</p>
                    <p>Cantidad: 1</p>
                </div>
            );
        }
    };

    return (
        <div>
            <h2>Detalles del Producto:</h2>
            {renderCartItems()}
            <AddressForm
                userId={userId}
                cartItems={cartItems}
            />
        </div>
    );
}

export default BuyProduct;
