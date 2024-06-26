import "./cardUpdate.css";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { getAll, updatePatch } from "../../service/functionsHTTP";
import Swal from 'sweetalert2';

const urlCategories = "http://localhost:3000/api/categories";


function CardUpdate({ product, setUpdate, refresh, setRefresh }) {
  const { user } = useContext(UserContext);
  const [categories, setCategories] = useState([]);
  const [currentProduct, setCurrentProduct] = useState({
    product_name: product.product_name,
    description: product.description,
    price: product.price,
    category_id: 1,
    stock: product.stock,
    condition: product.condition,
  });

  async function actualizarProducto(event) {
    event.preventDefault();
    currentProduct.price = parseInt(currentProduct.price);
    try {
      const fullUrl = `http://localhost:3000/api/products/${product.productId}`;
      currentProduct.price = parseInt(currentProduct.price);
      currentProduct.stock = parseInt(currentProduct.stock);
      currentProduct.category_id = parseInt(currentProduct.category_id);
      if (currentProduct.condition === "Usado") {
        currentProduct.condition = "USED"
      }
      else {
        currentProduct.condition = "NEW"
      }
      const res = await updatePatch(fullUrl, currentProduct, user.jwt);
      if (!res.ok) {
        throw new Error('Failed to fetch orders');
      }
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon:'success',
        title:'Producto actualizado con éxito',
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
      setUpdate(false);
      setRefresh(true);
    } catch (error) {
      console.error(error);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'No se pudo actualizar el producto',
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
  }

  const handleConditionChange = (event) => {
    const value = event.target.value;
    setCurrentProduct(prev => ({
      ...prev,
      condition: value
    }));
  };

  function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await getAll(urlCategories, user.jwt);
        if (!res.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    fetchCategories();
  }, [user]);


  return (
    <div className="div-card-update">
      <div className="card-actualizar">
        <form className="form-update" onSubmit={(e) => actualizarProducto(e)}>
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
            className="input-cardUpdate-product"
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
            className="input-cardUpdate-product"
            required
          />

          <label>Precio</label>
          <input
            type="number"
            name="price"
            placeholder="Precio"
            value={currentProduct.price}
            onChange={(e) =>
              setCurrentProduct((prev) => ({ ...prev, price: e.target.value }))
            }
            className="input-cardUpdate-product"
            required
          />

          <label>Stock</label>
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={currentProduct.stock}
            onChange={(e) =>
              setCurrentProduct((prev) => ({ ...prev, stock: e.target.value }))
            }
            className="input-cardUpdate-product"
            required
          />

          <label>Categoria</label>
          <select className="input-cart-creation" name="category" value={currentProduct.category_id} onChange={(e) => setCurrentProduct(prev => ({ ...prev, category_id: e.target.value }))} required>
            <option value="">Selecciona una categoría</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{capitalizeFirstLetter(category.name)}</option>
            ))}
          </select>

          <fieldset>
            <div>
              <input type="radio" id="nuevo" name="condition" value="NEW" checked={currentProduct.condition === "NEW"} onChange={handleConditionChange} />
              <label htmlFor="nuevo">Nuevo</label>
            </div>

            <div>
              <input type="radio" id="usado" name="condition" value="USED" checked={currentProduct.condition === "USED"} onChange={handleConditionChange} />
              <label htmlFor="usado">Usado</label>
            </div>
          </fieldset>


          <div className="container-btns">
            <button type="submit" className="btn-actualizar">
              Actualizar
            </button>
            <button className="btn-eliminar" onClick={() => setUpdate(false)}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CardUpdate;