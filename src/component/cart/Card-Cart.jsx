import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
// import "./cardCart.css";


function CardCart({ product, index, deleteProductFromCart }) {
    const { user } = useContext(UserContext);
    const { product_name, price, stock } = product;

    const handleDeleteProduct = () => {
        deleteProductFromCart(product.productId);
    };

    return (
        <div key={index} className="productCart">
            <div className='imagen'>
            <img src="" alt="aca va la imagen" />
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
            </div>
           
                </div>
                <div className='div-btns'>
                    <button className='btn-eliminar' onClick={handleDeleteProduct}>Eliminar</button>
                    <button className='btn-eliminar' >Comprar Producto</button>
                </div>
        </div>
    );
}

export default CardCart;
