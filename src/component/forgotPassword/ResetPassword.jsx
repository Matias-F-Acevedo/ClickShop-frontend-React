import React from 'react'
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useNavigate, useLocation } from 'react-router-dom';
import "./resetPassword.css"

function ResetPassword() {


    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [token, setToken] = useState("");
    const [conditionalRender, setConditionalRender] = useState(true);
    const navigateTo = useNavigate();
    const location = useLocation();



    const urlResetPassword = "http://localhost:3000/api/auth/reset-password"


    async function sendRequest(resetPasswordToken, password) {
        const res = await fetch(urlResetPassword, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ resetPasswordToken: resetPasswordToken, password: password }),
        });
        if (!res.ok) { return false };

        const parsed = await res.json()
        return parsed
    }


    useEffect(() => {
        // Obtenemos la cadena de consulta de la URL
        const searchParams = new URLSearchParams(location.search);
        // Extraer el valor del parámetro 'token'
        const token = searchParams.get('token');

        if (!token) {
            // Si no se encuentra el token en la URL, redirigir al usuario a una página de error o a la página de inicio de sesión.
            navigateTo("/login")
        }

        setToken(token)
    }, [location, history]);


    async function handleSubmit(event) {
        event.preventDefault();

        if (password === "" || confirmPassword === "") {
            setError("Introduzca todos los campos.");
            return

        } else if (password !== confirmPassword) {
            setError("Las contraseñas no son iguales.");
            return
        } else {


            const res = await sendRequest(token, password)

            if (!res) {
                setError("Formato de datos incorrecto.");
                return;
            }

            if (res.status == 404) {
                setError("");
                setTimeout(() => {
                    navigateTo("/login");
                }, 3000);

                setConditionalRender(false)

                return;
            }


            setError("La contraseña se ha cambiado con éxito");
            setTimeout(() => {
                navigateTo("/login");
            }, 2000);
            setPassword("")
            setConfirmPassword("")
        }
    }

    return (
        <div className="container-reset-password">
            <div className='container-h1'>
                <h1>Ingresá tu nueva contraseña.</h1>
                <p className='menssage-forgot-password'> Utiliza una combinación de letras, números y caracteres especiales para crear contraseñas seguras, evita usar la misma contraseña en múltiples servicios.</p>
            </div>
            <div className='line'></div>

            <div className='container-form-reset-password'>

{
                    conditionalRender ?
                <h2 className="title-forgot-password">Restablecer contraseña</h2>
                : 
                <div className='container-title-verification'>
                    <h3 className="title-verification-forgot-password">Lo siento, tu solicitud para cambiar la contraseña ha sido rechazada. Por favor, Intenta nuevamente más tarde! Gracias.</h3>
                </div>
                }

                <p className="p-error">{error}</p>
                <form onSubmit={event => handleSubmit(event)} className="form-reset-password">
                    {
                        conditionalRender ?
                            <>
                                <label htmlFor="new-password">Nueva contraseña</label>
                                <input type="password" id='new-password' value={password} onChange={event => setPassword(event.target.value)} minLength={7} maxLength={30} required />


                                <label htmlFor="confirm-password">Cofirmar contraseña</label>
                                <input type="password" id='confirm-password' value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} minLength={7} maxLength={30} required />


                                <button className='btn-form-reset-password' type="submit">Enviar</button>
                                <Link to={"/login"}>
                                    <button id='btn-cancel-reset-password'>Cancelar</button></Link>
                            </>
                            : <></>
                    }
                </form>
            </div>
        </div>
    )
}

export default ResetPassword;