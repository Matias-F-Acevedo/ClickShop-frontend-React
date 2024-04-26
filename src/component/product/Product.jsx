import React, { useState, useEffect } from 'react';
import "./product.css";

import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'


// config.js
const API_PORT = 3000;
const API_URL = `http://localhost:${API_PORT}/products`;

const ProductCard = () => {
  const [products, setProducts] = useState(null); // Corrección aquí
  const [preferenceId, setPreferenceId] = useState(null);
  initMercadoPago('YOUR_PUBLIC_KEY', {
    locale: "es-AR"
  });

  useEffect(() => {
    // Función para hacer la solicitud fetch
    const fetchProduct = async () => {
      try {
        // Realizar la solicitud GET a la URL deseada
        const response = await fetch(API_URL);

        // Verificar si la respuesta es exitosa (código de estado 200)
        if (response.ok) {
          // Convertir la respuesta a formato JSON
          const jsonProduct = await response.json();

          // Establecer los datos obtenidos en el estado
          setProducts(jsonProduct);

        } else {
          // En caso de un error de red u otro problema, lanzar una excepción
          throw new Error('Error al obtener los datos');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchProduct();
  }, []); 
  console.log(products)

  return (
    <>
    {
      products && products.map(product => (
        <div key={product.id} className="card">
          <img src={product.imageUrl} alt={product.name} className="product-image" />
          <div className="card-body">
            <h5 className="card-title">{product.name}</h5>
            <p className="card-text">Price: ${product.price}</p>
            <p className='card-description'>{product.description}</p>
            <button>buy</button>
              <Wallet initialization={{ preferenceId: '<PREFERENCE_ID>' }} customization={{ texts: { valueProp: 'smart_option' } }} />
          </div>
        </div>
      ))
    }
    </>
  );
};

export default ProductCard;