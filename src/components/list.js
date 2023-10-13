import React, { useState, useEffect } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import jsonData from './data';
import ModalView from './model'
import { BiFirstPage, BiLastPage } from "react-icons/bi";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";



const List = () => {
    const tableColumns = [
        {
            Header: 'Car Image',
            accessor: 'images',
            Cell: ({ cell: { value } }) => <img src={value} alt="Car Image" onClick={() => handleModalOpen(true)}></img>,
        },
        {
            Header: 'Car Name',
            accessor: 'make',
        },
        {
            Header: 'Year Of Manufacture',
            accessor: 'year',
        },
        {
            Header: 'Mileage',
            accessor: 'mileage',
        },
        {

            Header: "Status",

            accessor: "status",
            Cell: ({ cell: { value } }) => (
                <span
                    className={`carstatus ${value === 'notAvailable'
                            ? 'soldout'
                            : 'carstatus'
                        }`}

                >
                    {value}
                </span>
            ),

        },
        {
            Header: 'Favorite',
            accessor: 'isFavorite',
            Cell: ({ cell: { value } }) => <button className='border border-4'>Add to Favorite</button>,
        },
    ];

    const [filterData, setFilterData] = useState([]);
    const [fav, setFav] = useState([])
    const [modelOpen, setModalOpen] = useState(false);
    const handleModalOpen = (ele) => {
        setModalOpen(ele);
    };
    const data = React.useMemo(() => jsonData.vehicles, []);
    const columns = React.useMemo(() => tableColumns, []);
    const { getTableProps, getTableBodyProps, headerGroups, rows, page, prepareRow, canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize } } =
        useTable({
            columns,
            data: filterData,
            initialState: {
                pageSize: 5,
                pageIndex: 0
            }
        }, useSortBy, usePagination);

    useEffect(() => {
        setFilterData(jsonData.vehicles);
    }, []);

    const handleSearchBox = (e) => {
        const eventName = e.target.value.toLowerCase()
        console.log("eventName==>>", eventName);
        const filteredName = jsonData.vehicles.filter((i) => i.make.toLocaleLowerCase().includes(eventName))
        console.log("filteredName===>>", filteredName)
        setFilterData(filteredName)
    };

    const [modalData, setModaldata] = useState([])
    const handleClick = (row) => {
        const clickedRowData = row.original;
        console.log("clickedRowData", clickedRowData)
        setModaldata(clickedRowData) // Save data to local storage //
        setFav(clickedRowData);
    };

    return (
        <div>
            {modelOpen && (<ModalView data={modalData} modelOpen={modelOpen} setModalOpen={setModalOpen} />)}
            <div className="search">
                <input type="text" placeholder="Search" onChange={handleSearchBox} />
            </div>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}
                                    className={column.isSorted ? column.isSortedDesc ? "desc" : "asc" : ""}
                                >
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} onClick={() => handleClick(row)}>
                                {row.cells.map((cell) => {
                                    return (
                                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="pagenation">
                <span>
                    Page&nbsp;
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{" "}
                </span>
                <div>
                    <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                        <BiFirstPage className="page-controller" />
                    </button>{" "}
                    <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                        <MdKeyboardArrowLeft className="page-controller" />
                    </button>{" "}
                    <button onClick={() => nextPage()} disabled={!canNextPage}>
                        <MdKeyboardArrowRight className="page-controller" />
                    </button>{" "}
                    <button
                        onClick={() => gotoPage(pageCount - 1)}
                        disabled={!canNextPage}
                    >
                        <BiLastPage className="page-controller" />
                    </button>{" "}
                </div>
                <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                >
                    {[5, 10, 15].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            {pageSize !== 15 ? `Show ${pageSize}` : `Show all`}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default List;
