import "./store.css";
import "react-image-gallery/styles/css/image-gallery.css";
import React from "react";
import { UserContext } from "../../context/UserContext";
import { useContext, useState, useEffect } from "react";
import { BsCartPlusFill } from "react-icons/bs";
import ImageGallery from "react-image-gallery";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FiEye } from "react-icons/fi";
import { getAll, getById, post, updatePut } from "../../service/functionsHTTP";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

const ProductCard = (props) => {

  const { data, handleLinkClickProduct } = props
  const { user } = useContext(UserContext);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();


  const handleAddToCart = async () => {
    if(!user){
      navigate(`/login`);
    }
    const URLCartUser = `http://localhost:3000/api/cart/${user.sub}`
    const URLCartItems = `http://localhost:3000/api/cart/${user.sub}/items`
    try {
      if (user) {
        const cartItemsRes = await getAll(URLCartItems, user.jwt);
        if (!cartItemsRes.ok) {
          throw new Error('Failed to fetch user cart');
        }
        const cartItems = await cartItemsRes.json();

        const existingProduct = cartItems.find(item => item.product_id == data.productId);

        let res;

        if (existingProduct) {
          const updatedProduct = {
            quantity: existingProduct.quantity + 1
          };

          res = await updatePut(`${URLCartUser}/items/${existingProduct.cartItem_id}/quantity`, updatedProduct, user.jwt);

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Cantidad del producto actualizada en el carrito',
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
          const newProduct = {
            product_id: data.productId,
            quantity: 1,
            unitPrice: data.price
          };
          res = await post(URLCartUser, newProduct, user.jwt);
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Agregado al carrito',
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
        if (!res.ok) {
          throw new Error('Error when adding product to cart');
        }
        setAddedToCart(true);
      } else {
        console.error("The user is not defined");
      }
    } catch (error) {
      console.error("Error when adding product to cart:", error);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'No se pudo agregar el producto al carrito',
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


  const checkIfFavorite = async () => {
    try {
      if (user) {

        const urlFavorites = `http://localhost:3000/api/favorites`
        const res = await getById(user.sub, urlFavorites, user.jwt)

        if (!res.ok) {
          throw new Error('Failed to fetch favorites');
        }
        const favorites = await res.json();
        const isFav = favorites.some(fav => fav.product_id === data.productId);
        setIsFavorite(isFav);
      }
    } catch (error) {
      console.error("Error al verificar los favoritos:", error);
    }
  };

  const handleToggleFavorite = async (productId) => {
    if(!user){
      navigate(`/login`);
    }
    try {
      if (user) {
        const url = `http://localhost:3000/api/favorites/${user.sub}/${productId}`;
        const method = isFavorite ? 'DELETE' : 'POST';
        const body = isFavorite ? null : JSON.stringify({ "product_id": productId, "user_id": user.sub });

        const response = await fetch(isFavorite ? url : 'http://localhost:3000/api/favorites', {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.jwt}`
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

  useEffect(() => {
    if (user) {
      checkIfFavorite();
    }
  }, [user]);



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
          <button onClick={() => handleAddToCart(data.productId)}>
            <BsCartPlusFill style={{ color: addedToCart ? "green" : "black" }} />
          </button>
          <button onClick={() => handleToggleFavorite(data.productId)}>
            {isFavorite ? <FaHeart style={{ color: "red" }} /> : <FaRegHeart />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
