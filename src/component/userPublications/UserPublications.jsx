import React from 'react'
import "./userPublication.css"
import { useContext, useState, useEffect } from "react";
import { UserContext } from '../../context/UserContext';
import dayjs from 'dayjs';
import TableComponent from '../tableComponent/TableComponent';


function UserPublications() {

    const { user, handleLogout } = useContext(UserContext);
    const [publications, setPublications] = useState([])

    async function getPublications() {

        const res = await fetch(`http://localhost:3000/api/products?userId=${user.sub}`)

        if (!res.ok) {
            console.log("no hay productos");
            return
        }
        
        const parsed = await res.json();
        setPublications(parsed);
    }

    const columns = [
        {
            header: "Nombre",
            accessorKey: "product_name",
            footer: "Nombre"
        },
        {
            header: "Stock",
            accessorKey: "stock",
            footer: "Stock"
        },
        {
            header: "Precio",
            accessorKey: "price",
            footer: "Precio"
        },
        {
            header: "Descripción",
            accessorKey: "description",
            footer: "Descripción"
        },
        {
            header: "Condición",
            accessorKey: "condition",
            footer: "Condición"
        },
        {
            header: "Fecha de creación",
            accessorKey: "createdAt",
            footer: "Fecha de creación",
            cell: info => dayjs(info.getValue()).format("DD/MM/YYYY")
        }
    ]


    useEffect(() => {
        getPublications()
    }, [user]);


    return (
       <TableComponent data={publications} columns={columns}></TableComponent>
    )
}

export default UserPublications;