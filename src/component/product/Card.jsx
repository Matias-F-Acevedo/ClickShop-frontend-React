import "./card.css"
import { deleteOne } from "../../service/functionsHTTP";


function Card({ product, index, setUpdate, setCurrentProduct }) {
  
  
  const {
    product_name,
    description,
    price,
    category,
    stock,
    condition
  } = product;
  
  if(product.condition = "NEW"){
    product.condition = "Nuevo"
  }
  else {
    product.condition = "Usado"
  }
  // Verificar si category es null antes de acceder a su propiedad name
  const categoryName = category ? category.name : 'Sin categoría';
  
  async function deleteProducts(idProducts) {
    
    const urlBase = `http://localhost:3000/api/products`
    if (idProducts) {
      deleteOne(idProducts, urlBase)
      //setRefresh(true)
    } else {
        return console.log("no se pudo eliminar, anda a saber porque")
      }
    }
  
  
    async function selectProducts(product) {
      setUpdate(true)
      setCurrentProduct(product)
    }
  
    return (
      <div key={index} className="product">
        <img src="" alt="" />
        <div className="product-details">
          <h2 className="product-name">{product_name}</h2>
          <p className="product-price">Price: ${price}</p>
          <p className="product-category">Category: {categoryName}</p>
          <p className="product-stock">Cantidad disponible: {stock}</p>
          <p className="product-condition">Estado: {condition}</p>
          <p className="descripcion">{description}</p>
          <div className='div-botones'>
            <button className='btn-eliminar btn-accion' onClick={() => deleteProducts(product.productId)}>
              <div className="tooltip">Haz clic para eliminar el producto</div>
              Eliminar
            </button>

            <button className='btn-actualizar btn-accion' onClick={() => selectProducts(product)}>
              Actualizar
              <div className="tooltip">Haz clic para actualizar el producto</div>
            </button>

          </div>
        </div>
      </div>
    );
  }
  
  export default Card;
  