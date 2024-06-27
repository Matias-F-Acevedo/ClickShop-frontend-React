import "./store.css";
import React, { useEffect, useState, useContext } from "react";
import ProductCard from "./Card";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { getAll } from "../../service/functionsHTTP";

const URL = "http://localhost:3000/api/products";

const PRODUCTS_PER_PAGE = 15;

const Store = () => {
  const { user } = useContext(UserContext);

  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(false);

  const [isConditionOpen, setIsConditionOpen] = useState(false);
  const [conditionFilter, setConditionFilter] = useState("");  

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (user) { getProducts() };
  },
    [currentPage, user]); // Se vuelve a cargar cuando cambia la página

    
  const getProducts = async () => {
    try {
      const res = await getAll(URL, user.jwt)
      
      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }

      const result = await res.json();
      setProducts(result);

    }
    catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTogglePriceRange = () => {
    setIsPriceRangeOpen(!isPriceRangeOpen);
  };

  const handleMinPriceChange = (event) => {
    setMinPrice(event.target.value);
  };

  const handleMaxPriceChange = (event) => {
    setMaxPrice(event.target.value);
  };

  const handleToggleCondition = () => {
    setIsConditionOpen(!isConditionOpen);
  };

  const handleConditionFilter = (condition) => {
    setConditionFilter(condition);
    setCurrentPage(1); // Reiniciar la página al cambiar el filtro
  };

  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
    setCurrentPage(1);
  };

  // Filtrar los productos según los filtros seleccionados
  const filteredProducts = products.filter((product) => {
    const nameMatch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    const priceMatch =
      (!minPrice || product.price >= parseFloat(minPrice)) &&
      (!maxPrice || product.price <= parseFloat(maxPrice));
    const conditionMatch = !conditionFilter || product.condition === conditionFilter;
    const categoryMatch = !categoryFilter || product.category === categoryFilter;

    return nameMatch && priceMatch && conditionMatch && categoryMatch;
  });

  // Calcula la cantidad de paginas segun el número total de productos
  const pageCount = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  // Calcula el índice inicial y final de los productos en función de la página actual
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;

  // Filtra los productos y muestra solo los que están en el rango de índices calculado
  const productsToShow = filteredProducts.slice(startIndex, endIndex);

  const countByCondition = (condition) => {
    return products.filter((product) => product.condition === condition).length;
  };

  const changePage = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll hasta la parte superior de la página
  };


  const handleLinkClick = (productId) => {
    navigate(`/product/${productId}`);
  };



  return (
    <div className="shop">
      <div className="contentContainer">
        <div className="shopTitle">
          <input
            className="searchButton"
            type="text"
            placeholder="Buscar producto"
            value={searchTerm}
            onChange={handleSearch}
          />
          <div className="container-p-results">
            {searchTerm && <p>{filteredProducts.length} resultados encontrados</p>}
          </div>
        </div>
        <div className="grl-container">
          <div className="sidebar">
            <div className="filtersContainer">
              <div className="priceRange">
                <button onClick={handleTogglePriceRange}>
                  Rango de precio
                </button>
                {isPriceRangeOpen && (
                  <div className="priceRangeContent">
                    <input
                      type="number"
                      placeholder="Precio mínimo"
                      value={minPrice}
                      onChange={handleMinPriceChange}
                    />
                    <input
                      type="number"
                      placeholder="Precio máximo"
                      value={maxPrice}
                      onChange={handleMaxPriceChange}
                    />
                  </div>
                )}
              </div>
              <div className="conditionFilter">
                <button onClick={handleToggleCondition}>
                  Condición
                </button>
                {isConditionOpen && (
                  <div className="conditionFilterContent">
                    <button
                      className={conditionFilter === "" ? "active" : ""}
                      onClick={() => handleConditionFilter("")}
                    >
                      Todos ({products.length})
                    </button>
                    <button
                      className={conditionFilter === "NEW" ? "active" : ""}
                      onClick={() => handleConditionFilter("NEW")}
                    >
                      Nuevo ({countByCondition("NEW")})
                    </button>
                    <button
                      className={conditionFilter === "USED" ? "active" : ""}
                      onClick={() => handleConditionFilter("USED")}
                    >
                     Usado ({countByCondition("USED")})
                    </button>
                  </div>
                )}
              </div>
              <div className="categoryFilter">
                <button onClick={() => setIsCategoryOpen(!isCategoryOpen)}>
                  Categoría
                </button>
                {isCategoryOpen && (
                  <div className="categoryFilterContent">
                    <button
                      className={categoryFilter === "" ? "active" : ""}
                      onClick={() => handleCategoryFilter("")}
                    >
                      Todas
                    </button>
                    <button
                      className={categoryFilter === "ELECTRONICS" ? "active" : ""}
                      onClick={() => handleCategoryFilter("ELECTRONICS")}
                    >
                      Electrónica
                    </button>
                    <button
                      className={categoryFilter === "CLOTHES" ? "active" : ""}
                      onClick={() => handleCategoryFilter("CLOTHES")}
                    >
                      Indumentaria
                    </button>
                    <button
                      className={categoryFilter === "ACCESORIES" ? "active" : ""}
                      onClick={() => handleCategoryFilter("ACCESORIES")}
                    >
                      Accesorios
                    </button>
                    <button
                      className={categoryFilter === "AUTOMOTIVE" ? "active" : ""}
                      onClick={() => handleCategoryFilter("AUTOMOTIVE")}
                    >
                      Automotriz
                    </button>
                    <button
                      className={categoryFilter === "PETS" ? "active" : ""}
                      onClick={() => handleCategoryFilter("PETS")}
                    >
                      Mascotas
                    </button>
                    <button
                      className={categoryFilter === "HOME" ? "active" : ""}
                      onClick={() => handleCategoryFilter("HOME")}
                    >
                      Hogar y cocina
                    </button>
                    <button
                      className={categoryFilter === "HEALTH" ? "active" : ""}
                      onClick={() => handleCategoryFilter("HEALTH")}
                    >
                      Salud y belleza
                    </button>
                    <button
                      className={categoryFilter === "SPORTS" ? "active" : ""}
                      onClick={() => handleCategoryFilter("SPORTS")}
                    >
                      Deportes y aire libre
                    </button>
                    <button
                      className={categoryFilter === "GAMES" ? "active" : ""}
                      onClick={() => handleCategoryFilter("GAMES")}
                    >
                      Juguetes y juegos
                    </button>
                    <button
                      className={categoryFilter === "BOOKSMUSIC" ? "active" : ""}
                      onClick={() => handleCategoryFilter("BOOKSMUSIC")}
                    >
                      Libros y musica
                    </button>
                    <button
                      className={categoryFilter === "FOOD" ? "active" : ""}
                      onClick={() => handleCategoryFilter("FOOD")}
                    >
                      Alimentos y comida
                    </button>
                    <button
                      className={categoryFilter === "ART" ? "active" : ""}
                      onClick={() => handleCategoryFilter("ART")}
                    >
                      Arte y decoracion
                    </button>
                   
                  </div>
                )}
              </div>
            </div>
           </div>
           <div className="productsContainer">
            <div className="products">
              {productsToShow.map((product) => (
                <ProductCard key={product.product_name} handleLinkClickProduct={() => handleLinkClick(product.productId)} data={product} />
              ))}
            </div>
            {pageCount > 1 && (
              <div className="pagination">
                {Array.from({ length: pageCount }, (_, i) => (
                  <button
                    key={i + 1}
                    className={currentPage === i + 1 ? "active" : ""}
                    onClick={() => changePage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Store;