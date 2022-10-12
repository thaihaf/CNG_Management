// import React from 'react'

// export default function SupplierList() {
// 	return (
// 		<div>SupplierList</div>
// 	)
// }
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Avatar, Button, Input, Space, Table, Tag } from "antd";
import React, { useEffect, useRef, useState } from "react";
import queryString from "query-string";
import Highlighter from "react-highlight-words";

import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import "./SupplierList.css";
import {
  SupplierManagerPaths,
  getSuppliers,
} from "features/supplier-manager/supplierManager";

const App = () => {
  const { listSuppliers, totalElements, totalPages, size } = useSelector(
    (state) => state.supplier
  );

  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  useEffect(() => {
    // const query = queryString.parse(location.search);
    setIsLoading(true);
    dispatch(getSuppliers())
      .then(unwrapResult)
      .then(() => setIsLoading(false));
  }, [dispatch, location]);

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
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
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
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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

  const menu = (
    <Menu
      selectable
      //   defaultSelectedKeys={['3']}
      items={[
        {
          key: "1",
          label: "View",
        },
        {
          key: "2",
          label: "Edit",
        },
        {
          key: "3",
          label: "Delete",
        },
      ]}
    />
  );

  // const data = [
  //   {
  //     avatarSupplier: "https://joeschmoe.io/api/v1/random",
  //     supplierName: "John Brown",
  //     firstContactName: 32,
  //     address: "New York No. 1 Lake Park",
  //   },
  //   {
  //     avatarSupplier: "2",
  //     supplierName: "Jim Green",
  //     firstContactName: 42,
  //     address: "London No. 1 Lake Park",
  //   },
  //   {
  //     avatarSupplier: "3",
  //     supplierName: "Joe Black",
  //     firstContactName: 32,
  //     address: "Sidney No. 1 Lake Park",
  //   },
  //   {
  //     avatarSupplier: "4",
  //     supplierName: "Jim Red",
  //     firstContactName: 32,
  //     address: "London No. 2 Lake Park",
  //   },
  // ];

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatarSupplier",
      key: "avatarSupplier",
      width: "10%",
      ...getColumnSearchProps("avatarSupplier"),
      render: (text, record) => {
        return (
          <div>
            <Avatar src={record.avatarSupplier} />
          </div>
        );
      },
    },
    {
      title: "Supplier Name",
      dataIndex: "supplierName",
      key: "supplierName",
      width: "20%",
      ...getColumnSearchProps("supplierName"),
      sorter: (a, b) => a.supplierName - b.supplierName,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Contact Name",
      colSpan: 2,
      dataIndex: "firstContactName",
      width: "10%",
      ...getColumnSearchProps("lastContactName"),
      sorter: (a, b) => a.lastContactName.length - b.lastContactName.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Phone",
      colSpan: 0,
      dataIndex: "lastContactName",
      width: "10%",
    },
    {
      title: "Phone Number Contact",
      dataIndex: "phoneNumberContact",
      key: "phoneNumberContact",
      width: "20%",
      ...getColumnSearchProps("phoneNumberContact"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
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
        let color = s === 1 ? "green" : "volcano";
        return s === 1 ? (
          <Tag color={color} key={s}>
            Approved
          </Tag>
        ) : (
          <Tag color={color} key={s}>
            Pending
          </Tag>
        );
      },
      width: "20%",
      sorter: (a, b) => a.status - b.status,
      sortDirections: ["descend", "ascend"],
    },
    {
      render: () => (
        <Space size="middle">
          <Dropdown overlay={menu}>
            <a>
              Action <DownOutlined />
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const onRowClick = (record) => {
    history.push(
      SupplierManagerPaths.SUPPLIER_DETAIL.replace(
        ":supplierId",
        record.id || ""
      )
    );
  };

  return (
    <>
      <>
        <Button type="primary">Add Supplier</Button>
        <br />
      </>
      <br />
      <Table
        rowKey="id"
        columns={columns}
        dataSource={listSuppliers}
        onRow={(record) => ({
          onClick: () => {
            onRowClick(record);
          },
        })}
        pagination={
          listSuppliers.length !== 0
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
        loading={isLoading}
      />
    </>
  );
};

export default App;
