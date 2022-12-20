import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import { motion } from "framer-motion/dist/framer-motion";

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
  const { listProducts, totalElements, page, size } = useSelector(
    (state) => state.product
  );
  const { listActiveCategories } = useSelector((state) => state.category);
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
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
      title: "STT",
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
      title: "Mã sản phẩm",
      dataIndex: "id",
      key: "id",
      align: "center",
      sorter: (a, b) => a.id > b.id,
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("id"),
    },
    {
      title: "Màu sản phẩm",
      dataIndex: "color",
      key: "color",
      align: "center",
      sorter: (a, b) => a.color > b.color,
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("color"),
    },
    {
      title: "Nơi sản xuất",
      dataIndex: "origin",
      key: "origin",
      align: "center",
      ...getColumnSearchProps("origin"),
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
      title: "Tổng số lượng hộp",
      dataIndex: "totalQuantityBox",
      key: "totalQuantityBox",
      align: "center",
      sorter: (a, b) => a.totalQuantityBox - b.totalQuantityBox,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Chức năng",
      dataIndex: "categoriesName",
      key: "categoriesName",
      align: "center",
      render: (_, { categoryDTO }) => (
        <>
          {categoryDTO.map((c) => {
            return (
              <Tag color="darkseagreen" key={c.id} style={{ margin: "0.2rem" }}>
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
      title: "Nhãn hàng",
      dataIndex: "brandDTO",
      key: "brandName",
      align: "center",
      ...getColumnSearchProps("brandDTO", "brandName"),
      render: (_, { brandDTO }) => (
        <Tag color="darkorange" key={brandDTO.id}>
          {brandDTO.brandName.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplierDTO",
      key: "supplierName",
      align: "center",
      ...getColumnSearchProps("supplierDTO", "supplierName"),
      render: (_, { supplierDTO }) => (
        <Tag color="darkturquoise" key={supplierDTO?.id}>
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
            HOẠT ĐỘNG
          </Tag>
        ) : (
          <Tag color={color} key={s}>
            KHÔNG HOẠT ĐỘNG
          </Tag>
        );
      },
      sorter: (a, b) => a.status - b.status,
      sortDirections: ["descend", "ascend"],
    },
  ];

  const onHandlePagination = (pageCurrent, pageSize) => {
    setIsLoading(true);

    const page = pageCurrent.toString();
    const size = pageSize.toString();
    const params = queryString.parse(location.search);

    history.push({
      pathname: ProductManagerPaths.PRODUCT_MANAGER,
      search: queryString.stringify({
        ...params,
        size: size,
        page: page,
      }),
    });
  };

  useEffect(() => {
    let query = queryString.parse(location.search);
    if (query.page) {
      query.page = query.page - 1;
    }

    setIsLoading(true);
    dispatch(getProducts(query))
      .then(unwrapResult)
      .then(() => {
        dispatch(getActiveCategories()).then(() => {
          setIsLoading(false);
        });
      });
  }, [dispatch, location]);

  return (
    <div className="product-list">
      <motion.div
        className="top"
        animate={{ opacity: [0, 1] }}
        exit={{ opacity: [1, 0] }}
        transition={{ duration: 1 }}
      >
        <ActionsModal />

        <Button
          type="primary"
          shape={"round"}
          onClick={() => history.push(ProductManagerPaths.CREATE_PRODUCT)}
          style={{ width: "15rem", height: "3.8rem" }}
        >
          Tạo Sản phẩm
        </Button>
      </motion.div>

      <motion.div
        animate={{ opacity: [0, 1], y: [50, 0] }}
        exit={{ opacity: [1, 0] }}
        transition={{ duration: 1 }}
      >
        <Table
          rowKey={(record) => record.id}
          rowClassName={(record, index) =>
            index % 2 === 0
              ? "table-row table-row-even"
              : "table-row table-row-odd"
          }
          columns={columns}
          loading={isLoading}
          dataSource={[...listProducts]}
          pagination={
            totalElements !== 0
              ? {
                  current: page,
                  pageSize: size,
                  total: totalElements,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  position: ["bottomCenter"],
                  pageSizeOptions: ["10", "20", "50", "100"],
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`,
                  onChange: (page, size) => onHandlePagination(page, size),
                  locale: {
                    jump_to: "",
                    page: "trang",
                    items_per_page: "/ trang",
                  },
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
      </motion.div>
    </div>
  );
}
