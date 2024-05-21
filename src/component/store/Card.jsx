import "./store.css";
import "react-image-gallery/styles/css/image-gallery.css";
import React from "react";
import { BsCartPlusFill } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import ImageGallery from "react-image-gallery";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa6";

const ProductCard = (props) => {
    const { data } = props


    const images = data.product_image.map((img) => {
        return {
            original: img,
            thumbnail: img,
        }
    })



    const renderLeftNav = (onClick, disabled) => (
        <IoIosArrowBack
            className="image-gallery-custom-left-nav"
            onClick={onClick}
            disabled={disabled}
        />
    );

    const renderRightNav = (onClick, disabled) => (
        <IoIosArrowForward
            className="image-gallery-custom-right-nav"
            onClick={onClick}
            disabled={disabled}
        />
    );

    return (
        <div  className="product" >
            <div className="slide-var">
               <ImageGallery items={images} showFullscreenButton={false} showPlayButton={false} showThumbnails={false} renderLeftNav={renderLeftNav}
                    renderRightNav={renderRightNav}></ImageGallery>
            </div>
            <div className="descripcion">
                <p>
                    <b>{data.product_name}</b>
                </p>
                <p className="price-product">${data.price}</p>
                {/* <button class="addToCartBttn"><FaEye /></button> */}
                <button class="addToCartBttn"><BsCartPlusFill /></button>
                <button class="addToCartBttn"><FaRegHeart /></button>


            </div>
        </div>
    );
};

export default ProductCard