import React, { useState, useContext,useEffect } from "react";
import { BsCartPlusFill } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { UserContext } from "../../context/UserContext";
import { addOne } from "../../service/functionsHTTP";


const ProductCard = (props) => {
    const { user } = useContext(UserContext);
    const URLCartUser = `http://localhost:3000/api/carts/${user.sub}/update`;
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
        console.log(parsed)
        const userCart = parsed.find(cart => cart.userId === parseInt(user.sub));
        console.log(userCart)
        if (!userCart) {
            console.error("Error al encontrar carrito. Se intentará crear uno nuevo.");
            try {
                const userId = parseInt(user.sub)
                const newUserCart = await fetch(URLCarts, {
                    method: "POST",
                    headers: { "Content-Type": "application/json"
                  },
                    body: JSON.stringify({userId: userId}),
                  })
                
                    .then((res) => res.json()).then((parsed)=>console.log(parsed)).catch((err) => console.error(err));
                
                console.log("Nuevo carrito creado para el usuario usuario:");
            
            } catch (error) {
                console.error("Error al crear el carrito:", error);
            }
        } else {
            console.log("Carrito encontrado:", userCart);
            setCart(userCart);
        }
    }
useEffect(() => {
    if(user){
    getCarts()}
    }, [user]);

    // Obtener el contexto global del usuario

    // Función para agregar un producto al carrito
    const handleAddToCart = async (productId) => {
        try {
     
               await fetch(URLCartUser, {
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
