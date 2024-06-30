import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RiArrowRightSLine } from "react-icons/ri";
import "./carousel.css";

const Carousel = () => {
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4; // 4 productos por fila

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/products");
        if (!response.ok) {
          throw new Error("Error al obtener las publicaciones");
        }
        const jsonData = await response.json();

        // Selecciona aleatoriamente 4 productos
        const shuffledData = shuffle(jsonData);
        const randomFourProducts = shuffledData.slice(0, 4);

        // Filtra para seleccionar solo la primera imagen de cada producto
        const filteredData = randomFourProducts.map((product) => ({
          ...product,
          product_image: product.product_image[0], // Mostrar solo la primera imagen
        }));
        
        setData(filteredData);
      } catch (error) {
        console.error("Error al obtener las publicaciones:", error);
      }
    };

    fetchData();
  }, []);

  // Función para mezclar aleatoriamente un array (Fisher-Yates shuffle algorithm)
  const shuffle = (array) => {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // Mientras queden elementos a mezclar
    while (currentIndex !== 0) {
      // Seleccionar un elemento sin mezclar restante
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // Intercambiar con el elemento actual
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  return (
    <div className="carousel-home">
      <h2 className="latest-home">Algunas publicaciones</h2>
      <div className="carousel-wrapper">
        <section className="card-wrapper-home">
          {data.map((product, index) => (
            <div
              key={index}
              className={`card-home ${index === currentIndex ? "active" : ""}`}
              style={{ flexBasis: `calc(100% / ${itemsPerPage})` }}
            >
              <img src={product.product_image} alt={product.product_name} />
              <h5>{product.product_name}</h5>
              <p>$ {product.price}</p>
              <Link to={`/product/${product.productId}`} className="link-icon">
                < RiArrowRightSLine/>
              </Link>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Carousel;