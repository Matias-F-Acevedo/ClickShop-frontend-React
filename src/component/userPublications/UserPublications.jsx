import React from 'react'
import "./userPublication.css"
import { useContext, useState, useEffect } from "react";
import { UserContext } from '../../context/UserContext';
import dayjs from 'dayjs';
import TableComponent from '../tableComponent/TableComponent';
import { CgDetailsMore } from "react-icons/cg";
import { MdEditNote } from "react-icons/md";
import { MdOutlineDeleteForever } from "react-icons/md";

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
            header: "#",
            accessorKey: "productId",
        },
        {
            header: "Nombre",
            accessorKey: "product_name",

        },
        {
            header: "Stock",
            accessorKey: "stock",

        },
        {
            header: "Precio",
            accessorKey: "price",
            cell: info => {
                const value = parseFloat(info.getValue());
                const formattedValue = `$ ${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
                return formattedValue;
            }
        },
        {
            header: "Descripción",
            accessorKey: "description",

        },
        {
            header: "Condición",
            accessorKey: "condition",
            cell: info => {
                const value = info.getValue();
                let classList = ""
                if (value === "NEW") classList = "NUEVO";
                if (value === "USED") classList = "USADO";

                return <div id={classList}>{classList}</div>;
            }

        },
        {
            header: "Fecha de creación",
            accessorKey: "createdAt",

            cell: info => dayjs(info.getValue()).format("DD/MM/YYYY")
        },
        {
            header: "Configuración",
            cell: () => {
                return <div className='crud-publicationsUser'>
                    <CgDetailsMore className='btn-Details-publicationUser  btn-publicationUser' />
                   <MdEditNote className='btn-Edit-publicationUser btn-publicationUser' />
                    <MdOutlineDeleteForever className='btn-delete-publicationUser btn-publicationUser' />
                </div>;
            }
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