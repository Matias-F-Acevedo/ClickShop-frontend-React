import React from 'react'
import "./forgotPassword.css"
import { useState, useContext } from "react"
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
            setError("Compruebe su correo electrónico y siga los pasos para restablecer su contraseña");
            setTimeout(() => {
                navigateTo("/login");
            }, 4000);
            setConditionalRender(false)
            setEmail("")
        }
    }

    return (
        <div className="container-login">
            <div className='container-form'>
                <h2 className="title-login">{
                    conditionalRender ? "Ingresá tu Email" : "Revisa tu Email"
                }</h2>
                <p className="p-error">{error}</p>
                <form onSubmit={event => handleSubmit(event)} className="form-login">
                    {
                        conditionalRender ?
                            <>
                                <label htmlFor="email">Email</label>
                                <input type="email" id='email' value={email} onChange={event => setEmail(event.target.value)} required />
                                <button className='btn-form-login' type="submit">Aceptar</button>
                                <Link to={"/login"}>
                                    <button className='btn-registrarse'>Cancelar</button></Link>

                            </>
                            : <></>
                    }
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword;

