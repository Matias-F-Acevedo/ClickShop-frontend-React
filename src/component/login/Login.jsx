import React from 'react'
import "./login.css"
import { useState, useContext } from "react"
import { UserContext } from '../../context/UserContext'
import { decodeToken } from 'react-jwt'
import { Link } from "react-router-dom"

function Login() {

    // con useContext uso el estado global del UserContext
    const { user, handleLogin } = useContext(UserContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");


    const urlLogin = "http://localhost:3000/api/auth/login"


    async function checkUser(email, password) {
        const res = await fetch(urlLogin, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password }),
        });
        if (!res.ok) return false;

        const parsed = await res.json()
        return parsed
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (email === "" || password === "") {
            setError("Enter all fields.");
            return

        } else {

            const res = await checkUser(email, password)

            if (!res) {
                setError("La Contraseña o Email son incorrectos.");
                return;
            } 
            
            if (res.status == 404) {
                setError("Este Email no está registrado");
                return;
            }

                handleLogin({ ...decodeToken(res.access_token), jwt: res.access_token });
                setError("Inicio de sesión exitoso.");
                setPassword("")
                setEmail("")
        }
    }

    return (
        <div className="container-login">
            <div className='title-buttonPassword'>
                <h1>Ingresá tu e-mail y contraseña</h1>
                <Link to={"/forgot-password"}>
                <button>¿Olvidaste tu contraseña?</button>
               </Link>
            </div>
            <div className='line'></div>
            <div className='container-form'>
                <h2 className="title-login">Iniciar sesión</h2>
                <p className="p-error">{error}</p>
                <form onSubmit={event => handleSubmit(event)} className="form-login">
                    <label htmlFor="email">Email</label>
                    <input type="email" id='email' value={email} onChange={event => setEmail(event.target.value)} required />
                    <label htmlFor="password">Contraseña</label>
                    <input type="password" id='password' value={password} onChange={event => setPassword(event.target.value)} required />
                    <button className='btn-form-login' type="submit">Iniciar sesión</button>
                    <Link to={"/login-register"}>
                        <button className='btn-registrarse'>Crear cuenta</button></Link>
                </form>
            </div>
        </div>
    )
}

export default Login;