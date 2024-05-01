import React from 'react'
import "./userOrder.css"
import { useContext, useState, useEffect } from "react";
import { UserContext } from '../../context/UserContext';
import dayjs from 'dayjs';
import TableComponent from '../tableComponent/TableComponent';

function UserOrder() {

    const { user, handleLogout } = useContext(UserContext);
    const [orders, setOrders] = useState([])

    async function getOrders() {

        const res = await fetch(`http://localhost:3000/api/order?userId=${user.sub}`)

        if (!res.ok) {
            console.log("no hay ordenes");
            return
        }
        
        const parsed = await res.json();
        setOrders(parsed);
    }

    const columns = [
        {
            header: "Dirección de entrega",
            accessorKey: "shippingAddress",
            footer: "Dirección de entrega"
        },
        {
            header: "Estado",
            accessorKey: "status",
            footer: "Estado"
        },
        {
            header: "Total",
            accessorKey: "total",
            footer: "Total",
            cell: info => `$ ${info.getValue()}`
        },
        {
            header: "Fecha",
            accessorKey: "date",
            footer: "Fecha",
            cell: info => dayjs(info.getValue()).format("DD/MM/YYYY")
        }
    ]


    useEffect(() => {
        getOrders()
    }, [user]);


    return (
       <TableComponent data={orders} columns={columns}></TableComponent>
    )
}

export default UserOrder;