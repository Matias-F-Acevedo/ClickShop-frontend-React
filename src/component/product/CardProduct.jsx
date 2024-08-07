import "./cardProduct.css";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import Swal from 'sweetalert2';
import { remove } from "../../service/functionsHTTP";

function Card({ product, index, setUpdate, setCurrentProduct ,setPublications, products}) {

  const { user } = useContext(UserContext);

  const {
    product_name,
    price,
    category,
    stock,
    condition,
    product_image
  } = product;

  if (product.condition === "NEW") {
    product.condition = "Nuevo"
  }
  else {
    product.condition = "Usado"
  }


  async function deleteProduct(productId) {

    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Sí, eliminar",
      customClass: {
        title: 'swal2-title',
        confirmButton: 'swal2-confirm',
        cancelButton: 'swal2-cancel'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const fullUrl = `http://localhost:3000/api/products/${productId}`;

          const res = await remove(fullUrl, user.jwt);

          if (!res.ok) {
            throw new Error('No se pudo eliminar el producto');
          }

          setPublications(products.filter(pub => pub.productId !== productId));

          Swal.fire({
            title: "Eliminado!",
            text: "Su publicación ha sido eliminada.",
            icon: "success",
            confirmButtonColor: "#006d779a",
          });

        } catch (error) {
          console.error(error);
          Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
        }

      }
    });

  }


  async function selectProducts(product) {
    setUpdate(true)
    setCurrentProduct(product)
  }

  const images = product.product_image.map((img) => {
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
    <div key={index} className="productCard">
      <div className="product-details">
      <div className="slide-var" >
        <ImageGallery items={images} showFullscreenButton={false} showPlayButton={false} showThumbnails={false} renderLeftNav={renderLeftNav}
          renderRightNav={renderRightNav}></ImageGallery>
      </div>
        <h2 className="product-names">{product_name}</h2>
        <p className="product-prices">Price: ${price}</p>
        <p className="product-stocks">Cantidad disponible: {stock}</p>
        <p className="product-conditions">Estado: {condition}</p>
      </div>
      <div className='div-botones'>
        <button className='btn-accion' onClick={() => deleteProduct(product.productId)}>
          <div className="tooltip">Clic para eliminar producto</div>
          Eliminar
        </button>

        <button className='btn-accion' onClick={() => selectProducts(product)}>
          Actualizar
          <div className="tooltip">Clic para actualizar producto</div>
        </button>

      </div>
    </div>
  );
}

export default Card;
