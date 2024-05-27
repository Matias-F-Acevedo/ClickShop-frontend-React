import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { updateOne } from "../../service/functionsHTTP";
// import "./card-update.css";

const urlBase = "http://localhost:3000/api/products";

function CardUpdate({ product, setUpdate, refresh, setRefresh }) {
  const [currentProduct, setCurrentProduct] = useState({
    product_name: product.product_name,
    description: product.description,
    price: product.price,
    category_id: 1
  });

  async function actualizarProducto(event) {
    event.preventDefault();
    currentProduct.price = parseInt(currentProduct.price);
    try {
      await updateOne(product.productId, currentProduct, urlBase);
      setUpdate(false);
      setRefresh(true);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="div-card-update">
      <div className="card-actualizar">
        <form className="form-update" onSubmit={(e) => actualizarProducto(e)}>
          <label>Precio</label>
          <input
            type="number"
            name="price"
            placeholder="Precio"
            value={currentProduct.price}
            onChange={(e) =>
              setCurrentProduct((prev) => ({ ...prev, price: e.target.value }))
            }
            required
          />

          <label>Nombre</label>
          <input
            type="text"
            name="date"
            placeholder="Ubicacion"
            minLength={"4"}
            value={currentProduct.product_name}
            onChange={(e) =>
              setCurrentProduct((prev) => ({
                ...prev,
                product_name: e.target.value
              }))
            }
            required
          />

          <label>Descripción</label>
          <input
            type="text"
            name="description"
            placeholder="descripcion"
            value={currentProduct.description}
            onChange={(e) =>
              setCurrentProduct((prev) => ({
                ...prev,
                description: e.target.value
              }))
            }
            required
          />

          <div className="container-btn-confirmar-actualizar">
            <button type="submit" className="btn-actualizar">
              Actualizar
            </button>
          </div>
        </form>
        <div className="container-btn-confirmar-cancelar">
          <button className="btn-eliminar" onClick={() => setUpdate(false)}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardUpdate;
