import React, { useContext } from 'react'
import { UserContext } from '../../context/UserContext';
function Cart() {

const user = useContext(UserContext)

async function ProductToCart (userId, newProductId) {
        
        if(!user){
                console.log("no esta el usuario, estas mandando fruta. hijo de puta")
        }

        try {
            await updateOne(userId, newProductId, urlBase);
        } catch (error) {
            console.error(error);

        }

    }
console.log("aca estamos hijo de puta")
  return (
    <div>
        Cart
    </div>
  )
}

export default Cart