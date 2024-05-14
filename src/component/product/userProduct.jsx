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
  const [currentProduct, setCurrentProduct] = useState();
  const [state, setState] = useState("");
  const [refresh, setRefresh] = useState(false);

  async function getProducts() {
    try {
      const res = await fetch(urlBase);
      if (!res.ok) {
        setState("No hay productos registrados");
        setProducts([]);
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
    }
  }

  useEffect(() => {
    getProducts();
  }, [refresh, user]); // Asegúrate de actualizar los productos cuando cambie el usuario

  return (
    <div>
      <div className='container-btn-crear'>
        <button className='btn-crear' onClick={() => setCreate(true)}>
          <FontAwesomeIcon icon={faPlus} /> Crear producto
        </button>
      </div>
      {products.length === 0 && !create && <h1 className='no-hay-productos'>{state}</h1>}
      {create ? (
          <CardCreate setCreate={setCreate} refresh={refresh} setRefresh={setRefresh} />
      ) : (
        <div>
            {update ? (
              <CardUpdate product={currentProduct} refresh={refresh} setUpdate={setUpdate} setRefresh={setRefresh} />
            ) : (
              products.map((product, index) => (
                <Card key={product.productId} product={product} index={index} setUpdate={setUpdate} setCurrentProduct={setCurrentProduct} />
              ))
            )}

        </div>
      )}
    </div>
  );
}

export default UserProduct;

