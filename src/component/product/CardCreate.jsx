import { UserContext } from "../../context/UserContext";
import { addOne } from "../../service/functionsHTTP";
import { useContext, useState } from "react";
import "./card.css"
 
const urlBase = "http://localhost:3000/api/products"

function CardCreate({ setCreate , refresh, setRefresh, }) {


    const [currentProduct, setCurrentProduct] = useState(
    {

        "product_name":"",
        "price":"",
        "stock":20,
        "description":"",
        "condition":"NEW",
        "category_id":1,
        "user_id":1
    
    });

  function confirmCreateCard(event) {
    console.log("hola");
        event.preventDefault();
        currentProduct.price = parseInt(currentProduct.price);
        // currentProduct.category = parseInt(currentProduct.category);
        // currentProduct.user = 1;
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

                        <label>Nombre</label>
                        <input type="text" name="product_name" placeholder="nombre" minLength={"4"} value={currentProduct.product_name} onChange={(e) => { setCurrentProduct(prev => ({ ...prev, product_name: e.target.value })) }} required />

                        <label>Descripción</label>
                        <input type="text" name="description" placeholder="descripcion" value={currentProduct.description} onChange={(e) => { setCurrentProduct(prev => ({ ...prev, description: e.target.value })) }} required />

                        {/* <label>Categoria</label>
                        <input type="number" name="category" placeholder="categoria" value={currentProduct.category} onChange={(e) => { setCurrentProduct(prev => ({ ...prev, category: e.target.value })) }} required /> */}

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