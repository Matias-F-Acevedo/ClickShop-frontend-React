import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { addOne } from "../../service/functionsHTTP";
import "./cardCreate.css";

const urlBase = "http://localhost:3000/api/products";

function CardCreate({ setCreate, refresh, setRefresh }) {
  const { user } = useContext(UserContext);
  const [currentProduct, setCurrentProduct] = useState({
    "product_name": "",
    "price": 0,
    "stock": 0,
    "description": "",
    "condition": "",
    "category_id": "",
    "user_id": "",
  });

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleConditionChange = (event) => {
    const value = event.target.value;
    setCurrentProduct(prev => ({
      ...prev,
      condition: value
    }));
  };

  const uploadFile = async (file, id) => {
    console.log(file, id);
    const url = `http://localhost:3000/api/products/${id}/images`;
    const formData = new FormData();
    formData.append('file', file);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization:`Bearer ${user.jwt}`
                },
           body: formData,
        });

        if (!response.ok) {
          console.log(await response.json());
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Archivo subido con éxito:', result);
    } catch (error) {
      console.log(error);
        console.error('Error al subir el archivo:', error);
    }
};

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
      setSelectedFile(file);
  }
};

  const confirmCreateCard = async (event) => {
    event.preventDefault();
    setUploading(true);
    currentProduct.price = parseInt(currentProduct.price);
    currentProduct.stock = parseInt(currentProduct.stock);
    currentProduct.category_id = parseInt(currentProduct.category_id);
    currentProduct.user_id = user.sub;
    console.log(currentProduct);
    try {
      const response = await fetch(urlBase, {
        method: 'POST', headers: { "Content-Type": "application/json",
          Authorization:`Bearer ${user.jwt}`
          },
        body: JSON.stringify(currentProduct),
    });
    const result= await response.json();
            
    if(selectedFile){
      await uploadFile(selectedFile, result.productId);
    }
   
      setCreate(false);
      setRefresh(true);
  
    } catch (error) {
        console.error('Error:', error);
    } finally {
        setUploading(false);
    }
  };

  return (
    <div>
      <div className="div-card-creation">
        <form onSubmit={confirmCreateCard}>
          <label>Precio</label>
          <input className="input-cart-creation" type="number" name="price" placeholder="Precio" value={currentProduct.price} onChange={(e) => setCurrentProduct(prev => ({ ...prev, price: e.target.value }))} required />

          <label>Cantidad Disponible</label>
          <input className="input-cart-creation" type="number" name="stock" placeholder="Cantidad" value={currentProduct.stock} onChange={(e) => setCurrentProduct(prev => ({ ...prev, stock: e.target.value }))} required />

          <label>Nombre</label>
          <input className="input-cart-creation" type="text" name="product_name" placeholder="Nombre" minLength="4" value={currentProduct.product_name} onChange={(e) => setCurrentProduct(prev => ({ ...prev, product_name: e.target.value }))} required />

          <label>Descripción</label>
          <input className="input-cart-creation" type="text" name="description" placeholder="Descripción" value={currentProduct.description} onChange={(e) => setCurrentProduct(prev => ({ ...prev, description: e.target.value }))} required />

          <label>Categoria</label>
          <input className="input-cart-creation" type="number" name="category" placeholder="Categoria" value={currentProduct.category_id} onChange={(e) => setCurrentProduct(prev => ({ ...prev, category_id: e.target.value }))} required />

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

          <label>Imagen</label>

          <input
           type="file"
           onChange={handleFileChange}
            accept="image/*"
           />

          <div className="container-btns">
            <button className='btn-confirmar-crear' type="submit" disabled={uploading}>
              {uploading ? 'Subiendo...' : 'Crear'}
            </button>
            <button className="btn-eliminar" type="button" onClick={() => setCreate(false)}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CardCreate;
