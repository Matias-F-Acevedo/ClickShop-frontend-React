import React from 'react'
import "./forgotPassword.css"
import { useState} from "react"
import { Link } from "react-router-dom"
import { useNavigate } from 'react-router-dom';
function ForgotPassword() {



    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [conditionalRender, setConditionalRender] = useState(true);
    const navigateTo = useNavigate();

    const urlRequestResetPassword = "http://localhost:3000/api/auth/request-reset-password"


    async function sendRequest(email) {
        const res = await fetch(urlRequestResetPassword, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email }),
        });
        if (!res.ok) {
            return false
        };

        const parsed = await res.json()
        return parsed
    }


    async function handleSubmit(event) {
        event.preventDefault();

        if (email === "") {
            setError("Enter an email.");
            return

        } else {

            const res = await sendRequest(email)
            if (!res) {
                setError("Formato incorrecto de Email");
                return;
            }

            if (res.status == 404) {
                setError("Este Email no está registrado");
                return;
            }
            setError("");
            setTimeout(() => {
                navigateTo("/login");
            }, 4000);
            setConditionalRender(false)
            setEmail("")
        }
    }
 
    return (
        <div className="container-forgot-password">
            <div className='container-h1'>
                <h1>Necesitamos verificar su identidad.</h1>
                <p className='menssage-forgot-password'>Recibirá un correo con los pasos a seguir para restablecer su contraseña.</p>
            </div>

            <div className='line-forgot-password'></div>
            <div className='container-form-forgot-password'>

            {
                    conditionalRender ?
                <h2 className="title-forgot-password">Ingresá tu email</h2>
                : 
                <div className='container-title-verification'>
                    <h3 className="title-verification-forgot-password">Listo, verifique su email y siga los pasos.</h3>
                </div>
                
                }
                <p className="p-error">{error}</p>
                <form onSubmit={event => handleSubmit(event)} className="form-forgot-password">
                    {
                        conditionalRender ?
                            <>
                                <label htmlFor="email">Email</label>
                                <input type="email" id='email' value={email} onChange={event => setEmail(event.target.value)} required />

                                <button className='btn-form-forgot-password' type="submit">Aceptar</button>
                                <Link to={"/login"}>
                                    <button id='btn-cancel-forgot-password'>Cancelar</button></Link>

                            </>
                            : <></>
                    }
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword;

