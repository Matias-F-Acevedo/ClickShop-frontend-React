import React, { useEffect, useState, useContext } from 'react';
import Card from './Card';
import CardUpdate from './CardUpdate';
import CardCreate from './CardCreate';
import { UserContext } from '../../context/UserContext';
import "./userProduct.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const urlBase = "http://localhost:3000/api/products";

function UserProduct() { 
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [update, setUpdate] = useState(false);
  const [create, setCreate] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [state, setState] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true); // Estado de carga

  async function getProducts() {
    if (!user) return; // Si el usuario no está disponible, no intentar obtener productos

    try {
      setLoading(true);
      const res = await fetch(urlBase);
      if (!res.ok) {
        setState("No hay productos registrados");
        setProducts([]);
        setLoading(false);
        return;
      }
      const parsed = await res.json();
      
      // Filtrar los productos por el usuario actual
      const userProducts = parsed.filter(product => product.user_id === user.sub);
      setProducts(userProducts);
      setRefresh(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setState("Ocurrió un error al obtener los productos");
      setProducts([]);
    } finally {
      setLoading(false); // Asegurarse de que el estado de carga se detenga
    }
  }

  useEffect(() => {
    if (user) {
      getProducts();
    }
  }, [refresh, user]); // Asegurarse de actualizar los productos cuando cambie el usuario

  if (!user) {
    return <div className="loading-message">Cargando...</div>; // Mostrar un mensaje de carga o un spinner
  }

  return (
    <div className="user-product">
      <h1 className="user-product-title">Administrar Productos</h1>
      <div className='container-btn-crear'>
        <button className='btn-crear' onClick={() => setCreate(true)}>
          <FontAwesomeIcon icon={faPlus} /> Crear producto
        </button>
        <div className="tooltip">Haga clic para crear un nuevo producto</div>
      </div>
      {loading ? (
        <div className="loading-message">Cargando productos...</div> // Mostrar un mensaje de carga mientras se obtienen los productos
      ) : (
        <>
          {products.length === 0 && !create && <h1 className='no-hay-productos'>{state}</h1>}
          {create ? (
            <CardCreate setCreate={setCreate} refresh={refresh} setRefresh={setRefresh} />
          ) : (
            <div className="products-container">
              {update ? (
                <CardUpdate product={currentProduct} refresh={refresh} setUpdate={setUpdate} setRefresh={setRefresh} />
              ) : (
                products.map((product, index) => (
                  <Card key={product.productId} product={product} index={index} setUpdate={setUpdate} setCurrentProduct={setCurrentProduct} />
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default UserProduct;