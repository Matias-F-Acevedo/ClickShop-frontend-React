import React from 'react';
import AddressForm from './AddressForm';
import { UserContext } from '../../context/UserContext';
import { useContext } from 'react';

function BuyProduct({ product, cartItem }) {
    const { user } = useContext(UserContext);
    const userId = user.sub; // Reemplaza esto con el ID del usuario actual
  console.log(cartItem)
    return (
        <div>
            <h2>Detalles del Producto:</h2>
            <p>Nombre: {product.product_name}</p>
            <p>Precio: ${product.price}</p>
            <p>Cantidad: {cartItem.quantity}</p>

            <AddressForm 
                userId={userId}
                product={product}
                cartItem={cartItem}
            />
        </div>
    );
}

export default BuyProduct;
