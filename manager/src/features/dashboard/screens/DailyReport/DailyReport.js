import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

import {
  ContainerOutlined,
  PoweroffOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";

import avt_default from "assets/images/avt-default.png";
import "./DailyReport.css";

import { get } from "lodash";
import dayjs from "dayjs";

import { getEmployees } from "features/employee-manager/employeeManager";
import { getCustomers } from "features/customer-manager/customerManager";
import { getDashboardCustomerDaily } from "features/dashboard/dashboard";
import HeaderTable from "features/dashboard/components/Dashboard/HeaderTable/HeaderTable";
import { Excel } from "antd-table-saveas-excel";
import {
  columnsExport,
  dailyReportColumnsExport,
} from "features/dashboard/constants/dashboard.column";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function CustomerDailyList() {
  const { listDailyReport, totalElements, totalPages, size } = useSelector(
    (state) => state.dashboard.dailyReport
  );
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [checkDisable, setCheckDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
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
      title: "Ngày tạo",
      dataIndex: "createDate",
      key: "createDate",
      align: "center",
      render: (value) => {
        return (
          <Text>
            {dayjs(value.split("T")[0], "YYYY-MM-DD").format("DD/MM/YYYY")}
          </Text>
        );
      },
      // ...getColumnSearchProps("id"),
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      align: "center",
      render: (value) => {
        return <Text>{value}</Text>;
      },
      // ...getColumnSearchProps("id"),
    },
    {
      title: "Mã đơn xuất hàng",
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (value) => {
        return <Text>{value}</Text>;
      },
      // ...getColumnSearchProps("id"),
    },
    {
      title: "Người bán",
      dataIndex: "employeeName",
      key: "employeeName",
      align: "center",
      render: (value) => {
        return <Text>{value}</Text>;
      },
      // ...getColumnSearchProps("id"),
    },
    {
      title: "Loại xuất hàng",
      dataIndex: "type",
      key: "type",
      align: "center",
      render: (value) => {
        return (
          <Tag color="green">
            {value === "EXPORT" ? "XUẤT HÀNG" : "TRẢ HÀNG"}
          </Tag>
        );
      },
      // ...getColumnSearchProps("id"),
    },
    {
      title: () => renderTitle("Số lượng (m2)", "totalSquareMeterExport"),
      dataIndex: "totalSquareMeterExport",
      key: "totalSquareMeterExport",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={2} />;
      },
    },
    {
      title: () =>
        renderTitle("Thành tiền (vnđ)", "totalExportOrderPrice", "vnd"),
      dataIndex: "totalExportOrderPrice",
      key: "totalExportOrderPrice",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={0} />;
      },
    },
    {
      title: () =>
        renderTitle("Tổng lợi nhuận (vnđ)", "exportProductRevenue", "vnd"),
      dataIndex: "exportProductRevenue",
      key: "exportProductRevenue",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={0} />;
      },
    },
  ];
  const columnsDailyReport = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (a, b, index) => <Text>{index + 1}</Text>,
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "productDetailDTO",
      key: "productId",
      align: "center",
      render: (value) => {
        return <Text>{value.productId}</Text>;
      },
      // ...getColumnSearchProps("id"),
    },
    {
      title: "Số lô",
      dataIndex: "productDetailDTO",
      key: "shipment",
      align: "center",
      render: (value) => {
        return <Text>{value.shipment}</Text>;
      },
      // ...getColumnSearchProps("id"),
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "productDetailDTO",
      key: "type",
      align: "center",
      render: (value) => {
        return <Text>{value.type}</Text>;
      },
      // ...getColumnSearchProps("id"),
    },
    {
      title: "Số lượng (m2)",
      dataIndex: "totalSquareMeter",
      key: "totalSquareMeter",
      align: "center",
      render: (value) => {
        return <Text>{value}</Text>;
      },
      // ...getColumnSearchProps("id"),
    },
    {
      title: "Đơn giá nhập (vnđ)",
      dataIndex: "costPerSquareMeter",
      key: "costPerSquareMeter",
      align: "center",
      render: (value) => {
        return <Text>{value}</Text>;
      },
      // ...getColumnSearchProps("id"),
    },
    {
      title: "Đơn giá bán (vnđ)",
      dataIndex: "pricePerSquareMeter",
      key: "pricePerSquareMeter",
      align: "center",
      render: (value) => {
        return <Text>{value}</Text>;
      },
      // ...getColumnSearchProps("id"),
    },
    {
      title: "Thành tiền (vnđ)",
      dataIndex: "totalPrice",
      key: "totalPrice",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={0} />;
      },
    },
    {
      title: "Lợi nhuận (vnđ)",
      dataIndex: "revenue",
      key: "revenue",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={0} />;
      },
    },
  ];

  const renderTitle = (title, value, format) => {
    let total = listDailyReport.reduce(
      (accumulator, currentValue) => accumulator + currentValue[value],
      0
    );

    if (format === "vnd") {
      if (typeof Intl === "undefined" || !Intl.NumberFormat) {
        total = total.toLocaleString("vi-VN", {
          // style: "currency",
          currency: "VND",
        });
      } else {
        const nf = Intl.NumberFormat();
        total = nf.format(total);
      }
    } else {
      total = total !== 0 ? total.toFixed(2) : 0;
    }

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          // alignItems: "flex-end",
        }}
      >
        <div>{title}</div>
        <div style={{ color: "green" }}> Total: {total}</div>
      </div>
    );
  };
  const onHandlePagination = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };
  const onFinish = (values) => {
    setIsLoading(true);

    dispatch(
      getDashboardCustomerDaily({
        startDate: values.dates[0]?.format("DD/MM/YYYY"),
        endDate: values.dates[1]?.format("DD/MM/YYYY"),
        customer: values.customer?.split("_")[0],
        employee: values.employee?.split("_")[0],
      })
    )
      .then(unwrapResult)
      .then(() => {
        setCheckDisable(true);
        setIsLoading(false);
      });
  };
  const handleExportExcel = () => {
    const excel = new Excel();

    let dataExport = [];
    let totalSquareMeter = 0;
    let totalPrice = 0;
    let stt = 0;
    const startDate = form.getFieldValue("dates")[0]?.format("DD/MM/YYYY");
    const endDate = form.getFieldValue("dates")[1]?.format("DD/MM/YYYY");

    listDailyReport.map((item, index, arr) => {
      let products = item.exportProductDetailDTOS;
      const createDate = item.createDate.split("T")[0];
      const exportId = item.id;
      const exportType = item.type === "EXPORT" ? "XUẤT HÀNG" : "TRẢ HÀNG";

      products.map((product, index2, arr2) => {
        totalSquareMeter = totalSquareMeter + product.totalSquareMeter;
        totalPrice = totalPrice + product.totalPrice;

        dataExport.push({
          ...item,
          ...product,
          ...product.productDetailDTO,
          createDate: createDate,
          exportId: exportId,
          exportType: exportType,
          stt: stt,
        });

        stt++;

        if (
          arr2.length === index2 + 1 &&
          arr[index + 1]?.createDate !== item.createDate
        ) {
          dataExport.push({
            totalSquareMeter: totalSquareMeter,
            totalPrice: totalPrice,
          });
          totalSquareMeter = 0;
          totalPrice = 0;
        }
      });
    });

    excel.addSheet("Báo cáo hằng ngày");

    excel.setTHeadStyle({
      h: "center",
      v: "center",
      fontName: "SF Mono",
    });
    excel.setTBodyStyle({
      h: "center",
      v: "center",
      fontName: "SF Mono",
    });

    excel.drawCell(0, 0, {
      hMerge: 14,
      vMerge: 3,
      value: `Báo cáo hằng ngày : ${startDate} - ${endDate}`,
      style: {
        bold: true,
        v: "center",
        h: "center",
        background: "FFC000",
        fontSize: 25,
        fontName: "SF Mono",
      },
    });

    excel.addColumns(dailyReportColumnsExport);
    excel.addDataSource(dataExport);

    excel.saveAs("Báo cáo hằng ngày.xlsx");
  };

  useEffect(() => {
    setIsLoading(true);
    let startDate = dayjs().startOf("month").format("DD/MM/YYYY");
    let endDate = dayjs().endOf("month").format("DD/MM/YYYY");

    dispatch(
      getDashboardCustomerDaily({ startDate: startDate, endDate: endDate })
    )
      .then(unwrapResult)
      .then(() => {
        dispatch(getEmployees());
        dispatch(getCustomers())
          .then(unwrapResult)
          .then(() => {
            setCheckDisable(true);
            setIsLoading(false);
          });
      });
  }, [dispatch, location]);

  return (
    <div className="daily-report">
      <div className="top">
        <Title level={3} style={{ marginBottom: 0, marginRight: "auto" }}>
          Báo cáo hàng ngày
        </Title>

        <Button
          loading={isLoading}
          type="primary"
          shape={"round"}
          size={"large"}
          icon={<ContainerOutlined />}
          onClick={() => handleExportExcel()}
          disabled={listDailyReport.length === 0 ? true : false}
        >
          XUẤT EXCEL
        </Button>
      </div>

      <Form
        form={form}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        initialValues={{
          dates: [dayjs().startOf("month"), dayjs().endOf("month")],
        }}
      >
        <Divider style={{ margin: 0 }} />

        <HeaderTable
          checkDisable={checkDisable}
          setCheckDisable={setCheckDisable}
        />

        <Divider style={{ margin: 0 }} />

        <Table
          rowClassName={() => "rowClassName1"}
          rowKey={(record) => record.id}
          columns={columns}
          loading={isLoading}
          style={{
            borderRadius: "2rem",
          }}
          scroll={{ x: "maxContent" }}
          size="middle"
          dataSource={[...listDailyReport]}
          pagination={
            listDailyReport.length !== 0
              ? {
                  showSizeChanger: true,
                  position: ["bottomRight"],
                  size: "default",
                  pageSize: size,
                  current: currentPage,
                  totalElements,
                  onChange: (page, size) => onHandlePagination(page, size),
                  pageSizeOptions: ["2", "4", "6"],
                }
              : false
          }
          expandable={{
            expandedRowRender: (record) => (
              <Table
                bordered
                loading={isLoading}
                columns={columnsDailyReport}
                rowKey={(record) => record.id}
                dataSource={[...record.exportProductDetailDTOS]}
                pagination={false}
                className="productsExpande"
              />
            ),
          }}
        />
      </Form>
    </div>
  );
}
