import React, { useContext } from 'react';
import AddressForm from './AddressForm';
import { UserContext } from '../../context/UserContext';
import "./buyProduct.css"
const BuyProduct = ({ cartItems }) => {
    const { user } = useContext(UserContext);
    const userId = user.sub;

    const renderCartItems = () => {
        if (Array.isArray(cartItems)) {
            return cartItems.map((cartItem, index) => (
                <div key={index} className="product-item">
                    <p className="item-name">Nombre: {cartItem.product.product_name}</p>
                    <p className="item-price">Precio: ${cartItem.product.price}</p>
                    <p className="item-quantity">Cantidad: {cartItem.quantity}</p>
                </div>
            ));
        } else {
            return (
                <div className="product-item">
                    <p className="item-name">Nombre: {cartItems.product_name}</p>
                    <p className="item-price">Precio: ${cartItems.price}</p>
                    <p className="item-quantity">Cantidad: 1</p>
                </div>
            );
        }
    };

    return (
        <div className="buy-product-container">
            <h2>Detalles del Producto:</h2>
            {renderCartItems()}
            <AddressForm userId={userId} cartItems={cartItems} />
        </div>
    );
};

export default BuyProduct;
