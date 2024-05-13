import { UserContext } from "../../context/UserContext";
import { addOne } from "../../service/functionsHTTP";
import { useContext, useState } from "react";
import "./userProduct.css"
 
const urlBase = "http://localhost:3000/api/products";
const urlUsers = ""

function CardCreate({ setCreate , refresh, setRefresh, }) {

    const {user} = useContext(UserContext);

    const [currentProduct, setCurrentProduct] = useState(
    {

        "product_name":"",
        "price":"",
        "stock":"",
        "description":"",
        "condition":"",
        "category_id": null,
        "user_id":""
    
    });

    const handleConditionChange = (event) => {
        const value = event.target.value;
        setCurrentProduct(prev => ({
            ...prev,
            condition: value
        }));
    };

  function confirmCreateCard(event) {
        event.preventDefault();
        currentProduct.price = parseInt(currentProduct.price);
        currentProduct.stock = parseInt(currentProduct.stock);
        currentProduct.category_id = parseInt(currentProduct.category_id);
        currentProduct.user_id = user.sub;
        console.log(currentProduct)
        addOne(currentProduct, urlBase)

        setCreate(false)
        setRefresh(true)

        }
    

    return (
        <>
            <div>
                <div className="card-actualizar">
                    <form onSubmit={(e) => confirmCreateCard(e)}>
                    <label>Precio</label>
                        <input type="number" name="price" placeholder="Precio" value={currentProduct.price} onChange={(e) => { setCurrentProduct(prev => ({ ...prev, price: e.target.value })) }} required />

                        <label>Cantidad Disponible</label>
                        <input type="number" name="stock" placeholder="Cantidad" value={currentProduct.stock} onChange={(e) => { setCurrentProduct(prev => ({ ...prev, stock: e.target.value })) }} required />

                        <label>Nombre</label>
                        <input type="text" name="product_name" placeholder="nombre" minLength={"4"} value={currentProduct.product_name} onChange={(e) => { setCurrentProduct(prev => ({ ...prev, product_name: e.target.value })) }} required />

                        <label>Descripción</label>
                        <input type="text" name="description" placeholder="descripcion" value={currentProduct.description} onChange={(e) => { setCurrentProduct(prev => ({ ...prev, description: e.target.value })) }} required />

                        <label>Categoria</label>
                        <input type="number" name="category" placeholder="categoria" value={currentProduct.category_id} onChange={(e) => { setCurrentProduct(prev => ({ ...prev, category_id: e.target.value })) }} required />
                        
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

                        <div className="container-btn-confirmar-crear">
                            <button className='btn-confirmar-crear' type="submit">Crear</button>
                        </div>
                    </form>

                    <div className="container-btn-confirmar-cancelar">
                        <button className="btn-eliminar" onClick={() => setCreate(false)}>Cancelar</button>
                        </div>

                </div>
            </div>
        </>
    )


}  


export default CardCreate;