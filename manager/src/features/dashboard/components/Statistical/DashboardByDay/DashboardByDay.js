import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Radio,
  Space,
  Statistic,
  Table,
  Typography,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { get } from "lodash";
import Highlighter from "react-highlight-words";

import "./DashboardByDay.css";
import { getDashBoardByDay } from "features/dashboard/dashboard";
import { getMessage } from "helpers/util.helper";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { Excel } from "antd-table-saveas-excel";
import { dayDashboardColumnsExport } from "features/dashboard/constants/dashboard.column";

const { Title, Text } = Typography;

export default function DashboardByDay() {
  const { listDashboardByDay, month, year } = useSelector(
    (state) => state.dashboard.dashboardByDay
  );

  const history = useHistory();
  const dispatch = useDispatch();

  const [tabPosition, setTabPosition] = useState();
  const [checkDisable, setCheckDisable] = useState(true);
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

  const colunns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (a, b, index) => <Text>{index + 1}</Text>,
    },
    {
      title: "Ngày",
      key: "date",
      align: "center",
      render: (record) => {
        return (
          <Text>
            {record.day}/{record.month}/{record.year}
          </Text>
        );
      },
      // ...getColumnSearchProps("id"),
    },
    {
      title: "Số M2 nhập hàng (m2)",
      dataIndex: "totalSquareMeterImport",
      key: "totalSquareMeterImport",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={value === 0 ? 0 : 2} />;
      },
    },
    {
      title: "Tiền nhập hàng (vnđ)",
      dataIndex: "totalCostImport",
      key: "totalCostImport",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={0} />;
      },
    },
    {
      title: "Số M2 nhập lại (m2)",
      dataIndex: "totalSquareMeterReExport",
      key: "totalSquareMeterReExport",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={value === 0 ? 0 : 2} />;
      },
    },
    {
      title: "Tiền nhập lại (vnđ)",
      dataIndex: "totalPriceReExport",
      key: "totalPriceReExport",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={0} />;
      },
    },
    {
      title: "Số M2 xuất hàng (m2)",
      dataIndex: "totalSquareMeterExport",
      key: "totalSquareMeterExport",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={value === 0 ? 0 : 2} />;
      },
    },
    {
      title: "Tiền xuất hàng (vnđ)",
      dataIndex: "totalPriceExport",
      key: "totalPriceExport",
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

  const handleExportExcel = () => {
    const excel = new Excel();

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

    excel.addSheet("Thống kê theo ngày");
    excel.drawCell(0, 0, {
      hMerge: 8,
      vMerge: 3,
      value:
        !month || !year
          ? "Vui lòng chọn lại thống kê theo ngày và Xuất lại"
          : `Thống kê theo ngày trong tháng ${month}/${year}`,
      style: {
        bold: true,
        border: true,
        background: "FFC000",
        fontSize: 25,
        h: "center",
        v: "center",
        fontName: "SF Mono",
      },
    });
    excel.addColumns(dayDashboardColumnsExport);
    excel.addDataSource(listDashboardByDay);

    excel.saveAs(`Thống kê ${month}-${year}.xlsx`);
  };
  const getData = async (defaultValues) => {
    setIsLoading(true);
    dispatch(
      getDashBoardByDay(
        defaultValues
          ? defaultValues
          : { month: dayjs().month() + 1, year: dayjs().year() }
      )
    )
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onFinish = ({ data }) => {
    getData({ month: data.month() + 1, year: data.year() });
  };

  useEffect(() => {
    getData();
  }, [dispatch]);

  return (
    <Form
      className="dashboardByDay"
      autoComplete="off"
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        data: dayjs(`${dayjs().year()}/${dayjs().month() + 1}`, "YYYY/MM"),
      }}
    >
      <div className="top">
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
          <Form.Item
            name={"data"}
            className="details__item"
            rules={[
              {
                required: true,
                message: getMessage(
                  CODE_ERROR.ERROR_REQUIRED,
                  MESSAGE_ERROR,
                  "Năm và Tháng"
                ),
              },
            ]}
          >
            <DatePicker
              picker={"month"}
              format={"MM/YYYY"}
              placement="bottomRight"
              onChange={(dates) => {
                dates ? setCheckDisable(false) : setCheckDisable(true);
              }}
            />
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
        columns={colunns}
        dataSource={[...listDashboardByDay]}
        rowKey={(record) => record.day}
        loading={isLoading}
        scroll={{ x: "maxContent" }}
        rowClassName={(record, index) =>
          index % 2 === 0
            ? "table-row table-row-even"
            : "table-row table-row-odd"
        }
        pagination={false}
      />
    </Form>
  );
}
