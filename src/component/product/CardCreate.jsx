import { useContext, useState, useEffect,useRef } from "react";
import { UserContext } from "../../context/UserContext";
import "./cardCreate.css";
import { post, getAll } from "../../service/functionsHTTP";
import Swal from 'sweetalert2';

const urlBase = "http://localhost:3000/api/products";
const urlCategories = "http://localhost:3000/api/categories";


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
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [fileCount, setFileCount] = useState(0);
  const fileInputRef = useRef(null);
  
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

  useEffect(() => {
    setFileCount(selectedFiles.length);
  }, [selectedFiles]);

  const handleConditionChange = (event) => {
    const value = event.target.value;
    setCurrentProduct(prev => ({
      ...prev,
      condition: value
    }));
  };

  const uploadFile = async (file, id) => {
    const url = `http://localhost:3000/api/products/${id}/images`;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.jwt}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error al subir el archivo:', error);
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + selectedFiles.length > 3) {
      fileInputRef.current.value = null;
      setSelectedFiles([]);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Puedes subir un máximo de 3 imágenes',
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
    } else {
      setSelectedFiles(prevFiles => [...prevFiles, ...files]);
    }
  };
  const handleRemoveFile = (index) => {
    setSelectedFiles(prevFiles => {
      const newFiles = prevFiles.filter((_, i) => i !== index);
      if (newFiles.length === 0) {
        fileInputRef.current.value = null;
      }
      return newFiles;
    });

    if (coverImage === index) {
      setCoverImage(null);
    } else if (coverImage > index) {
      setCoverImage(prevCover => prevCover - 1);
    }
  };

  const handleSetCoverImage = (index) => {
    setCoverImage(index);
  };



  const confirmCreateCard = async (event) => {
    event.preventDefault();
    setUploading(true);
    currentProduct.price = parseInt(currentProduct.price);
    currentProduct.stock = parseInt(currentProduct.stock);
    currentProduct.category_id = parseInt(currentProduct.category_id);
    currentProduct.user_id = user.sub;

    try {
      const res = await post(urlBase, currentProduct, user.jwt)

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await res.json();

      let firstImageUploaded = false;

      for (const [index, file] of selectedFiles.entries()) {
        await uploadFile(file, result.productId);
        if (!firstImageUploaded) {
          setCoverImage(index);
          firstImageUploaded = true;
        }
      }

      setCreate(false);
      setRefresh(true);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Producto creado con éxito',
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

    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'No se pudo crear el producto',
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
    } finally {
      setUploading(false);
    }
  };

  function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
  return (
    <div>
      <div className="div-card-creation">
        <form onSubmit={confirmCreateCard}>
          <label>Precio</label>
          <input className="input-cart-creation" type="number" name="price" placeholder="Precio" value={currentProduct.price} onChange={(e) => setCurrentProduct(prev => ({ ...prev, price: e.target.value }))} required />

          <label>Cantidad Disponible</label>
          <input className="input-cart-creation" type="number" name="stock" placeholder="Cantidad" value={currentProduct.stock} onChange={(e) => setCurrentProduct(prev => ({ ...prev, stock: e.target.value }))} required />

          <label>Nombre</label>
          <input className="input-cart-creation" type="text" name="product_name" placeholder="Nombre" minLength={"4"}
            maxLength={"55"} value={currentProduct.product_name} onChange={(e) => setCurrentProduct(prev => ({ ...prev, product_name: e.target.value }))} required />

          <label>Descripción</label>
          <input className="input-cart-creation" minLength={"5"}
            maxLength={"255"} type="text" name="description" placeholder="Descripción" value={currentProduct.description} onChange={(e) => setCurrentProduct(prev => ({ ...prev, description: e.target.value }))} required />

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

          <label>Imágenes (máximo 3)</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            multiple
            ref={fileInputRef}
          />

          <div className="thumbnail-container">
            {selectedFiles.map((file, index) => (
              <div key={index} className="thumbnail">
                <img src={URL.createObjectURL(file)} alt={`Imagen ${index + 1}`} />
                <button className="btn-delete-img" type="button" onClick={() => handleRemoveFile(index)}>Eliminar</button>
                <button className="btn-portada-img" type="button" onClick={() => handleSetCoverImage(index)}>
                  {coverImage === index ? 'Portada' : 'Hacer portada'}
                </button>
              </div>
            ))}
          </div>


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
