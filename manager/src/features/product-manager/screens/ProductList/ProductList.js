import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

import { SearchOutlined } from "@ant-design/icons";
import { Avatar, Button, Input, Space, Table, Tag, Typography } from "antd";
import { EmployeeManagerPaths } from "features/employee-manager/employeeManager";

import avt_default from "assets/images/avt-default.png";
import "./ProductList.css";

import {
     getProducts,
     ProductManagerPaths,
} from "features/product-manager/productManager";
const { Title } = Typography;

export default function ProductList() {
     const { listProducts, totalElements, totalPages, size } = useSelector(
          (state) => state.product
     );
     const history = useHistory();
     const location = useLocation();
     const dispatch = useDispatch();

     const [isLoading, setIsLoading] = useState(false);
     const [searchText, setSearchText] = useState("");
     const [searchedColumn, setSearchedColumn] = useState("");
     const searchInput = useRef(null);

     const onRowDetails = (record) => {
          history.push(
               EmployeeManagerPaths.EMPLOYEE_DETAILS.replace(
                    ":employeeId",
                    record.id || ""
               )
          );
     };

     const handleSearch = (selectedKeys, confirm, dataIndex) => {
          confirm();
          setSearchText(selectedKeys[0]);
          setSearchedColumn(dataIndex);
     };
     const handleReset = (clearFilters) => {
          clearFilters();
          setSearchText("");
     };
     const getColumnSearchProps = (dataIndex) => ({
          filterDropdown: ({
               setSelectedKeys,
               selectedKeys,
               confirm,
               clearFilters,
          }) => (
               <div
                    style={{
                         padding: 8,
                    }}
               >
                    <Input
                         ref={searchInput}
                         placeholder={`Search ${dataIndex}`}
                         value={selectedKeys[0]}
                         onChange={(e) =>
                              setSelectedKeys(
                                   e.target.value ? [e.target.value] : []
                              )
                         }
                         onPressEnter={() =>
                              handleSearch(selectedKeys, confirm, dataIndex)
                         }
                         style={{
                              marginBottom: 8,
                              display: "block",
                         }}
                    />
                    <Space>
                         <Button
                              type="primary"
                              onClick={() =>
                                   handleSearch(
                                        selectedKeys,
                                        confirm,
                                        dataIndex
                                   )
                              }
                              icon={<SearchOutlined />}
                              size="small"
                              style={{
                                   width: 90,
                              }}
                         >
                              Search
                         </Button>
                         <Button
                              onClick={() =>
                                   clearFilters && handleReset(clearFilters)
                              }
                              size="small"
                              style={{
                                   width: 90,
                              }}
                         >
                              Reset
                         </Button>
                         <Button
                              type="link"
                              size="small"
                              onClick={() => {
                                   confirm({
                                        closeDropdown: false,
                                   });
                                   setSearchText(selectedKeys[0]);
                                   setSearchedColumn(dataIndex);
                              }}
                         >
                              Filter
                         </Button>
                    </Space>
               </div>
          ),
          filterIcon: (filtered) => (
               <SearchOutlined
                    style={{
                         color: filtered ? "#1890ff" : undefined,
                    }}
               />
          ),
          onFilter: (value, record) =>
               record[dataIndex]
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
          onFilterDropdownOpenChange: (visible) => {
               if (visible) {
                    setTimeout(() => searchInput.current?.select(), 100);
               }
          },
          render: (text) =>
               searchedColumn === dataIndex ? (
                    <Highlighter
                         highlightStyle={{
                              backgroundColor: "#ffc069",
                              padding: 0,
                         }}
                         searchWords={[searchText]}
                         autoEscape
                         textToHighlight={text ? text.toString() : ""}
                    />
               ) : (
                    text
               ),
     });

     const columns = [
          {
               title: "Image",
               dataIndex: "image",
               key: "image",
               align: "center",
               render: (_, record) => (
                    <Avatar
                         size={50}
                         src={
                              record.listImage.filePath === ""
                                   ? avt_default
                                   : record.listImage.filePath
                         }
                    />
               ),
          },
          {
               title: "Code",
               dataIndex: "id",
               key: "id",
               sorter: (a, b) => a.id.length - b.id.length,
               sortDirections: ["descend", "ascend"],
               ...getColumnSearchProps("id"),
          },
          {
               title: "Origin",
               dataIndex: "origin",
               key: "origin",
               sorter: (a, b) => a.origin.length - b.origin.length,
               sortDirections: ["descend", "ascend"],
               ...getColumnSearchProps("origin"),
          },
          {
               title: "Categories Name",
               dataIndex: "categoriesName",
               key: "categoriesName",
               ...getColumnSearchProps("categoriesName"),
               render: (_, { categoryDTO }) => (
                    <>
                         {categoryDTO.map((c) => {
                              // let color = tag.length > 5 ? 'geekblue' : 'green';
                              // if (tag === 'loser') {
                              // 	color = 'volcano';
                              // }
                              return (
                                   <Tag color="blue" key={c.id}>
                                        {c.categoryName.toUpperCase()}
                                   </Tag>
                              );
                         })}
                    </>
               ),
          },
          {
               title: "Title Size",
               dataIndex: "titleSize",
               key: "titleSize",
               align: "center",
               filters: [
                    {
                         text: "30x30",
                         value: "30x30",
                    },
                    {
                         text: "30x60",
                         value: "30x60",
                    },
                    {
                         text: "40x80",
                         value: "40x80",
                    },
                    {
                         text: "50x50",
                         value: "50x50",
                    },
                    {
                         text: "60x60",
                         value: "60x60",
                    },
                    {
                         text: "80x80",
                         value: "80x80",
                    },
               ],
               onFilter: (value, record) => record.titleSize === value,
               filterSearch: true,
               sorter: (a, b) => {
                    let aArr = a.titleSize.split("x");
                    let bArr = b.titleSize.split("x");

                    let aVal = Number(aArr[0]) * Number(aArr[1]);
                    let bVal = Number(bArr[0]) * Number(bArr[1]);

                    return aVal > bVal;
               },
               sortDirections: ["descend", "ascend"],
          },
          {
               title: "Branch Name",
               dataIndex: "brandName",
               key: "brandName",
               ...getColumnSearchProps("brandName"),
               render: (_, { brandDTO }) => (
                    <Tag color="blue" key={brandDTO.id}>
                         {brandDTO.brandName.toUpperCase()}
                    </Tag>
               ),
          },
          {
               title: "Supplier Name",
               dataIndex: "supplierName",
               key: "supplierName",
               sorter: (a, b) => a.supplierName.length - b.supplierName.length,
               sortDirections: ["descend", "ascend"],
               ...getColumnSearchProps("supplierName"),
               render: (_, { supplierDTO }) => (
                    <Tag color="blue" key={supplierDTO.id}>
                         {supplierDTO.supplierName.toUpperCase()}
                    </Tag>
               ),
          },
          {
               title: "Status",
               dataIndex: "status",
               key: "status",
               align: "center",
               filters: [
                    {
                         text: "Active",
                         value: 1,
                    },
                    {
                         text: "In Active",
                         value: 0,
                    },
               ],
               onFilter: (value, record) => record.status === value,
               filterSearch: true,
               render: (s) => {
                    let color = s == 1 ? "green" : "volcano";
                    return s == 1 ? (
                         <Tag color={color} key={s}>
                              Active
                         </Tag>
                    ) : (
                         <Tag color={color} key={s}>
                              In Active
                         </Tag>
                    );
               },
               sorter: (a, b) => a.status - b.status,
               sortDirections: ["descend", "ascend"],
          },
     ];

     useEffect(() => {
          setIsLoading(true);
          dispatch(getProducts())
               .then(unwrapResult)
               .then(() => setIsLoading(false));
     }, [dispatch, location]);

     return (
          <div className="product-list">
               <div className="top">
                    <Title level={2}>Product List</Title>
                    <Button
                         type="primary"
                         shape={"round"}
                         size={"large"}
                         onClick={() =>
                              history.push(ProductManagerPaths.CREATE_PRODUCT)
                         }
                    >
                         Create New
                    </Button>
               </div>

               <Table
                    rowKey="id"
                    columns={columns}
                    loading={isLoading}
                    dataSource={listProducts}
                    pagination={
                         listProducts.length !== 0
                              ? {
                                     showSizeChanger: true,
                                     position: ["bottomCenter"],
                                     size: "default",
                                     pageSize: 10,
                                     // current: getPageUrl || pageHead,
                                     totalElements,
                                     // onChange: (page, size) =>
                                     // 	onHandlePagination(page, size),
                                     pageSizeOptions: ["10", "15", "20", "25"],
                                }
                              : false
                    }
                    onRow={(record) => {
                         return {
                              onClick: () =>
                                   history.push(
                                        ProductManagerPaths.PRODUCT_DETAILS.replace(
                                             ":productId",
                                             record.id
                                        )
                                   ),
                         };
                    }}
               />
          </div>
     );
}
