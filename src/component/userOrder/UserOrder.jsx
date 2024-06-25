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

        const res = await fetch(`http://localhost:3000/api/order?userId=${user.sub}`,{
            headers:{
                Authorization:`Bearer ${user.jwt}`,   
               } 
        })

        if (!res.ok) {
            console.log("no hay ordenes");
            return
        }

        const parsed = await res.json();
        setOrders(parsed);
    }

    const columns = [
        {
            header: "Fecha",
            accessorKey: "date",
            cell: info => dayjs(info.getValue()).format("DD/MM/YYYY")
        },
        {
            header: "Dirección de entrega",
            accessorKey: "shippingAddress",
        },
        {
            header: "Total",
            accessorKey: "total",
            cell: info => {
                const value = parseFloat(info.getValue()); 
                const formattedValue = `$ ${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
                return formattedValue;
              }
        },

        {
            header: "Estado",
            accessorKey: "status",
            cell: info => {
                const value = info.getValue();
                let className = "";
                if (value === "PENDING") className = "PENDIENTE" ;
                else if (value === "COMPLETED") className = "COMPLETADO";
                else if (value === "SHIPPED") className = "ENVIADO";
                else if (value === "CANCELLED") className = "CANCELADO";

                return <div id={className}>{className}</div>;
            }
        },

    ]


    useEffect(() => {
        getOrders()
    }, [user]);


    return (
        <TableComponent data={orders} columns={columns}></TableComponent>
    )
}

export default UserOrder;