import React from 'react'
import { useState } from "react"
import "./register.css"
import { Link } from "react-router-dom"
import { useNavigate } from 'react-router-dom';
import { post } from '../../service/functionsHTTP';


function Register() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("")
    const [lastname, setLastname] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [address, setAddress] = useState("")
    const [identificationNumber, setIdentificationNumber] = useState("")
    const navigateTo = useNavigate();

    const [error, setError] = useState("");

    const urlUsers = "http://localhost:3000/api/users"


    async function registerUser(event) {
        event.preventDefault();

        if (name.length < 3 || name.length > 15) { setError("El nombre debe tener entre 3 y 15 caracteres"); return; }

        if (lastname.length < 3 || lastname.length > 15) { setError("El apellido debe tener entre 3 y 15 caracteres"); return; }

        if (phoneNumber.length < 7 || phoneNumber.length > 15) { setError("El numero de teléfono debe tener entre 7 y 15 caracteres"); return; }

        if (address.length < 4 || address.length > 60) { setError("La direccion debe tener entre 4 y 60 caracteres"); return; }

        if (identificationNumber.length < 7 || identificationNumber.length > 9) { setError("El número de documento debe tener entre 7 y 9 caracteres"); return; }


        if (password.length < 7 || password.length > 30) {
            setError("La contraseña debe tener entre 7 y 30 caracteres");
            return;
        }

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            setError("Ingrese un correo electrónico válido");
            return;
        }

        const newUser = {
            "user_name": name,
            "user_lastname": lastname,
            "user_phoneNumber": phoneNumber,
            "user_address": address,
            "user_identificationNumber": identificationNumber,
            "user_email": email,
            "user_password": password
        };

        const body = newUser;
        const res = await post(urlUsers,body)
        const parsed = await res.json()

        if (parsed.status == 409) {
            setError("Este email ya está registrado");
            return;
        }

        if (parsed.status == 400) {
            setError("Bad request");
            return;
        }

        setError("Se ha registrado con éxito");
        setEmail("")
        setPassword("")
        setName("")
        setLastname("")
        setPhoneNumber("")
        setAddress("")
        setIdentificationNumber("")

        setTimeout(() => {
            setError("")
            navigateTo("/login");
        }, 2000)
    }


    return (

        <div className="container-register">
            <div className='container-form-register'>
                <div className='container-title-register'> 
                  <h1 className="title-register">Registrarse</h1>  
                </div>
                
                <p className="p-error">{error}</p>

                <form onSubmit={event => registerUser(event)} className="form-register">
                    <div className='doble-inputs'>

                        <div >
                            <label htmlFor="name">Nombre</label>
                            <input type="text" id='name' value={name} onChange={event => setName(event.target.value)} minLength={3} maxLength={15} pattern="[A-Za-záéíóúÁÉÍÓÚñÑ\s]+" required />

                        </div>

                        <div className='hola'>
                            <label htmlFor="lastname">Apellido</label>
                            <input type="text" id='lastname' value={lastname} onChange={event => setLastname(event.target.value)} minLength={3} maxLength={15} pattern="[A-Za-záéíóúÁÉÍÓÚñÑ\s]+" required />
                        </div>

                    </div>

                    <label htmlFor="email">Email</label>
                    <input type="email" id='email-register' value={email} onChange={event => setEmail(event.target.value)} required />


                    <label htmlFor="password">Contraseña</label>
                    <input type="password" id='password-register' value={password} onChange={event => setPassword(event.target.value)} minLength={7} maxLength={30} required />

                    <div className='doble-inputs'>

                        <div>
                            <label htmlFor="phoneNumber">Número de teléfono</label>
                            <input type="number" id='phoneNumber' value={phoneNumber} onChange={event => setPhoneNumber(event.target.value)} minLength={7} maxLength={15}
                                title="El número de teléfono debe tener entre 7 y 9 dígitos" pattern="[0-15]{7,15}"
                                required />
                        </div>

                        <div>
                            <label htmlFor="identificationNumber">Número de documento</label>
                            <input type="number" id='identificationNumber' value={identificationNumber}
                                title="El número de documento debe tener entre 7 y 9 dígitos" onChange={event => setIdentificationNumber(event.target.value)}
                                pattern="[0-9]{7,9}" required />
                        </div>
                    </div>

                    <label htmlFor="address">Dirección <span>(Ejemplo: Av. Libertador 123)</span></label>
                    <input type="text" id='address' value={address}
                        onChange={event => setAddress(event.target.value)} minLength={4} maxLength={60} pattern="^[A-Za-z0-9\s]+$" required />


                    <div className='buttons-register'>
                        <button className='btn-form-register' type="submit">Registrarse</button>

                        <Link to={"/login"}>
                            <button id='btn-cancel-register'>Cancelar</button>
                        </Link>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default Register;