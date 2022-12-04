import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import moment from "moment";

import { SearchOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Input,
  message,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";

import avt_default from "assets/images/avt-default.png";
import "./ListProductImport.css";

import { get } from "lodash";
import {
  getAllProductImport,
  ImportProductManagerPaths,
} from "features/import-product/importProduct";
import { statusProductImport } from "features/import-product/constants/import-product.constants";
import { getStatusString } from "helpers/util.helper";

const { Title, Text } = Typography;

export default function ListProductImport() {
  const { listAllProductImport, totalElements, totalPages, size } = useSelector(
    (state) => state.productImport
  );
  const { listActiveCategories } = useSelector((state) => state.category);
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

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
      if (typeof record[dataIndex] !== "object") {
        return record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      } else {
        if (typeof nestedValue === "string") {
          return get(record, dataIndex)
            [nestedValue].toString()
            .toLowerCase()
            .includes(value.toLowerCase());
        } else {
          let parent = get(record, dataIndex);
          let data = nestedValue.reduce(
            (previousValue, currentValue) =>
              previousValue + " " + parent[currentValue],
            ""
          );
          return data.toString().toLowerCase().includes(value.toLowerCase());
        }
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
            record.firstProductImage.filePath === ""
              ? avt_default
              : record.firstProductImage.filePath
          }
        />
      ),
    },
    {
      title: "Ngày nhập",
      dataIndex: "createAt",
      key: "createAt",
      align: "center",
      sorter: (a, b) => moment(a.createAt).isAfter(b.createAt),
      sortDirections: ["descend", "ascend"],
      render: (_, { createDate }) => {
        let newDate = moment(new Date(createDate)).format("DD-MM-YYYY");
        return <Text>{newDate}</Text>;
      },
    },
    {
      title: "Biển số xe",
      dataIndex: "licensePlates",
      key: "licensePlates",
      align: "center",
      ...getColumnSearchProps("licensePlates"),
    },
    {
      title: "Tổng số lượng nhập",
      dataIndex: "totalQuantityImport",
      key: "totalQuantityImport",
      align: "center",
      sorter: (a, b) => a.totalQuantityImport > b.totalQuantityImport,
      sortDirections: ["descend", "ascend"],
      render: (a, { totalQuantityImport }) => {
        return <Statistic value={totalQuantityImport} />;
      },
    },
    {
      title: "Tổng số mét vuông nhập",
      dataIndex: "totalSquareMeterImport",
      key: "totalSquareMeterImport",
      align: "center",
      sorter: (a, b) =>
        parseFloat(a.totalSquareMeterImport) <
        parseFloat(b.totalSquareMeterImport),
      sortDirections: ["descend", "ascend"],
      render: (a, { totalSquareMeterImport }) => {
        return <Statistic precision={2} value={totalSquareMeterImport} />;
      },
    },
    {
      title: "Tổng chi phí nhập",
      dataIndex: "totalCostImport",
      key: "totalCostImport",
      align: "center",
      sorter: (a, b) => a.totalCostImport > b.totalCostImport,
      sortDirections: ["descend", "ascend"],
      render: (a, { totalCostImport }) => {
        return <Statistic precision={0} value={totalCostImport} />;
      },
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplierDTO",
      key: "supplierName",
      align: "center",
      ...getColumnSearchProps("supplierDTO", "supplierName"),
      render: (_, { supplierDTO }) => (
        <Tag color="blue" key={supplierDTO?.id}>
          {supplierDTO?.supplierName.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Nhân viên",
      dataIndex: "employeeDTO",
      key: "employeeName",
      align: "center",
      ...getColumnSearchProps("employeeDTO", ["firstName", "lastName"]),
      render: (_, { employeeDTO }) => (
        <Tag color="blue" key={employeeDTO.id}>
          {`${employeeDTO.firstName.toUpperCase()} ${employeeDTO.lastName.toUpperCase()}`}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      filters: statusProductImport.map((item) => {
        return { key: item.key, value: item.value, text: item.label };
      }),
      onFilter: (value, record) => record.status === value,
      filterSearch: true,
      render: (s) => {
        // let color = s == 1 ? "green" : "volcano";

        return (
          <Tag color="green" key={s}>
            {getStatusString(s, statusProductImport)}
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

    dispatch(getAllProductImport())
      .then(unwrapResult)
      .then((res) => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        // message.error(err.response.data.Error.message);
        setIsLoading(false);
      });

    // dispatch(getActiveCategories());
  }, [dispatch, location]);

  return (
    <div className="product-list">
      <div className="top">
        <Title level={2} style={{ cursor: "pointer" }}>
          Danh sách Đơn nhập
        </Title>

        <Button
          type="primary"
          shape={"round"}
          size={"large"}
          onClick={() =>
            history.push(ImportProductManagerPaths.CREATE_PRODUCT_IMPORT)
          }
        >
          Tạo mới
        </Button>
      </div>

      <Table
        size="large"
        rowKey="id"
        columns={columns}
        loading={isLoading}
        dataSource={listAllProductImport}
        pagination={
          listAllProductImport.length !== 0
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
                ImportProductManagerPaths.DETAILS_PRODUCT_IMPORT.replace(
                  ":importId",
                  record.id
                )
              ),
          };
        }}
      />
    </div>
  );
}
