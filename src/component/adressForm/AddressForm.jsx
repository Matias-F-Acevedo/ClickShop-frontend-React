import React, { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
function AddressForm({ userId, product, cartItem }) {
  

  
  const [formData, setFormData] = useState({
    shippingAddress: '',
    city: '',
    province: '',
    postalCode: '',
    country: ''
  });

  
  // const [order, setOrder] = useState([])
  const [preferenceId, setPreferenceId] = useState(null);
  
  const [message, setMessage] = useState('');
  const {user} = useContext(UserContext)  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  // const checkout = formData
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/cart/${userId}/checkout`, {
        method: 'POST',
        headers: { "Content-Type": "application/json",
          Authorization:`Bearer ${user.jwt}`
          },
        body: JSON.stringify(formData)
      });
      console.log(response)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      // setOrder(data)
      setMessage(data.message);
      console.log(data)

      const item = [
        {
          title: product.product_name,
          quantity: cartItem.quantity,
          unit_price: product.price,
        }
      ];
      console.log("item product, is here?",item)

      const preferenceResponse = await fetch('http://localhost:3000/api/mercado-pago/create-preference', {
        method: 'POST',
        headers: { "Content-Type": "application/json",
          Authorization:`Bearer ${user.jwt}`
          },
        body: JSON.stringify(item),
      });

      const preferenceData = await preferenceResponse.json();
      console.log(preferenceData)
      if (preferenceData) {
        setPreferenceId(preferenceData);
        // Redirigir al usuario al checkout de Mercado Pago
       console.log(window.MercadoPago)
        const mp = await new window.MercadoPago('TEST-fbb21b25-5a77-4f05-8c57-7eb3b13c5bda', {
          locale: 'es-AR'
        });
    
        mp.bricks().create("wallet", "wallet_container", {
          initialization: {
            preferenceId: preferenceData.id,
          },
        });
      } else {
        console.error('Error al crear la preferencia de pago:', preferenceData);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      setMessage('Error placing order');
    }
  };

  return (
    <div>
      <h2>Enter Shipping Address</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Shipping Address:</label>
          <input
            type="text"
            name="shippingAddress"
            value={formData.shippingAddress}
            onChange={handleChange}
            minLength={4}
            maxLength={60}
            required
          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            minLength={4}
            maxLength={60}
            required
          />
        </div>
        <div>
          <label>Province:</label>
          <input
            type="text"
            name="province"
            value={formData.province}
            onChange={handleChange}
            minLength={4}
            maxLength={60}
            required
          />
        </div>
        <div>
          <label>Postal Code:</label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            minLength={4}
            maxLength={60}
            required
          />
        </div>
        <div>
          <label>Country:</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            minLength={4}
            maxLength={60}
            required
          />
        </div>
        <button type="submit">Comprar Producto</button>
      </form>
      {message && <p>{message}</p>}
      <div id="wallet_container"></div>
    </div>
  );
}

export default AddressForm;
