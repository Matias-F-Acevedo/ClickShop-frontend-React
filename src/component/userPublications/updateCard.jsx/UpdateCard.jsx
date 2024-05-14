import React from 'react'
import "./updateCard.css"
import { useContext, useState, useEffect } from "react";
// import { UserContext } from '../../../context/UserContext';
import { MdOutlineDeleteForever } from "react-icons/md";

function UpdateCard() {
    const [editando, setEditando] = useState(false);
    // const { user, handleLogout } = useContext(UserContext);


    const [fotos, setFotos] = useState([]);
    const [fotoPrincipal, setFotoPrincipal] = useState(null);
    const [urlFotoPrincipal, setUrlFotoPrincipal] = useState("src/component/configurationUser/user-icon.jpg");
    // src/component/configurationUser/user-icon.jpg
    let holad = {

        "product_name": "zapatillas",
        "price": 121,
        "stock": 20,
        "description": "sddsdasdasd",
        "condition": "NEW",
        "category_id": 1,
        "user_id": 1

    }
    const handleFileChange = (e) => {


        const files = Array.from(e.target.files);

        if (files.length > 3) {
            alert('Solo puedes seleccionar un máximo de 3 fotos.');
            // Obtener solo las primeras 3 fotos seleccionadas
            const nuevasFotos = files.slice(0, 3).map((file) => URL.createObjectURL(file));
            setFotos(nuevasFotos);
        } else {
            const nuevasFotos = files.map((file) => URL.createObjectURL(file));
            setFotos(nuevasFotos);
        }

    };

    const handleEliminarFoto = (index) => {
        const nuevasFotos = [...fotos];
        nuevasFotos.splice(index, 1);
        setFotos(nuevasFotos);
        if (fotoPrincipal === index) {
            setFotoPrincipal(null);
        }
    };



    const handleEstablecerPrincipal = (index) => {
        setFotoPrincipal(index);
        setUrlFotoPrincipal(fotos[index]);

    };



    function hola() {
        console.log("12312");
    }


    return (
        <>

            <div className='product-update'>

                {editando ?


                    <form action="">
                        <div className='fotosUpdate-producto'>
                            <div className='inputfile-img'>
                                <p>Portada:</p>
                                <div className='foto-principal'>
                                    <img src={urlFotoPrincipal} alt="Foto Principal" />
                                </div>

                                <div className='inputFile-boton'>
                                    <input type="file" multiple accept="image/*" onChange={handleFileChange} />
                                    <p>Subir fotos</p>
                                </div>

                            </div>

                            <div className='container-photos-form'>
                                {fotos.map((fotoURL, index) => (
                                    <div key={index} className='container-photo'>
                                        <img src={fotoURL} alt={`Foto ${index}`} onClick={() => handleEstablecerPrincipal(index)} />
                                        {fotoPrincipal === index}
                                        <MdOutlineDeleteForever className='btn-eliminar-foto' onClick={() => handleEliminarFoto(index)} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='form-datos'>



                            <label htmlFor="product-name">Nombre</label>
                            <input type="text" id='product-name' placeholder='Nombre' minLength={3} maxLength={15} required />





                            <label htmlFor="product-description">Descripción</label>
                            <textarea name="" placeholder='Descripción' id="product-description" required></textarea>


                            <div className='doble-inputs-update'>
                                <div>
                                    <label htmlFor="product-price">Precio</label>
                                    <input type="number" id='product-price' placeholder='Precio' minLength={3} maxLength={15} required />
                                </div>


                                <div>
                                    <label htmlFor="product-stock">Stock</label>
                                    <input type="number" id='product-stock' placeholder='Stock' minLength={3} maxLength={15} required />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="product-condition">Selecciona la condición:</label>
                                <select id="product-condition" name="condicion" required >
                                    <option value="new">Nuevo</option>
                                    <option value="used">Usado</option>
                                </select>
                            </div>


                            <div>

                                <label htmlFor="product-category">Selecciona la categoría:</label>
                                <select id="product-category" name="categoria" required>
                                    <option value="tecnologia">Tecnología</option>
                                    <option value="ropa">Ropa</option>
                                    <option value="hogar">Hogar</option>

                                </select>

                            </div>

                            <div className='botones-form'>
                                <button onClick={() => setEditando(false)}>Cancelar</button>
                                <button >Guardar</button>
                            </div>

                        </div>





                    </form>

                    :
                    <div className='ver-producto-p'>

                        <div className='foto-producto'>


                            <div className='todas-fotos'>
                                <img src="src\component\configurationUser\user-icon.jpg" alt="" />
                                <img src="src\component\configurationUser\user-icon.jpg" alt="" />
                                <img src="src\component\configurationUser\user-icon.jpg" alt="" />
                            </div>

                            <div className='fotoprincipal'>
                                <img src="src\component\configurationUser\user-icon.jpg" alt="" />
                            </div>



                        </div>
                        <div className='box2'>
                            <div className='contenido'>
                                <h3>Product Name</h3>
                                <div className='contenido-caracteristicas'>
                                    <p>Nuevo</p>
                                    <p>Accesorios</p>
                                </div>
                                <hr className='hr-line' />
                                <div className='descipcion-producto'>
                                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facere quidem iusto mollitia tempora non porro assumenda alias debitis dsfsdfsd dfdsf dsfds f!</p>
                                </div>

                                <div className='cantidad-producto'>
                                    <p>30 unidades disponibles</p>
                                </div>

                                <div className='precio-producto'>
                                    <p>$999,99</p>

                                </div>
                            </div>


                            <div className='botones'>
                                <button onClick={() => setEditando(true)} >Editar producto</button>
                            </div>

                        </div>



                    </div>

                }

            </div>




        </>
    )


}

export default UpdateCard;