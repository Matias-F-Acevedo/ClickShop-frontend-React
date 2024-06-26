import React from 'react'
import "./configurationUser.css"
import { Link } from "react-router-dom"
import { useContext, useState} from "react";
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { updatePatch } from '../../service/functionsHTTP';

function ChangePassword({setErrorProp}) {

    const { user, handleLogout } = useContext(UserContext);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigateTo = useNavigate();


    const urlChangePassword = "http://localhost:3000/api/auth/change-password"

    async function updatePassword(event) {
        event.preventDefault();

        if (oldPassword.length < 7 || oldPassword.length > 30) {
            setErrorProp("La contraseña anterior no tiene entre 7 y 30 caracteres");
            return;
        }
        if (newPassword.length < 7 || newPassword.length > 30) {
            setErrorProp("La contraseña debe tener entre 7 y 30 caracteres");
            return;
        }


        if (newPassword !== confirmPassword) {
            setErrorProp("Las contraseñas no son iguales");
            return;
        }

        if (oldPassword === newPassword) {
            setErrorProp("Has ingresado la misma contraseña que tenías antes");
            return;
        }


        const newPasswordObject = {
            "oldPassword": oldPassword,
            "newPassword": newPassword
        };

        const body = newPasswordObject;
        const res = await updatePatch(urlChangePassword, body,user.jwt)
        const parsed = await res.json()

        if (parsed.statusCode == 400) {
            setErrorProp("La contraseña anterior es incorrecta");
            return;
        } else if (parsed.statusCode == 409) {
            setErrorProp("Has ingresado la misma contraseña que tenías antes");
            return;
        } else if (parsed.statusCode == 401) {
            setErrorProp("Debera iniciar sesión nuevamente para cambiar la contraseña");

            setTimeout(() => {
                handleLogout()
                navigateTo("/login");
            }, 2000)
            return;
        } else {
            setErrorProp("Ha cambiado la contraseña con éxito, debera iniciar sesión nuevamente");
            setOldPassword("")
            setNewPassword("")
            setConfirmPassword("")

            setTimeout(() => {
                setErrorProp("")
                handleLogout()
                navigateTo("/login");
            }, 2000)

        }

    }


    return (<>
        <form className='form-password' onSubmit={event => updatePassword(event)}>
            <div className='container-password'>

                <label htmlFor="password">Contraseña anterior</label>
                <input type="password" id='password' value={oldPassword} onChange={event => setOldPassword(event.target.value)} minLength={7} maxLength={30} required />

                <label htmlFor="newPassword">Nueva contraseña</label>
                <input type="password" id='newPassword' value={newPassword} onChange={event => setNewPassword(event.target.value)} minLength={7} maxLength={30} required />

                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                <input type="password" id='confirmPassword' value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} minLength={7} maxLength={30} required />

            </div>

            <div className='buttons'>
                <Link to={"/login"} className='link-button-cancel-update'>
                    <button className='button-cancel-update'><RxCross2 /></button>
                </Link>

                <button type="submit" className='button-confirm-update'><FaCheck /></button>

            </div>
        </form>
    </>
    )
}

export default ChangePassword;