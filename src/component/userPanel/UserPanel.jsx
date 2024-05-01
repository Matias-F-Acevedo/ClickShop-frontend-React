import React from 'react'
import "./userPanel.css"
import { Link } from "react-router-dom"
import { useContext } from "react";
import { UserContext } from '../../context/UserContext';
import { FaEdit } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";
import { TbShoppingBagCheck } from "react-icons/tb";
import { MdOutlineLogout } from "react-icons/md";
import { BsPostcard } from "react-icons/bs";

function UserPanel({ closePanelUser }) {

    const { user, handleLogout } = useContext(UserContext);

    function capitalizeFirstLetter(word) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }


    return (
        <>
            <div className="container-user-panel">

                <div className='container-data-userPanel'>
                    <div className='perfil'>
                        <img src="src\component\configurationUser\user-icon.jpg" alt="user-photo" />
                    </div>
                    <div className='user-datos'>
                        <h4>{capitalizeFirstLetter(user.name)} {capitalizeFirstLetter(user.lastName)}</h4>
                        <p>{user.email}</p>
                    </div>
                </div>
                <div className='line-userpanel'>
                </div>
                <ul className='ul-user-panel'>
                    <li onClick={closePanelUser}>
                        <Link to={"/configuration-user"}>Editar perfil</Link>
                        <FaEdit className='iconos-panel-user' /></li>
                    <li onClick={closePanelUser}><Link to={"/"}>Favoritos</Link><MdFavorite className='iconos-panel-user' /></li>
                    <li onClick={closePanelUser}><Link to={"/orders-user"}>Mis compras</Link><TbShoppingBagCheck className='iconos-panel-user' /></li>
                    <li onClick={closePanelUser}><Link to={"/publications-user"}>Mis publicaciones </Link><BsPostcard className='iconos-panel-user' /></li>
                    <li onClick={closePanelUser}><Link onClick={handleLogout} to={"/"}>Cerrar sesión</Link>
                        <MdOutlineLogout className='iconos-panel-user' /></li>
                </ul>
            </div>

        </>
    )
}

export default UserPanel;

