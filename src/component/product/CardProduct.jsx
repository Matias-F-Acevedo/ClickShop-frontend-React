import { useContext } from "react";
import { deleteOne } from "../../service/functionsHTTP";
import "./cardProduct.css";
import { UserContext } from "../../context/UserContext";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';






function Card({ product, index, setUpdate, setCurrentProduct }) {
  const { user } = useContext(UserContext);
  const navigateTo = useNavigate();
  const {
    product_name,
    price,
    category,
    stock,
    condition,
    product_image
  } = product;

  if (product.condition = "NEW") {
    product.condition = "Nuevo"
  }
  else {
    product.condition = "Usado"
  }
  // Verificar si category es null antes de acceder a su propiedad name
  const categoryName = category ? category.name : 'Sin categoría';

  // async function deleteProducts(idProducts) {

  //   const urlBase = `http://localhost:3000/api/products`
  //   if (idProducts) {
  //     deleteOne(idProducts, urlBase, user.jwt)
  //     setRefresh(true)
  //   } else {
  //       return console.log("no se pudo eliminar")
  //     }
  //   }


  async function deleteProducts(productId) {


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
          const res = await fetch(`http://localhost:3000/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${user.jwt}`
            },
          });
          if (!res.ok) {
            throw new Error('No se pudo eliminar el producto');
          }
          Swal.fire({
            title: "Eliminado!",
            text: "Su publicación ha sido eliminada.",
            icon: "success",
            confirmButtonColor: "#006d779a",
          });


          setTimeout(() => {
            window.location.reload();
            navigateTo("/sell");
          }, 2000)

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

  return (
    <div key={index} className="productCard">
      <div className="product-details">
        <img className="product-imagen" src={product_image} alt="error al cargar imagen" />
        <h2 className="product-names">{product_name}</h2>
        <p className="product-prices">Price: ${price}</p>
        <p className="product-stocks">Cantidad disponible: {stock}</p>
        <p className="product-conditions">Estado: {condition}</p>
      </div>
      <div className='div-botones'>
        <button className='btn-accion' onClick={() => deleteProducts(product.productId)}>
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
