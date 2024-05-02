import React from "react";
import { BsCartPlusFill } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import { FaStar } from "react-icons/fa";


const ProductCard = (props) => {
    const {product_name, price} = props.data;
    return (
        <div className="product">
            <div className="slide-var">
            <p>Agregar fotos</p>
            </div>
            <div className="descripcion">
                <p>
                    <b>{product_name}</b>
                </p>
                <p>${price}</p>
                <button class="addToCartBttn"><FaEye /></button>
                <button class="addToCartBttn"><BsCartPlusFill /></button>
                <button class="addToCartBttn"><FaStar /></button>


            </div>
        </div>
    );
};

export default ProductCard