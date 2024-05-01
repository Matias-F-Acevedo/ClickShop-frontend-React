import React from 'react'
import "./tableComponent.css"
import {useState,} from "react";
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table';




function TableComponent({data, columns}) {
    const [sorting, setSorting] = useState([]);
    const [filtering, setFiltering] = useState("");

    const table = useReactTable({
        data: data, columns, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel(), getSortedRowModel: getSortedRowModel(), getFilteredRowModel: getFilteredRowModel(),state: {
            sorting: sorting,
            globalFilter:filtering,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltering,
       
    })

    return (
        <div className='container-table'>
        <input placeholder='Buscar' type="text" value={filtering} onChange={(e)=> setFiltering(e.target.value)}/>
            <table>
                <thead>{
                    table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {
                                headerGroup.headers.map(header => (
                                    <th key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}>{
                                            flexRender(header.column.columnDef.header, header.getContext())}

                                        {
                                            {
                                                "asc": "↑", "desc": "↓"
                                            }[header.column.getIsSorted() ?? null]
                                        }

                                    </th>
                                ))
                            }
                        </tr>
                    ))
                }
                </thead>
                <tbody>
                    {
                        table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))
                                }
                            </tr>
                        ))
                    }
                </tbody>
                <tfoot>
                    {
                        table.getFooterGroups().map(footerGroup => (
                            <tr key={footerGroup.id}>
                                {
                                    footerGroup.headers.map(footer => (
                                        <th key={footer.id}>
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
            <div className='buttons-table'>
                <button onClick={() => table.setPageIndex(0)}>
                Primer Pagina
            </button>
            <button onClick={() => table.previousPage()}>
                Pagina Anterior
            </button>
            <button onClick={() => table.nextPage()}>
                Pagina Siguiente
            </button>
            <button onClick={() => table.setPageIndex(table.getPageCount() - 1)}>
                Ultima Pagina
            </button>
            </div>
            
        </div>
    )
}

export default TableComponent;