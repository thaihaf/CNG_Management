import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";

import { SearchOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  DatePicker,
  Form,
  Input,
  notification,
  Radio,
  Space,
  Statistic,
  Table,
  Typography,
} from "antd";

import avt_default from "assets/images/avt-default.png";
import "./ProductInventory.css";

import { get } from "lodash";

import {
  getSupplierDebts,
  SupplierDebtPaths,
} from "features/supplier-debt/supplierDebt";
import dayjs from "dayjs";
import { getMessage } from "helpers/util.helper";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import {
  DashboardPaths,
  getProductInventory,
} from "features/dashboard/dashboard";

const { Title, Text } = Typography;

export default function ProductInventory() {
  const { listProductInventory, totalElements, number, size } = useSelector(
    (state) => state.dashboard.productInventory
  );
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const params = queryString.parse(location.search);
  const [isLoading, setIsLoading] = useState(false);
  const [tabPosition, setTabPosition] = useState();

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
      title: "Mã sản phẩm",
      dataIndex: ["productDTO", "id"],
      key: "productId",
      align: "center",
    },
    {
      title: "Tồn đầu kỳ",
      dataIndex: ["productInventoryStoreDTO", "squareMeterPerBoxAtBeginPeriod"],
      key: "squareMeterPerBoxAtBeginPeriod",
      align: "center",
    },
    {
      title: "Số lượng nhập",
      dataIndex: ["productInventoryStoreDTO", "squareMeterPerBoxImport"],
      key: "squareMeterPerBoxImport",
      align: "center",
    },
    {
      title: "Số lượng xuất",
      dataIndex: ["productInventoryStoreDTO", "squareMeterPerBoxExport"],
      key: "squareMeterPerBoxExport",
      align: "center",
    },
    {
      title: "Số lượng nhập lại",
      dataIndex: ["productInventoryStoreDTO", "squareMeterPerBoxReExport"],
      key: "squareMeterPerBoxReExport",
      align: "center",
    },
    {
      title: "Tồn cuối kỳ",
      dataIndex: ["productInventoryStoreDTO", "squareMeterPerBoxAtEndPeriod"],
      key: "squareMeterPerBoxAtEndPeriod",
      align: "center",
    },
    {
      title: "Giá trị tồn",
      dataIndex: ["productInventoryStoreDTO", "inventoryCost"],
      key: "inventoryCost",
      align: "center",
    },
  ];
  const columnsProductInventory = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (a, b, index) => <Text>{index + 1}</Text>,
    },
    {
      title: "Số lô",
      dataIndex: ["productDetailDTO", "shipment"],
      key: "shipment",
      align: "center",
    },
    {
      title: "Loại",
      dataIndex: ["productDetailDTO", "type"],
      key: "type",
      align: "center",
    },
    {
      title: "Giá nhập",
      dataIndex: ["productDetailDTO", "costPerSquareMeter"],
      key: "costPerSquareMeter",
      align: "center",
    },
    {
      title: "Tồn đầu kỳ",
      dataIndex: [
        "productDetailInventoryStoreDTO",
        "squareMeterPerBoxAtBeginPeriod",
      ],
      key: "squareMeterPerBoxAtBeginPeriod",
      align: "center",
    },
    {
      title: "Số lượng nhập",
      dataIndex: ["productDetailInventoryStoreDTO", "squareMeterPerBoxImport"],
      key: "squareMeterPerBoxImport",
      align: "center",
    },
    {
      title: "Số lượng xuất",
      dataIndex: ["productDetailInventoryStoreDTO", "squareMeterPerBoxExport"],
      key: "squareMeterPerBoxExport",
      align: "center",
    },
    {
      title: "Số lượng nhập lại",
      dataIndex: [
        "productDetailInventoryStoreDTO",
        "squareMeterPerBoxReExport",
      ],
      key: "squareMeterPerBoxReExport",
      align: "center",
    },
    {
      title: "Tồn cuối kỳ",
      dataIndex: [
        "productDetailInventoryStoreDTO",
        "squareMeterPerBoxAtEndPeriod",
      ],
      key: "squareMeterPerBoxAtEndPeriod",
      align: "center",
    },
    {
      title: "Giá trị tồn",
      dataIndex: ["productDetailInventoryStoreDTO", "inventoryCost"],
      key: "inventoryCost",
      align: "center",
      // render: (value) => {
      //   return <Statistic value={value} precision={0} />;
      // },
    },
  ];

  const initialValues =
    params.month && params.year
      ? {
          data: dayjs(
            params.month.length === 1
              ? `0${params.month}/${params.year}`
              : `${params.month}/${params.year}`,
            "MM/YYYY"
          ),
        }
      : { data: dayjs(`${dayjs().month() + 1}/${dayjs().year()}`, "MM/YYYY") };

  const onHandlePagination = (pageCurrent, pageSize) => {
    const params = queryString.parse(location.search);

    const page = pageCurrent.toString();
    const size = pageSize.toString();

    history.push({
      pathname: DashboardPaths.PRODUCT_INVENTORY,
      search: queryString.stringify({
        ...params,
        size: size,
        number: page,
        month: `${initialValues.data.month() + 1}`,
        year: `${initialValues.data.year()}`,
      }),
    });
  };

  useEffect(() => {
    setIsLoading(true);

    let query = queryString.parse(location.search);
    if (query.number) {
      query.number = query.number - 1;
    }
    query = {
      ...query,
      month: initialValues.data.month() + 1,
      year: initialValues.data.year(),
    };

    dispatch(getProductInventory(query))
      .then(unwrapResult)
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response.status === 400) {
          notification.success({
            message: "Tồn kho theo sản phẩm",
            description: "Tham số không đúng, vui lòng kiểm tra lại",
          });
        }
      });
  }, [dispatch, location]);

  return (
    <div className="product-inventory">
      <div className="top">
        <Title level={5} style={{ marginBottom: 0 }}>
          Xuất dữ liệu
        </Title>

        <Radio.Group onChange={(e) => setTabPosition(e.target.value)}>
          <Radio.Button value="excel">Excel</Radio.Button>
          <Radio.Button value="csv">CSV</Radio.Button>
          <Radio.Button value="pdf">PDF</Radio.Button>
          <Radio.Button value="print">Print</Radio.Button>
        </Radio.Group>
      </div>

      <Table
        rowKey={(record) => record.productDTO.id}
        columns={columns}
        loading={isLoading}
        dataSource={[...listProductInventory]}
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
        expandable={{
          expandedRowRender: (record) => (
            <Table
              bordered
              loading={isLoading}
              columns={columnsProductInventory}
              rowKey={(record) => record.productDetailDTO.id}
              dataSource={[...record.productDetailInventoryDTOS]}
              pagination={false}
              className="productsExpande"
            />
          ),
        }}
      />
    </div>
  );
}