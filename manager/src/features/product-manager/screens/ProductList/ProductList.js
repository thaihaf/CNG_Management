import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

import { SearchOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Input,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { EmployeeManagerPaths } from "features/employee-manager/employeeManager";

import avt_default from "assets/images/avt-default.png";
import "./ProductList.css";

import {
  getProducts,
  ProductManagerPaths,
  titleSizeList,
} from "features/product-manager/productManager";
import { getActiveCategories } from "features/category-manager/categoryManager";
import { get } from "lodash";
import { ActionsModal } from "features/product-manager/components";

const { Title, Text } = Typography;

export default function ProductList() {
  const { listProducts, totalElements, totalPages, size } = useSelector(
    (state) => state.product
  );
  const { listActiveCategories } = useSelector((state) => state.category);
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex, nestedValue) => ({
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
    onFilter: (value, record) => {
      if (typeof record[dataIndex] === "string") {
        return record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      } else {
        return get(record, dataIndex)
          [nestedValue].toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      }
    },

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
      title: "Vị trí",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (a, b, index) => <Text>{index + 1}</Text>,
    },
    {
      title: "Ảnh sản phẩm",
      dataIndex: "image",
      key: "image",
      align: "center",
      render: (_, record) => (
        <Avatar
          size={50}
          src={
            record?.listImage[0]?.filePath === ""
              ? avt_default
              : record?.listImage[0]?.filePath
          }
        />
      ),
    },
    {
      title: "Mã sản phần",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id > b.id,
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("id"),
    },
    {
      title: "Màu sản phẩm",
      dataIndex: "color",
      key: "color",
      sorter: (a, b) => a.color > b.color,
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("color"),
    },
    {
      title: "Nơi sản xuất",
      dataIndex: "origin",
      key: "origin",
      ...getColumnSearchProps("origin"),
    },
    {
      title: "Tên chức năng",
      dataIndex: "categoriesName",
      key: "categoriesName",
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
      filters: listActiveCategories?.map((c) => {
        return { text: c.categoryName, value: c.id };
      }),
      onFilter: (value, record) =>
        record.categoryDTO.find((c) => c.id === value),
      filterSearch: true,
    },
    {
      title: "Kích thước",
      dataIndex: "titleSize",
      key: "titleSize",
      align: "center",
      filters: titleSizeList,
      onFilter: (value, record) => record.titleSize === value,
      filterSearch: true,
      sorter: (a, b) => {
        let aArr = a.titleSize.split("x");
        let bArr = b.titleSize.split("x");

        let aVal = Number(aArr[0]) * Number(aArr[1]);
        let bVal = Number(bArr[0]) * Number(bArr[1]);

        return aVal - bVal;
      },
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Tên Nhãn hàng",
      dataIndex: "brandDTO",
      key: "brandName",
      ...getColumnSearchProps("brandDTO", "brandName"),
      render: (_, { brandDTO }) => (
        <Tag color="blue" key={brandDTO.id}>
          {brandDTO.brandName.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Tên Nhà cung cấp",
      dataIndex: "supplierDTO",
      key: "supplierName",
      ...getColumnSearchProps("supplierDTO", "supplierName"),
      render: (_, { supplierDTO }) => (
        <Tag color="blue" key={supplierDTO?.id}>
          {supplierDTO?.supplierName.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      filters: [
        {
          text: "Hoạt động",
          value: 1,
        },
        {
          text: "Không hoạt động",
          value: 0,
        },
      ],
      onFilter: (value, record) => record.status === value,
      filterSearch: true,
      render: (s) => {
        let color = s == 1 ? "green" : "volcano";
        return s == 1 ? (
          <Tag color={color} key={s}>
            Hoạt động
          </Tag>
        ) : (
          <Tag color={color} key={s}>
            Không hoạt động
          </Tag>
        );
      },
      sorter: (a, b) => a.status - b.status,
      sortDirections: ["descend", "ascend"],
    },
  ];

  const onHandlePagination = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };
  useEffect(() => {
    setIsLoading(true);
    dispatch(getProducts())
      .then(unwrapResult)
      .then(() => setIsLoading(false));
    dispatch(getActiveCategories());
  }, [dispatch, location]);

  return (
    <div className="product-list">
      <div className="top">
        <ActionsModal />

        <Button
          type="primary"
          shape={"round"}
          size={"large"}
          onClick={() => history.push(ProductManagerPaths.CREATE_PRODUCT)}
        >
          Tạo mới
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
                pageSize: pageSize,
                current: currentPage,
                totalElements,
                onChange: (page, size) => onHandlePagination(page, size),
                pageSizeOptions: ["2", "4", "6"],
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
