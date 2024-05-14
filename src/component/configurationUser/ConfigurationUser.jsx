import React from 'react'
import "./configurationUser.css"
import { Link } from "react-router-dom"
import { useContext, useState, useEffect } from "react";
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import ChangePassword from './ChangePassword';


function ConfigurationUser() {


    const { user, handleLogout } = useContext(UserContext);
    const [renderConditional, setrRenderConditional] = useState(true);


    const [email, setEmail] = useState("");
    const [name, setName] = useState("")
    const [lastname, setLastname] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [address, setAddress] = useState("")
    const [identificationNumber, setIdentificationNumber] = useState("")
    const [error, setError] = useState("");
    const navigateTo = useNavigate();


    async function fetchUserData() {
        try {
            const response = await fetch(`http://localhost:3000/api/users/${user.sub}`)
            if (response.ok) {
                const data = await response.json();
                setEmail(data.user_email)
                setName(data.user_name)
                setLastname(data.user_lastname)
                setPhoneNumber(data.user_phoneNumber)
                setIdentificationNumber(data.user_identificationNumber)
                setAddress(data.user_address)
            } else {
                console.error('Error al obtener los datos del usuario');
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    };



    useEffect(() => {
        if (user) {
            fetchUserData();
        }
    }, [user]);


    async function updateUser(event) {
        event.preventDefault();

        if (name.length < 3 || name.length > 15) { setError("El nombre debe tener entre 3 y 15 caracteres"); return; }

        if (lastname.length < 3 || lastname.length > 15) { setError("El apellido debe tener entre 3 y 15 caracteres"); return; }

        if (phoneNumber.length < 7 || phoneNumber.length > 15) { setError("El número de teléfono debe tener entre 7 y 15 caracteres"); return; }

        if (address.length < 4 || address.length > 60) { setError("La dirección debe tener entre 4 y 60 caracteres"); return; }

        if (identificationNumber.length < 7 || identificationNumber.length > 9) { setError("El número de documento debe tener entre 7 y 9 caracteres"); return; }

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            setError("Ingrese un correo electrónico válido");
            return;
        }

        const userEdit = {
            "user_name": name,
            "user_lastname": lastname,
            "user_phoneNumber": phoneNumber,
            "user_address": address,
            "user_identificationNumber": identificationNumber,
            "user_email": email,

        };

        if (email == user.email) {
            delete userEdit.user_email
        }



        const res = await fetch(`http://localhost:3000/api/users/${user.sub}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userEdit),
        })
        const parsed = await res.json()

        if (parsed.status == 409) {
            setError("Este email ya está registrado");
            return;
        }

        if (parsed.status == 400) {
            setError("Bad request");
            return;
        }

        setError("Se ha modificado con éxito, debera ingresar nuevamente");

        setTimeout(() => {
            handleLogout()
            navigateTo("/login");
        }, 2000)
    }





    return (
        <>

            <div className="container">

                <div className="leftbox">
                    <div className='user-photoAndName'>

                        <img src="src\component\configurationUser\user-icon.jpg" alt="photo-user" />
                        <p>Matias Acevedo</p>
                    </div>

                    <div className='menu-options'>
                        <ul>
                            <li onClick={() => {
                                setrRenderConditional(true)
                                setError("")
                            }}>Cuenta</li>
                            <li onClick={() => {
                                setrRenderConditional(false)
                                setError("")
                            }}>Contraseña</li>
                        </ul>
                    </div>


                </div>

                <div className="rightbox">
                    <div className='title-updateUser'>

                        {
                            renderConditional ? <h1>Informacion personal</h1>
                                : <h1>Contraseña</h1>
                        }

                        <p className="p-error p-error-edit">{error}</p>
                        
                    </div>
                    {
                        renderConditional ?
                            <form onSubmit={event => updateUser(event)}>
                                <div className='doble-inputs'>

                                    <div>
                                        <label htmlFor="name">Nombre</label>
                                        <input type="text" id='name' minLength={3} maxLength={15} value={name} onChange={event => setName(event.target.value)} pattern="[A-Za-záéíóúÁÉÍÓÚñÑ\s]+" required />
                                    </div>

                                    <div>
                                        <label htmlFor="lastname">Apellido</label>
                                        <input type="text" id='lastname' minLength={3} maxLength={15} value={lastname} onChange={event => setLastname(event.target.value)} pattern="[A-Za-záéíóúÁÉÍÓÚñÑ\s]+" required />
                                    </div>

                                </div>


                                <label htmlFor="email">Email</label>
                                <input type="email" id='email-register' value={email} onChange={event => setEmail(event.target.value)} required />



                                <div className='doble-inputs'>
                                    <div>
                                        <label htmlFor="phoneNumber">Número de teléfono</label>
                                        <input type="number" id='phoneNumber' minLength={7} maxLength={15} value={phoneNumber} onChange={event => setPhoneNumber(event.target.value)}
                                            title="El número de teléfono debe tener entre 7 y 9 dígitos" pattern="[0-15]{7,15}"
                                            required />
                                    </div>
                                    <div>

                                        <label htmlFor="identificationNumber">Número de documento</label>
                                        <input type="number" id='identificationNumber' value={identificationNumber} onChange={event => setIdentificationNumber(event.target.value)}
                                            title="El número de documento debe tener entre 7 y 9 dígitos"
                                            pattern="[0-9]{7,9}" required />
                                    </div>
                                </div>

                                <label htmlFor="address">Dirección <span>(Ejemplo: Av. Libertador 123)</span></label>
                                <input type="text" id='address'
                                    minLength={4} maxLength={60} value={address}
                                    onChange={event => setAddress(event.target.value)} required />


                                <div className='buttons'>
                                    <Link to={"/login"}>
                                        <button className='button-cancel-update'><RxCross2 /></button>
                                    </Link>

                                    <button type="submit" className='button-confirm-update'><FaCheck /></button>

                                </div>

                            </form>
                            :
                            <ChangePassword setErrorProp={setError}></ChangePassword>
                    }
                </div>

            </div >

        </>
    )
}

export default ConfigurationUser;