import "./store.css";
import "react-image-gallery/styles/css/image-gallery.css";
import { BsCartPlusFill } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import ImageGallery from "react-image-gallery";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa6";
import React, { useState, useContext, useEffect } from "react";
// import { BsCartPlusFill } from "react-icons/bs";
// import { FaEye } from "react-icons/fa";
// import { FaStar } from "react-icons/fa";
import { UserContext } from "../../context/UserContext";
import { FiEye } from "react-icons/fi";


const ProductCard = (props) => {
  const { data, handleLinkClickProduct } = props

  const { user } = useContext(UserContext);
  const URLCartUser = user ? `http://localhost:3000/api/carts/${user.sub}/update` : 'no hay user';
  const { productId, product_name, price } = props.data;
  const [addedToCart, setAddedToCart] = useState(false);
  const [cart, setCart] = useState(null);

  async function getCarts() {
    try {
      const res = await fetch(`http://localhost:3000/api/carts`);
      const parsed = await res.json();

      const userCart = parsed.find(cart => cart.userId === parseInt(user.sub));

      if (!userCart) {
        console.error("Error al encontrar carrito. Se intentará crear uno nuevo.");
        const userId = parseInt(user.sub);
        const newUserCart = await fetch("http://localhost:3000/api/carts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ userId: userId }),
        });
        const newCart = await newUserCart.json();
        setCart(newCart);
      } else {
        // console.log("Carrito encontrado:", userCart);
        setCart(userCart);
      }
    } catch (error) {
      console.error("Error al obtener los carritos:", error);
    }
  }

  useEffect(() => {
    if (user) {
      getCarts();
    }
  }, [user]);

  const handleAddToCart = async (productId) => {
    try {
      if (user) {
        await fetch(URLCartUser, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ "userId": user.sub, "productId": productId }),
        });
        setAddedToCart(true);
      } else {
        console.error("El usuario no está definido.");
      }
    } catch (error) {
      console.error("Error al agregar el producto al carrito:", error);
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
          <button><FaRegHeart /></button>
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
