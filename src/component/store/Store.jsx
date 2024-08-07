import React, { useEffect, useState, useContext } from "react";
import ProductCard from "./Card";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { getAll } from "../../service/functionsHTTP";
import { LiaShippingFastSolid } from "react-icons/lia";

const URL = "http://localhost:3000/api/products";
const URlCategories = "http://localhost:3000/api/categories";
const PRODUCTS_PER_PAGE = 15;

const Store = () => {

  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(true);
  const [isConditionOpen, setIsConditionOpen] = useState(true);
  const [conditionFilter, setConditionFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    getProducts();
    getCategories();
  }, [user]);

  const getCategories = async () => {
    try {
      const res = await fetch(URlCategories, {
        method: "GET",
      });
      const result = await res.json();
      setCategories([{ id: null, name: "Todas" }, ...result]);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getProducts = async () => {
    try {
      const res = await getAll(URL);
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
      const result = await res.json();
      setProducts(result);
    } catch (error) {
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
    setCurrentPage(1);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (category) => {
    setCategoryFilter(category.id);
    setCurrentPage(1);
  };

  const clearFilter = () => {
    setConditionFilter(null)
    setCategoryFilter(null);
    setMaxPrice("")
    setMinPrice("")
    setCurrentPage(1);
  };

  const filteredProducts = products.filter((product) => {
    const nameMatch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    const priceMatch =
      (!minPrice || product.price >= parseFloat(minPrice)) &&
      (!maxPrice || product.price <= parseFloat(maxPrice));
    const conditionMatch = !conditionFilter || product.condition === conditionFilter;
    const categoryMatch = categoryFilter === null || product.category_id === categoryFilter;
    return nameMatch && priceMatch && conditionMatch && categoryMatch;
  });

  const pageCount = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const productsToShow = filteredProducts.slice(startIndex, endIndex);

  const countByCondition = (condition) => {
    return products.filter((product) => product.condition === condition).length;
  };

  const changePage = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
    window.scrollTo(0, 0);
  };

  const handleLinkClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="shop">
      <div className="contentContainer">
        <div className="shopTitle">
          <div className="eslogan">
            <p className="eslogan-p-oferta">Ofertas</p>
            <p className="eslogan-p">
              ¡Encontrá precios increíbles cada día!
            </p>

          </div>
          <div>
            <input
              className="searchButton"
              type="text"
              placeholder="Buscar producto"
              value={searchTerm}
              onChange={handleSearch}
            /><div className="container-p-results">
              {searchTerm && <p>{filteredProducts.length} resultados encontrados</p>}
            </div>
          </div>

          <div className="eslogan2">
            <p className="eslogan-p-envio">¡Envío gratis a todo el país!</p><LiaShippingFastSolid className="icono-envio"/>
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
                    >Usado ({countByCondition("USED")})
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
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        className={categoryFilter === category.id ? "active" : ""}
                        onClick={() => handleCategoryFilter(category)}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="productsContainer">
            <div className="products">
              {productsToShow.length ?
                productsToShow.map((product) => (
                  <ProductCard key={product.productId} handleLinkClickProduct={() => handleLinkClick(product.productId)} data={product} />
                ))
                :
                <p>Cargando los productos...</p>
              }
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
