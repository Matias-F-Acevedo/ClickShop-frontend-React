import "./addressForm.css"
import React, { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { CartContext } from "../../context/CartContext";

const AddressForm = ({ userId, cartItems }) => {
    const { user } = useContext(UserContext);
    const { removeFromCartByAmount} = useContext(CartContext);
    const [formData, setFormData] = useState({
        shippingAddress: '',
        city: '',
        province: '',
        postalCode: '',
        country: ''
    });
    const [preferenceId, setPreferenceId] = useState(null);
    const [message, setMessage] = useState('');
    const [conditional, setConditional] = useState(false);
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setConditional(true)
            removeFromCartByAmount(9999999999999999999999)
            if (Array.isArray(cartItems)) {
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
            } else {
                const order = {
                    user_id: user.sub,
                    ...formData,
                    status: "PENDING",
                    total: parseFloat(cartItems.price)
                }
                const responseOrder = await fetch(`http://localhost:3000/api/order`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.jwt}`
                    },
                    body: JSON.stringify(order)
                });


                if (!responseOrder.ok) {
                    throw new Error('Network response was not ok');
                }

                const orderParsed = await responseOrder.json()

                    const createOrderDetail = {
                    order_id: await orderParsed.order_id,
                    product_id: parseFloat(cartItems.productId),
                    quantity: 1,
                    unitPrice: parseFloat(cartItems.price),
                };
                const responseOrderDetail = await fetch(`http://localhost:3000/api/order-details`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.jwt}`
                    },
                    body: JSON.stringify(createOrderDetail)
                });
                if (!responseOrderDetail.ok) {
                    throw new Error('Network response was not ok');
                }
            }

            const items = Array.isArray(cartItems)
                ? cartItems.map(cartItem => ({
                    id: String(cartItem.product_id),
                    title: cartItem.product.product_name,
                    quantity: cartItem.quantity,
                    unit_price: parseFloat(cartItem.unitPrice),
                }))
                : [{
                    id: String(cartItems.productId),
                    title: cartItems.product_name,
                    quantity: 1,
                    unit_price: parseFloat(cartItems.price),
                }];

            const preferenceResponse = await fetch('http://localhost:3000/api/mercado-pago/create-preference', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.jwt}`
                },
                body: JSON.stringify({ items }),
            });

            const preferenceData = await preferenceResponse.json();
            if (preferenceData && preferenceData.preference && preferenceData.preference.id) {
                setPreferenceId(preferenceData.preference.id);
                const mp = new window.MercadoPago('APP_USR-1c73e37b-3196-4cd2-a5ad-cbf5cc52feec', {
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
            setMessage('Error al realizar el pedido');
        }
    };

    return (
        <div className="address-form-container">
            {conditional? <h2>Proceda a realizar el pago</h2>:
            <h2>Ingrese su domicilio</h2>
            }
            {conditional?<></>:
            <form onSubmit={handleSubmit} className="address-form">
                <div className="form-group">
                    <label>Dirección</label>
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
                <div className="form-group">
                    <label>Ciudad</label>
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
                <div className="form-group">
                    <label>Provincia</label>
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
                <div className="form-group">
                    <label>Código Postal</label>
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
                <div className="form-group">
                    <label>País</label>
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
                <button type="submit" className="submit-button">Comprar Producto</button>
            </form> }
            {message && <p className="message">{message}</p>}
            <div id="wallet_container"></div>
        </div>
    );
};

export default AddressForm;
