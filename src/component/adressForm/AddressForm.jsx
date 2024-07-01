import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';

function AddressForm({ userId, cartItems }) {
    const [formData, setFormData] = useState({
        shippingAddress: '',
        city: '',
        province: '',
        postalCode: '',
        country: ''
    });

    const [preferenceId, setPreferenceId] = useState(null);
    const [message, setMessage] = useState('');
    const { user } = useContext(UserContext);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/api/cart/${userId}/checkout`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.jwt}`
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setMessage(data.message);
            console.log(cartItems);

            const items = cartItems.map(cartItem => ({
                id: String(cartItem.product_id), // Verifica que sea product_id
                title: cartItem.product.product_name, // Asegúrate de que el nombre del producto sea correcto
                quantity: cartItem.quantity,
                // currency_id: "ARS", // O la moneda que estés usando
                unit_price: parseFloat(cartItem.unitPrice), // Asegúrate de que el precio unitario sea un número
            }));
            console.log('Items to be sent:', items);

            const preferenceResponse = await fetch('http://localhost:3000/api/mercado-pago/create-preference', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.jwt}`
                },
                body: JSON.stringify({ items }),
            });

            const preferenceData = await preferenceResponse.json();
            console.log('Preference data:', preferenceData);
            if (preferenceData && preferenceData.preference && preferenceData.preference.id) {
                setPreferenceId(preferenceData.preference.id);
                const mp = new window.MercadoPago('TEST-fbb21b25-5a77-4f05-8c57-7eb3b13c5bda', {
                    locale: 'es-AR'
                });

                mp.bricks().create("wallet", "wallet_container", {
                    initialization: {
                        preferenceId: preferenceData.preference.id,
                    },
                });
            } else {
                throw new Error('Error al crear la preferencia de pago');
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            setMessage('Error placing order');
        }
    };

    useEffect(() => {
        if (preferenceId) {
            const mp = new window.MercadoPago('TEST-fbb21b25-5a77-4f05-8c57-7eb3b13c5bda', {
                locale: 'es-AR'
            });

            mp.bricks().create("wallet", "wallet_container", {
                initialization: {
                    preferenceId,
                },
            });
        }
    }, [preferenceId]);

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
