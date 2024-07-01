import React, { useState } from 'react';
import './card-cart.css';

function CardCart({ product, index, deleteProductFromCart, updateProductQuantity, cartItem }) {

    
    const { product_name, price, stock, product_image } = product;
    const [quantity, setQuantity] = useState(cartItem.quantity);

    const handleDeleteProduct = () => {
        deleteProductFromCart(cartItem.cartItem_id);
    };

    const handleIncreaseQuantity = () => {
        if (quantity < stock) {
            const newQuantity = quantity + 1;
            setQuantity(newQuantity);
            updateProductQuantity(cartItem.cartItem_id, newQuantity);
        }
    };

    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            updateProductQuantity(cartItem.cartItem_id, newQuantity);
        }
    };

   

    return (
        <div key={index} className="cardcart-container">
            <div className='cardcart-image-container'>
                <img className='cardcart-image' src={product_image} alt="Imagen del producto" />
            </div>
            <div className='cardcart-details-container'>
                <div className="cardcart-details">
                    <div className="cardcart-name">
                        <span className="cardcart-span-name">{product_name}</span>
                    </div>
                    <div className="cardcart-price">
                        <span className="cardcart-span-price">Price: ${price}</span>
                    </div>
                    <div className="cardcart-stock">
                        <span className="cardcart-span-stock">Cantidad disponible: {stock}</span>
                    </div>
                    <div className="cardcart-quantity">
                        <button onClick={handleDecreaseQuantity}>-</button>
                        <span>{quantity}</span>
                        <button onClick={handleIncreaseQuantity}>+</button>
                    </div>
                </div>
            </div>
            <div className='cardcart-buttons-container'>
                <button className='cardcart-btn-delete' onClick={handleDeleteProduct}>Eliminar</button>
            </div>
        </div>
    );
}

export default CardCart;
