import React, { useState, useContext,useEffect } from "react";
import { BsCartPlusFill } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { UserContext } from "../../context/UserContext";


const urlCarts = "http://localhost:3000/api/carts"

const ProductCard = (props) => {
    const { user } = useContext(UserContext);
    const { productId, product_name, price } = props.data;
    const [addedToCart, setAddedToCart] = useState(false);
    const [cart, setCart] = useState([])
    // const idUser = user.sub;
    // console.log(idUser)

    async function getCarts() {

        const res = await fetch(`http://localhost:3000/api/carts`)

        if (!res.ok) {
            console.log("no hay carts");
            return
        }

        const parsed = await res.json();
        const userCart = parsed.find(carts => carts.userId == user.sub);
        console.log(userCart)
        if (!userCart) {
            console.error("Error al encontrar carrito");
        } else{
            console.log("Nuevo carrito del usuario:", userCart);
        }
        setCart(userCart);
    }
useEffect(() => {
    if(user){
    getCarts()}
    }, [user]);

    // Obtener el contexto global del usuario

    // Función para agregar un producto al carrito
    const handleAddToCart = async (productId) => {
        try {
     
               await fetch(`http://localhost:3000/api/carts/1/update`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "userId": user.sub, "productId": productId }),
            });    
            console.log(user.sub)
            // Actualizar el estado para indicar que el producto se ha agregado al carrito
            setAddedToCart(true);
        } catch (error) {
            console.error("Error al agregar el producto al carrito:", error);
        }
    };
    
    
    return (
        <div className="product">
            <div className="slide-var">
                <p>Agregar fotos</p>
            </div>
            <div className="descripcion">
                <p>
                    <b>{product_name}</b>
                </p>
                <p>${price}</p>
                <button className="addToCartBttn"><FaEye /></button>
                <button className="addToCartBttn" onClick={() => handleAddToCart(productId)}>
                    <BsCartPlusFill style={{ color: addedToCart ? "green" : "black" }} />
                </button>
                <button className="addToCartBttn"><FaStar /></button>
            </div>
        </div>
    );
};

export default ProductCard;
