import "./buyProduct.css";
import React, { useContext } from 'react';
import AddressForm from './AddressForm';
import { UserContext } from '../../context/UserContext';

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
            <div className='details-product-checkout'>
                    <h2>Detalles del Pedido</h2>
                    <div className='container-product-items'>
                         {renderCartItems()}
                    </div>
           
            </div>
        
            <div>
               <AddressForm userId={userId} cartItems={cartItems} />  
            </div>
           
        </div>
    );
};

export default BuyProduct;
