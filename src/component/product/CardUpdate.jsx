import "./cardUpdate.css";
import { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "../../context/UserContext";
import { getAll, remove, updatePatch } from "../../service/functionsHTTP";
import Swal from 'sweetalert2';

const urlCategories = "http://localhost:3000/api/categories";


function CardUpdate({ product, setUpdate, refresh, setRefresh }) {
  const { user } = useContext(UserContext);
  const [categories, setCategories] = useState([]);
  const [currentProduct, setCurrentProduct] = useState({
    product_name: product.product_name,
    description: product.description,
    price: product.price,
    category_id: 1,
    stock: product.stock,
    condition: product.condition,
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [fileCount, setFileCount] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setFileCount(selectedFiles.length);
  }, [selectedFiles]);

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
  async function actualizarProducto(event) {
    event.preventDefault();
    try {
      const fullUrl = `http://localhost:3000/api/products/${product.productId}`;

      currentProduct.price = parseInt(currentProduct.price);
      currentProduct.stock = parseInt(currentProduct.stock);
      currentProduct.category_id = parseInt(currentProduct.category_id);
      if (currentProduct.condition == "Usado") {
        currentProduct.condition = "USED"
      }
      else if(currentProduct.condition == "Nuevo"){
        currentProduct.condition = "NEW"
      }

      const res = await updatePatch(fullUrl, currentProduct, user.jwt);
      if (!res.ok) {
        throw new Error('Failed to update product');
      }

      // verificar si hay archivos seleccionados para subir
      if (selectedFiles.length > 0) {
        // eliminar imágenes existentes del producto
        const removeRes = await remove(`http://localhost:3000/api/products/${product.productId}/images`, user.jwt);
        if (!removeRes.ok) {
          throw new Error('Failed to delete existing images');
        }

        setTimeout(async () => {
          // crear una copia de las imagenes seleccionadas
          const filesToUpload = [...selectedFiles];
          
          // verificar si hay una imagen de portada seleccionada
          if (coverImage !== null && coverImage !== 0) {
            // Si hay una imagen de portada, moverla al inicio del array
            const coverFile = filesToUpload.splice(coverImage, 1)[0];
            filesToUpload.unshift(coverFile);
          }
        
          // subir las imagenes en el orden correcto, asegurandose de que la imagen de portada sea la primera
          for (let i = 0; i < filesToUpload.length; i++) {
            await uploadFile(filesToUpload[i], product.productId);
          }
        }, 1000);
      }

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Producto actualizado con éxito',
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
      setUpdate(false);
      setRefresh(true);
    } catch (error) {
      console.error(error);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'No se pudo actualizar el producto',
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
    }
  }

  const handleConditionChange = (event) => {
    const value = event.target.value;
    setCurrentProduct(prev => ({
      ...prev,
      condition: value
    }));
  };

  function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
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


  return (
    <div className="div-card-update">
      <div className="card-actualizar">
        <form className="form-update" onSubmit={(e) => actualizarProducto(e)}>
          <label>Nombre</label>
          <input
            type="text"
            name="date"
            placeholder="Ubicacion"
            minLength={"4"}
            maxLength={"55"}
            value={currentProduct.product_name}
            onChange={(e) =>
              setCurrentProduct((prev) => ({
                ...prev,
                product_name: e.target.value
              }))
            }
            className="input-cardUpdate-product"
            required
          />


          <label>Descripción</label>
          <input
            type="text"
            name="description"
            placeholder="descripcion"
            minLength={"5"}
            maxLength={"255"}
            value={currentProduct.description}
            onChange={(e) =>
              setCurrentProduct((prev) => ({
                ...prev,
                description: e.target.value
              }))
            }
            className="input-cardUpdate-product"
            required
          />

          <label>Precio</label>
          <input
            type="number"
            name="price"
            placeholder="Precio"
            value={currentProduct.price}
            onChange={(e) =>
              setCurrentProduct((prev) => ({ ...prev, price: e.target.value }))
            }
            className="input-cardUpdate-product"
            required
          />

          <label>Stock</label>
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={currentProduct.stock}
            onChange={(e) =>
              setCurrentProduct((prev) => ({ ...prev, stock: e.target.value }))
            }
            className="input-cardUpdate-product"
            required
          />

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
            <button type="submit" className="btn-actualizar">
              Actualizar
            </button>
            <button className="btn-eliminar" onClick={() => setUpdate(false)}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CardUpdate;