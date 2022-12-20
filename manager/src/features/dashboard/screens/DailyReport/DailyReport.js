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
  Radio,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import { motion } from "framer-motion/dist/framer-motion";
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
import { getMessage } from "helpers/util.helper";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function CustomerDailyList() {
  const { listDailyReport, totalElements, number, size } = useSelector(
    (state) => state.dashboard.dailyReport
  );
  const { listCustomers } = useSelector((state) => state.customer);
  const { listEmployees } = useSelector((state) => state.employee);

  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [checkDisable, setCheckDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [tabPosition, setTabPosition] = useState();

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
        let color = value === "EXPORT" ? "cadetblue" : "crimson";
        return (
          <Tag color={color}>
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
        return <Statistic value={value} precision={value === 0 ? 0 : 2} />;
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
        return <Statistic value={value} precision={value === 0 ? 0 : 2} />;
      },
      // ...getColumnSearchProps("id"),
    },
    {
      title: "Đơn giá nhập (vnđ)",
      dataIndex: "costPerSquareMeter",
      key: "costPerSquareMeter",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={0} />;
      },
      // ...getColumnSearchProps("id"),
    },
    {
      title: "Đơn giá bán (vnđ)",
      dataIndex: "pricePerSquareMeter",
      key: "pricePerSquareMeter",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={0} />;
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
        <div style={{ color: "hotpink" }}> Total: {total}</div>
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
      border: true,
      fontName: "SF Mono",
    });
    excel.setTBodyStyle({
      h: "center",
      v: "center",
      border: true,
      fontName: "SF Mono",
    });

    excel.drawCell(0, 0, {
      hMerge: 14,
      vMerge: 3,
      value: `Báo cáo hằng ngày : ${startDate} - ${endDate}`,
      style: {
        bold: true,
        border: true,
        v: "center",
        h: "center",
        fontSize: 25,
        fontName: "SF Mono",
        background: "FFC000",
      },
    });

    excel.addColumns(dailyReportColumnsExport);
    excel.addDataSource(dataExport);

    excel.saveAs(`Báo cáo hằng ngày ${startDate} - ${endDate}.xlsx`);
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
      <motion.div
        className="top"
        animate={{ opacity: [0, 1] }}
        exit={{ opacity: [1, 0] }}
        transition={{ duration: 1 }}
      >
        <Title level={2} style={{ marginBottom: 0, marginRight: "auto" }}>
          Báo cáo hằng ngày
        </Title>
      </motion.div>

      <motion.div
        animate={{ opacity: [0, 1], y: [50, 0] }}
        exit={{ opacity: [1, 0] }}
        transition={{ duration: 1 }}
      >
        <Form
          form={form}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          initialValues={{
            dates: [dayjs().startOf("month"), dayjs().endOf("month")],
          }}
        >
          <div className="top bg">
            <div className="left">
              <Title level={5} style={{ marginBottom: 0 }}>
                Xuất dữ liệu
              </Title>

              <Radio.Group onChange={(e) => setTabPosition(e.target.value)}>
                <Radio.Button value="excel" onClick={() => handleExportExcel()}>
                  Excel
                </Radio.Button>
                <Radio.Button value="csv">CSV</Radio.Button>
                <Radio.Button value="pdf">PDF</Radio.Button>
                <Radio.Button value="print">Print</Radio.Button>
              </Radio.Group>
            </div>

            <div className="right">
              <Form.Item name="customer">
                <Select
                  showSearch
                  allowClear
                  onChange={() => setCheckDisable(false)}
                  placeholder="Khách hàng"
                  style={{ width: "maxContent" }}
                >
                  {listCustomers.map((c) => (
                    <Select.Option
                      value={`${c.id}_${c.firstName} ${c.lastName} ${c.addressDTO.ward}`}
                      key={c.id}
                      id={c.id}
                    >
                      {`${c.firstName} ${c.lastName} -  ${c.addressDTO.ward}`}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name={"dates"}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Ngày"
                    ),
                  },
                ]}
              >
                <RangePicker
                  format={"DD/MM/YYYY"}
                  onChange={(dates) => {
                    dates ? setCheckDisable(false) : setCheckDisable(true);
                  }}
                />
              </Form.Item>
              <Form.Item name="employee">
                <Select
                  showSearch
                  allowClear
                  onChange={() => setCheckDisable(false)}
                  placeholder="Người bán hàng"
                >
                  {listEmployees.map((e) => (
                    <Select.Option
                      value={`${e.id}_${e.firstName} ${e.lastName} ${e.ward}`}
                      key={e.id}
                      id={e.id}
                    >
                      {`${e.firstName} ${e.lastName} -  ${e.ward}`}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Button
                type="primary"
                shape="round"
                htmlType="submit"
                disabled={checkDisable === false ? false : true}
                style={{
                  width: 120,
                }}
              >
                Tìm kiếm
              </Button>
            </div>
          </div>

          <Table
            rowClassName={() => "rowClassName1"}
            rowKey={(record) => record.id}
            columns={columns}
            loading={isLoading}
            scroll={{ x: "maxContent" }}
            dataSource={[...listDailyReport]}
            pagination={
              totalElements !== 0
                ? {
                    current: number,
                    pageSize: size,
                    total: totalElements,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    position: ["bottomRight"],
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
      </motion.div>
    </div>
  );
}
