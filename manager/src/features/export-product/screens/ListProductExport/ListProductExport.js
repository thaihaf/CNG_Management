import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { motion } from "framer-motion/dist/framer-motion";

import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Statistic, Table, Tag, Typography } from "antd";

import "./ListProductExport.css";

import { get } from "lodash";

import { getStatusString } from "helpers/util.helper";
import {
  statusProductExport,
  statusProductReExport,
} from "features/export-product/constants/export-product.constants";
import {
  getAllProductExport,
  ProductExportManagerPaths,
} from "features/export-product/exportProduct";
import queryString from "query-string";

const { Title, Text } = Typography;

export default function ListProductExport() {
  const { listAllProductExport, totalElements, number, size } = useSelector(
    (state) => state.productExport
  );
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
      title: "Loại đơn",
      dataIndex: "type",
      key: "type",
      align: "center",
      ...getColumnSearchProps("type"),
      render: (_, { type }) => (
        <Tag color="darkseagreen" key={type}>
          {type}
        </Tag>
      ),
    },
    {
      title: "Ngày xuất",
      dataIndex: "createAt",
      key: "createAt",
      align: "center",
      sorter: (a, b) => dayjs(a.createAt).isAfter(b.createAt),
      sortDirections: ["descend", "ascend"],
      render: (_, { createDate }) => {
        let newDate = dayjs(new Date(createDate)).format("DD-MM-YYYY");
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
      dataIndex: "totalQuantityExport",
      key: "totalQuantityExport",
      align: "center",
      sorter: (a, b) => a.totalQuantityExport > b.totalQuantityExport,
      sortDirections: ["descend", "ascend"],
      render: (a, { totalQuantityExport }) => {
        return <Statistic value={totalQuantityExport} />;
      },
    },
    {
      title: "Tổng số mét vuông nhập",
      dataIndex: "totalSquareMeterExport",
      key: "totalSquareMeterExport",
      align: "center",
      sorter: (a, b) =>
        parseFloat(a.totalSquareMeterExport) <
        parseFloat(b.totalSquareMeterExport),
      sortDirections: ["descend", "ascend"],
      render: (a, { totalSquareMeterExport }) => {
        return <Statistic precision={2} value={totalSquareMeterExport} />;
      },
    },
    {
      title: "Tổng giá nhập",
      dataIndex: "totalExportOrderPrice",
      key: "totalExportOrderPrice",
      align: "center",
      sorter: (a, b) =>
        parseFloat(a.totalExportOrderPrice) >
        parseFloat(b.totalExportOrderPrice),
      sortDirections: ["descend", "ascend"],
      render: (a, { totalExportOrderPrice }) => {
        return <Statistic precision={0} value={totalExportOrderPrice} />;
      },
    },
    {
      title: "Khách hàng",
      dataIndex: "customerId",
      key: "customerId",
      align: "center",
      ...getColumnSearchProps("customerId"),
      render: (_, { customerId, customerName }) => (
        <Tag color="blue" key={customerId}>
          {customerName}
        </Tag>
      ),
    },
    {
      title: "Người bán",
      dataIndex: "employeeId",
      key: "employeeId",
      align: "center",
      ...getColumnSearchProps("employeeId"),
      render: (_, { employeeId, employeeName }) => (
        <Tag color="blue" key={employeeId}>
          {employeeName}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      filters: [...statusProductExport, ...statusProductReExport].map(
        (item) => {
          return { key: item.key, value: item.value, text: item.label };
        }
      ),
      onFilter: (value, record) => record.status === value,
      filterSearch: true,
      render: (s, record) => {
        // let color = s == 1 ? "green" : "volcano";
        return (
          <Tag color="green" key={s}>
            {getStatusString(
              s,
              record.type !== "RE-EXPORT"
                ? statusProductExport
                : statusProductReExport
            )}
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
      pathname: ProductExportManagerPaths.LIST_PRODUCT_EXPORT,
      search: queryString.stringify({
        ...params,
        size: size,
        page: page,
      }),
    });
  };

  useEffect(() => {
    setIsLoading(true);
    let query = queryString.parse(location.search);
    if (query.page) {
      query.page = query.page - 1;
    }

    dispatch(getAllProductExport(query))
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
      <motion.div
        className="top"
        animate={{ opacity: [0, 1] }}
        exit={{ opacity: [1, 0] }}
        transition={{ duration: 1 }}
      >
        <Title level={2} style={{ cursor: "pointer" }}>
          Danh sách Đơn xuất
        </Title>

        <Button
          type="primary"
          shape={"round"}
          onClick={() =>
            history.push(ProductExportManagerPaths.CREATE_PRODUCT_EXPORT)
          }
          style={{ width: "15rem", height: "3.8rem" }}
        >
          Tạo đơn xuất
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
          scroll={{ x: "maxContent" }}
          loading={isLoading}
          dataSource={[...listAllProductExport]}
          pagination={
            totalElements !== 0
              ? {
                  current: number,
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
                  ProductExportManagerPaths.DETAILS_PRODUCT_EXPORT.replace(
                    ":exportId",
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
