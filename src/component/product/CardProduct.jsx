import { deleteOne } from "../../service/functionsHTTP";


function Card({ product, index, setUpdate, setCurrentProduct }) {
  
  
  const {
    product_name,
    price,
    category,
    stock,
    condition,
    product_image
  } = product;

  console.log(product)
  
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
        return console.log("no se pudo eliminar")
      }
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
            <button className='btn-delete btn-accion' onClick={() => deleteProducts(product.productId)}>
              <div className="tooltip">Haz clic para eliminar el producto</div>
              Eliminar
            </button>

            <button className='btn-actualizar btn-accion' onClick={() => selectProducts(product)}>
              Actualizar
              <div className="tooltip">Haz clic para actualizar el producto</div>
            </button>

          </div>
      </div>
    );
  }
  
  export default Card;
  