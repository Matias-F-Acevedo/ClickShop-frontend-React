import React, { useState } from 'react';

function CardCart({ product, index, deleteProductFromCart, updateProductQuantity, cartItem }) {
    const { product_name, price, stock, product_image } = product;
    const [quantity, setQuantity] = useState(cartItem.quantity); // Inicializamos con la cantidad del cartItem

    console.log("cantidad en cardcart", quantity);

    const handleDeleteProduct = () => {
        deleteProductFromCart(cartItem.cartItem_id);
    };

    const handleIncreaseQuantity = () => {
        if (quantity < stock) {
            const newQuantity = quantity + 1 ;
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
        <div key={index} className="productCart">
            <div className='imagen'>
                <img className='product-imagen' src={product_image} alt="Imagen del producto" />
            </div>
            <div className='product-buttons'>
                <div className="product-details-cart">
                    <div className="product-name-cart">
                        <span className="span-product-name">{product_name}</span>
                    </div>
                    <div className="product-price">
                        <span className="span-product-price">Price: ${price}</span>
                    </div>
                    <div className="product-stock">
                        <span className="span-product-stock">Cantidad disponible: {stock}</span>
                    </div>
                    <div className="product-quantity">
                        <button onClick={handleDecreaseQuantity}>-</button>
                        <span>{quantity}</span>
                        <button onClick={handleIncreaseQuantity}>+</button>
                    </div>
                </div>
            </div>
            <div className='div-btns'>
                <button className='btn-eliminar' onClick={handleDeleteProduct}>Eliminar</button>
                <button className='btn-eliminar'>Comprar Producto</button>
            </div>
        </div>
    );
}

export default CardCart;
