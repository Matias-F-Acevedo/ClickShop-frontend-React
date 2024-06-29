import React from 'react'
import "./tableComponent.css"
import { useState, } from "react";
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table';
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { IoEllipsisVerticalOutline } from "react-icons/io5";
import { BiFirstPage } from "react-icons/bi";
import { BiLastPage } from "react-icons/bi";
import { MdArrowForwardIos } from "react-icons/md";
import { MdArrowBackIosNew } from "react-icons/md";




function TableComponent({ data, columns }) {
    const [sorting, setSorting] = useState([]);
    const [filtering, setFiltering] = useState("");

    const table = useReactTable({
        data: data, columns, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel(), getSortedRowModel: getSortedRowModel(), getFilteredRowModel: getFilteredRowModel(), state: {
            sorting: sorting,
            globalFilter: filtering,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltering,

    })

    const emptyRow = () => (
        <tr>
            <td colSpan={columns.length}>No hay datos disponibles.</td>
        </tr>
    );

    return (
        <div className='container-table'>
            <input placeholder='Buscar' type="text" value={filtering} onChange={(e) => setFiltering(e.target.value)} />
            <table>
                <thead className='thead'>{
                    table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {
                                headerGroup.headers.map(header => (

                                    <th key={header.id}

                                        onClick={header.column.getToggleSortingHandler()}>{<IoEllipsisVerticalOutline className='icon-th' />}{
                                            flexRender(header.column.columnDef.header, header.getContext())}{" "}



                                        {
                                            {
                                                "asc": <IoIosArrowUp className='hola12' />, "desc": <IoIosArrowDown className='hola12' />

                                            }[header.column.getIsSorted() ?? null]

                                        }


                                    </th>
                                ))
                            }
                        </tr>
                    ))
                }
                </thead>
                <tbody >
                    {data.length === 0 ? emptyRow() : (

                        table.getRowModel().rows.map(row => (
                            <React.Fragment key={row.id}>
                                <tr key={row.id} className='tr-desktop'>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))
                                    }
                                </tr>

                                <tr key={`mobile-${row.id}`} className='tr-mobile'>
                                    {row.getVisibleCells().map(cell => (
                                       <React.Fragment key={cell.id}>
                                        {/* <div className='container-td-table' key={`mobilee-${cell.id}`}> */}
                                            <td key={cell.id} className='td-name-colum'>
                                                <p className="p-table-tbody-td" id={"cell" + cell.column.columnDef.header}> {cell.column.columnDef.header}: </p>
                                            </td>

                                            <td key={`mobile-${cell.id}`}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        {/* // </div> */}
                                        </React.Fragment>
                                    ))
                                    }
                                </tr>
                                </React.Fragment>
                        ))
                    )}
                </tbody>
                <tfoot className='tfoot'>
                    {
                        table.getFooterGroups().map(footerGroup => (
                            <tr key={footerGroup.id}>
                                {
                                    footerGroup.headers.map(footer => (
                                        <th key={footer.id} >

                                            {
                                                flexRender(
                                                    footer.column.columnDef.footer,
                                                    footer.getContext()
                                                )
                                            }


                                        </th>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </tfoot>
            </table>
            <div className='buttons-table' >
                <button onClick={() => table.setPageIndex(0)}>
                    <BiFirstPage className='icon-page' />
                </button>
                <button onClick={() => table.previousPage()}>
                    <MdArrowBackIosNew />
                </button>
                <button onClick={() => table.nextPage()}>
                    <MdArrowForwardIos />
                </button>
                <button onClick={() => table.setPageIndex(table.getPageCount() - 1)}>
                    <BiLastPage className='icon-page' />
                </button>
            </div>

        </div>
    )
}

export default TableComponent;