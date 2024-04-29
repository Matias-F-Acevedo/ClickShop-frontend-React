import React from 'react'
import "./configurationUser.css"
import { Link } from "react-router-dom"
import { useContext, useState, useEffect } from "react";
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';


function ConfigurationUser() {

    const { user, handleLogout } = useContext(UserContext);

    const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
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



    async function editUser(event) {
        event.preventDefault();

        if (name.length < 3 || name.length > 15) { setError("El nombre debe tener entre 3 y 15 caracteres"); return; }

        if (lastname.length < 3 || lastname.length > 15) { setError("El apellido debe tener entre 3 y 15 caracteres"); return; }

        if (phoneNumber.length < 7 || phoneNumber.length > 15) { setError("El numero de teléfono debe tener entre 7 y 15 caracteres"); return; }

        if (address.length < 4 || address.length > 60) { setError("La direccion debe tener entre 4 y 60 caracteres"); return; }

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

        console.log(parsed);


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
            <div className='container-configuration-user'>
                <div className='container-photo-userEdit'>
                    <div className='photo-user-perfil'>
                        <img src="src\component\configurationUser\user-icon.jpg" alt="photo-user" />
                    </div>
                    <button className='edit-profile-photo'>Cambiar foto de perfil</button>
                </div>

                <div className='container-userEdit'>
                    <div className="container-register">
                        <div className='container-form-edit-user'>
                            <h1 className="title-register">Editar perfil</h1>
                            <p className="p-error p-error-edit">{error}</p>
                            <form onSubmit={event => editUser(event)} className="form-register">
                                <div className='doble-inputs'>

                                    <div>
                                        <label htmlFor="name">Nombre</label>
                                        <input type="text" id='name' value={name} onChange={event => setName(event.target.value)} minLength={3} maxLength={15} pattern="[A-Za-záéíóúÁÉÍÓÚñÑ\s]+" required />

                                    </div>

                                    <div>
                                        <label htmlFor="lastname">Apellido</label>
                                        <input type="text" id='lastname' value={lastname} onChange={event => setLastname(event.target.value)} minLength={3} maxLength={15} pattern="[A-Za-záéíóúÁÉÍÓÚñÑ\s]+" required />
                                    </div>

                                </div>

                                <label htmlFor="email">Email</label>
                                <input type="email" id='email-register' value={email} onChange={event => setEmail(event.target.value)} required />


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


                                <div className='buttons-register buttons-edit'>
                                    <button className='btn-form-register' type="submit">Editar</button>

                                    <Link to={"/login"}>
                                        <button id='btn-cancel-edit'>Cancelar</button>
                                    </Link>
                                </div>

                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default ConfigurationUser;