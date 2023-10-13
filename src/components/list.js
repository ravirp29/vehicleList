import React, { useState, useEffect } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import jsonData from "./data";
import ModalView from "./model";
import { BiFirstPage, BiLastPage } from "react-icons/bi";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";

const List = () => {
  const tableColumns = [
    {
      Header: "Car Image",
      accessor: "images",
      Cell: ({ cell: { value } }) => (
        <img
          src={value}
          alt="Car Image"
          onClick={() => handleModalOpen(true)}
        ></img>
      ),
    },
    {
      Header: "Car Name",
      accessor: "make",
    },
    {
      Header: "Model",
      accessor: "model",
    },
    {
      Header: "Year Of Manufacture",
      accessor: "year",
    },
    {
      Header: "Mileage",
      accessor: "mileage",
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ cell: { value } }) => (
        <span
          className={`carstatus ${
            value === "notAvailable" ? "soldout" : "carstatus"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      Header: "Favorite",
      accessor: "isFavorite",
      Cell: ({ row }) => (
        <button
          className="border border-4"
          onClick={() => favouriteHandler(row.original)}
        >
          Add to Favorite
        </button>
      ),
    },
  ];

  const favouriteHandler = (e) => {
    setData((prev) => {
      return [...prev.filter((car) => car.id !== e.id)];
    });
    setFilterData((prev) => {
      return [...prev.filter((car) => car.id !== e.id)];
    });
    setFav((prev) => {
      console.log(...prev, e);
      return [...prev, e];
    });
  };

  const removeFav = (item) => {
    setData((prev) => {
      return [...prev, item];
    });
    setFilterData((prev) => {
      return [...prev, item];
    });
    setFav((prev) => {
      return [...prev.filter((car) => car.id !== item.id)];
    });
  };

  const [filterData, setFilterData] = useState(jsonData.vehicles);
  const [data, setData] = useState(jsonData.vehicles);
  const [fav, setFav] = useState([]);
  const [modelOpen, setModalOpen] = useState(false);
  const handleModalOpen = (ele) => {
    setModalOpen(ele);
  };
  //   const data = React.useMemo(() => jsonData.vehicles, []);
  const columns = React.useMemo(() => tableColumns, []);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: filterData,
      initialState: {
        pageSize: 5,
        pageIndex: 0,
      },
    },
    useSortBy,
    usePagination
  );

  const handleSearchBox = (e) => {
    const eventName = e.target.value.toLowerCase();
    console.log(eventName);
    const filtredName = data.filter((i) =>
      i.make.toLowerCase().includes(eventName)
    );
    console.log(filtredName);
    setFilterData(filtredName);
  };

  const handleModelFilterChange = (e) => {
    const eventName = e.target.value.toLowerCase();
    console.log(eventName);
    const filtredName = data.filter((i) =>
      i.model.toLowerCase().includes(eventName)
    );
    console.log(filtredName);
    setFilterData(filtredName);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  };

  const [modalData, setModaldata] = useState([]);

  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleClick = (row) => {
    const clickedRowData = row.original;
    console.log("clickedRowData", clickedRowData);
    setModaldata(clickedRowData);
    // setFav(clickedRowData);
  };

  return (
    <div className="container mx-auto p-4">
      {modelOpen && (
        <ModalView
          data={modalData}
          modelOpen={modelOpen}
          setModalOpen={setModalOpen}
        />
      )}
      <div className="mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-16"
          onClick={toggleFilters}
        >
          Add Filters
        </button>
      </div>
      {showFilters && (
        <div className="flex flex-wrap mb-4">
          <input
            type="text"
            placeholder="Search cars by make"
            className="p-2 border border-gray-300 mr-2"
            onChange={handleSearchBox}
          />
          <input
            type="text"
            placeholder="Model"
            // value={modelFilter}
            onChange={handleModelFilterChange}
            className="p-2 border border-gray-300 mr-2"
          />
          <input
            type="number"
            placeholder="Min Price"
            onChange={handleMinPriceChange}
            className="p-2 border border-gray-300 mr-2"
          />
          <input
            type="number"
            placeholder="Max Price"
            onChange={handleMaxPriceChange}
            className="p-2 border border-gray-300"
          />
        </div>
      )}
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={
                    column.isSorted
                      ? column.isSortedDesc
                        ? "desc"
                        : "asc"
                      : ""
                  }
                >
                  {column.render("Header")}
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
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        <h1 className="text-center text-2xl">Favorite</h1>
        {fav.map((favorite) => (
          <>
            <table>
              <thead>
                <tr>
                  <th>Car Image</th>
                  <th>Name</th>
                  <th>Model</th>
                  <th>Year Of Manufacture</th>
                  <th>Mileage</th>
                  <th>Status</th>
                  <th>Favorite</th>
                </tr>
              </thead>
              <tbody>
                <tr key={favorite.id}>
                  {console.log("favorite", favorite)}
                  <td>
                    <img
                      src={favorite.images}
                      alt="car image"
                      onClick={() => handleModalOpen(true)}
                    />
                  </td>
                  <td>{favorite.make}</td>
                  <td>{favorite.model}</td>
                  <td>{favorite.year}</td>
                  <td>{favorite.mileage}</td>
                  <td>{favorite.status}</td>
                  <td>
                    <button
                      className="border border-4"
                      onClick={() => removeFav(favorite)}
                    >
                      Remove from favorite
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            {/* <div>
                {favorite.make}
            </div> */}
          </>
        ))}
      </div>
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
        <select className="pageSelect"
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
