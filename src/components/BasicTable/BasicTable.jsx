import React, { useState, useEffect } from "react";
import { Table } from 'flowbite-react';

function BasicTable({ headers, items, withFilter = true, searchIndex = 0, categoriseIndex = 0, handleRowClick = null, height = 70 }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortConfig, setSortConfig] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    let updatedItems = [...items].filter(item =>
      item.tableData[searchIndex].toLowerCase().includes(searchTerm.toLowerCase()) &&
      (typeFilter ? item.tableData[categoriseIndex] === typeFilter : true)
    );

    if (sortConfig !== null) {
      updatedItems.sort((a, b) => {
        if (a.tableData[sortConfig.key] === null) return 1;
        if (b.tableData[sortConfig.key] === null) return -1;
        if (typeof a.tableData[sortConfig.key] === 'string') {
          return (
            sortConfig.direction === 'ascending'
            ? a.tableData[sortConfig.key].localeCompare(b.tableData[sortConfig.key])
            : b.tableData[sortConfig.key].localeCompare(a.tableData[sortConfig.key])
          );
        } else {
          return (
            sortConfig.direction === 'ascending'
            ? a.tableData[sortConfig.key] - b.tableData[sortConfig.key]
            : b.tableData[sortConfig.key] - a.tableData[sortConfig.key]
          );
        }
      });
    }

    setFilteredItems(updatedItems);
  }, [items, searchTerm, typeFilter, sortConfig]);

  const requestSort = key => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const handleTypeFilterChange = event => {
    setTypeFilter(event.target.value);
  };

  // Adjusted to extract tableData for type filtering
  const uniqueTypes = [...new Set(items.map(item => item.tableData[categoriseIndex]))];

  return (
    <div className="overflow-x-auto p-5 pb-0">
      {withFilter && (
        <div className="grid grid-cols-12 gap-3 mb-5 items-center">
          <div className="col-span-8">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="col-span-4">
            <select
              onChange={handleTypeFilterChange}
              value={typeFilter}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Types</option>
              {uniqueTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      )}
      <div className={"relative overflow-x-scroll " + heightRef[height]}>

        <Table hoverable>
          <Table.Head className="bg-white sticky top-0 z-10">
            {headers.map((header, index) => (
              <Table.HeadCell
                key={index}
                onClick={() => requestSort(index)}
                className="cursor-pointer hover:bg-gray-100"
              >
                {header}
                {sortConfig && sortConfig.key === index && (
                  sortConfig.direction === 'ascending' ? ' ↑' : ' ↓'
                )}
              </Table.HeadCell>
            ))}
          </Table.Head>
          <Table.Body className="divide-y">
            {filteredItems.map((rowData, rowIndex) => (
              <Table.Row key={rowIndex} onClick={() => handleRowClick ? handleRowClick(rowData.metaData) : null} className="hover:bg-gray-50">
                {rowData.tableData.map((item, columnIndex) => (
                  <Table.Cell key={columnIndex}>{item}</Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}

const heightRef = {
  50: "h-[50vh]",
  55: "h-[55vh]",
  60: "h-[60vh]",
  65: "h-[65vh]",
  70: "h-[70vh]",
  75: "h-[75vh]",
}

export default BasicTable;
