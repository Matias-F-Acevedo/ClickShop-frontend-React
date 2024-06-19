import { UserContext } from "../../context/UserContext";
import { useContext, useState, useEffect } from "react";
import "./store.css";
import "react-image-gallery/styles/css/image-gallery.css";
import React from "react";
import { BsCartPlusFill } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import ImageGallery from "react-image-gallery";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import React, { useState, useContext, useEffect } from "react";
// import { BsCartPlusFill } from "react-icons/bs";
// import { FaEye } from "react-icons/fa";
// import { FaStar } from "react-icons/fa";
import ImageGallery from "react-image-gallery";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa6";
import { FiEye } from "react-icons/fi";
import Swal from 'sweetalert2';

const ProductCard = (props) => {
    const { data, handleLinkClickProduct } = props
    const { user } = useContext(UserContext);
  const URLCartUser = `http://localhost:3000/api/cart/${user.sub}`
  const [addedToCart, setAddedToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const newProduct = {
    product_id: data.productId,
    quantity: 1,
    unitPrice: data.price
  }
  const handleAddToCart = async () => {
    try {
      if (user) {
        await fetch(URLCartUser, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newProduct ),  
        });
        console.log(newProduct)
        console.log("se agrego el producto al carrito")
        setAddedToCart(true);
      } else {
        console.error("El usuario no está definido.");
      }
    } catch (error) {
      console.error("Error al agregar el producto al carrito:", error);
    }
  };


  const checkIfFavorite = async () => {
    try {
      if (user) {
        const res = await fetch(`http://localhost:3000/api/favorites/${user.sub}`);
        if (!res.ok) {
          throw new Error('Failed to fetch favorites');
        }
        const favorites = await res.json();
        const isFav = favorites.some(fav => fav.product_id === productId);
        setIsFavorite(isFav);
      }
    } catch (error) {
      console.error("Error al verificar los favoritos:", error);
    }
  };

  const handleToggleFavorite = async (productId) => {
    try {
      if (user) {
        const url = `http://localhost:3000/api/favorites/${user.sub}/${productId}`;
        const method = isFavorite ? 'DELETE' : 'POST';
        const body = isFavorite ? null : JSON.stringify({ "product_id": productId, "user_id": user.sub });

        const response = await fetch(isFavorite ? url : 'http://localhost:3000/api/favorites', {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: isFavorite ? null : body,
        });

        if (response.ok) {
          setIsFavorite(!isFavorite);
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: isFavorite ? 'info' : 'success',
            title: isFavorite ? 'Eliminado de favoritos' : 'Agregado con éxito',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            customClass: {
              popup: 'swal2-toast-custom'
            },
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
          });
        } else {
          throw new Error(isFavorite ? 'Failed to remove favorite' : 'Failed to add favorite');
        }
      } else {
        console.error("El usuario no está definido.");
      }
    } catch (error) {
      console.error("Error al actualizar los favoritos:", error);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: isFavorite ? 'No se pudo eliminar el producto de favoritos' : 'No se pudo agregar el producto a favoritos',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        customClass: {
          popup: 'swal2-toast-custom'
        },
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
      });
    }
  };

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
    <div className="product">
      <div className="slide-var" >
        <ImageGallery items={images} showFullscreenButton={false} showPlayButton={false} showThumbnails={false} renderLeftNav={renderLeftNav}
          renderRightNav={renderRightNav}></ImageGallery>
      </div>
      <div className="descripcion">
        <p>
          <b>{data.product_name}</b>
        </p>
        <p className="price-product">${data.price}</p>
        <div className="buttons-card-product">
          <button onClick={handleLinkClickProduct} ><FiEye /></button>
          <button onClick={() => handleAddToCart(productId)}>
            <BsCartPlusFill style={{ color: addedToCart ? "green" : "black" }} />
          </button>
          <button onClick={() => handleToggleFavorite(productId)}>
            {isFavorite ? <FaHeart style={{ color: "red" }} /> : <FaRegHeart />}
          </button>
        </div>



      </div>
    </div>
  );





  // return (
  //   <div className="product">
  //     <div className="slide-var">
  //       <p>Agregar fotos</p>
  //     </div>
  //     <div className="descripcion">
  //       <p>
  //         <b>{product_name}</b>
  //       </p>
  //       <p>${price}</p>
  //       <button className="addToCartBttn"><FaEye /></button>
  //       <button className="addToCartBttn" onClick={() => handleAddToCart(productId)}>
  //         <BsCartPlusFill style={{ color: addedToCart ? "green" : "black" }} />
  //       </button>
  //       <button className="addToCartBttn"><FaStar /></button>
  //     </div>
  //   </div>
  // );



  // const ProductCard = (props) => {
  //     const { data } = props


  //     const images = data.product_image.map((img) => {
  //         return {
  //             original: img,
  //             thumbnail: img,
  //         }
  //     })



  //     const renderLeftNav = (onClick, disabled) => (
  //         <IoIosArrowBack
  //             className="image-gallery-custom-left-nav"
  //             onClick={onClick}
  //             disabled={disabled}
  //         />
  //     );

  //     const renderRightNav = (onClick, disabled) => (
  //         <IoIosArrowForward
  //             className="image-gallery-custom-right-nav"
  //             onClick={onClick}
  //             disabled={disabled}
  //         />
  //     );

  //     return (
  //         <div  className="product" >
  //             <div className="slide-var">
  //                <ImageGallery items={images} showFullscreenButton={false} showPlayButton={false} showThumbnails={false} renderLeftNav={renderLeftNav}
  //                     renderRightNav={renderRightNav}></ImageGallery>
  //             </div>
  //             <div className="descripcion">
  //                 <p>
  //                     <b>{data.product_name}</b>
  //                 </p>
  //                 <p className="price-product">${data.price}</p>
  //                 {/* <button class="addToCartBttn"><FaEye /></button> */}
  //                 <button class="addToCartBttn"><BsCartPlusFill /></button>
  //                 <button class="addToCartBttn"><FaRegHeart /></button>


  //             </div>
  //         </div>
  //     );

};

export default ProductCard;
