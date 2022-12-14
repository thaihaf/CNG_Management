import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Radio,
  Select,
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
import { getDashBoardByYear } from "features/dashboard/dashboard";
import { Excel } from "antd-table-saveas-excel";
import { getMessage } from "helpers/util.helper";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { yearDashboardColumnsExport } from "features/dashboard/constants/dashboard.column";
import "./DashboardByYear.css";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function DashboardByDay() {
  const { listDashboardByYear, startYear, endYear } = useSelector(
    (state) => state.dashboard.dashboardByYear
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

  const renderTitle = (title, value, format) => {
    let total = listDashboardByYear.reduce(
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
        }}
      >
        <div>{title}</div>
        <div style={{ color: "hotpink" }}> Total: {total}</div>
      </div>
    );
  };

  const colunns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (a, b, index) => <Text>{index + 1}</Text>,
    },
    {
      title: "N??m",
      key: "date",
      align: "center",
      render: (record) => {
        return <Text>{record.year}</Text>;
      },
    },
    {
      title: () =>
        renderTitle("S??? M2 nh???p h??ng (m2)", "totalSquareMeterImport", "m2"),
      dataIndex: "totalSquareMeterImport",
      key: "totalSquareMeterImport",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={value === 0 ? 0 : 2} />;
      },
    },
    {
      title: () =>
        renderTitle("Ti???n nh???p h??ng (VND)", "totalCostImport", "vnd"),
      dataIndex: "totalCostImport",
      key: "totalCostImport",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={0} />;
      },
    },
    {
      title: () =>
        renderTitle("S??? M2 nh???p l???i (m2)", "totalSquareMeterReExport", "m2"),
      dataIndex: "totalSquareMeterReExport",
      key: "totalSquareMeterReExport",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={value === 0 ? 0 : 2} />;
      },
    },
    {
      title: () =>
        renderTitle("Ti???n nh???p l???i (VND)", "totalPriceReExport", "vnd"),
      dataIndex: "totalPriceReExport",
      key: "totalPriceReExport",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={0} />;
      },
    },
    {
      title: () =>
        renderTitle("S??? M2 xu???t h??ng (m2)", "totalSquareMeterExport", "m2"),
      dataIndex: "totalSquareMeterExport",
      key: "totalSquareMeterExport",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={value === 0 ? 0 : 2} />;
      },
    },
    {
      title: () =>
        renderTitle("Ti???n xu???t h??ng (VND)", "totalPriceExport", "vnd"),
      dataIndex: "totalPriceExport",
      key: "totalPriceExport",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={0} />;
      },
    },
    {
      title: () => renderTitle("L???i nhu???n (VND)", "revenue", "vnd"),
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

    excel.addSheet("Th???ng k?? theo n??m");
    excel.drawCell(0, 0, {
      hMerge: 8,
      vMerge: 3,
      value:
        !startYear || !endYear
          ? "Vui l??ng ch???n Th???ng k?? theo n??m v?? Xu???t l???i"
          : `Th???ng k?? theo n??m : ${startYear} - ${endYear}`,
      style: {
        bold: true,
        border: true,
        background: "FFC000",
        fontSize: 25,
        h: "center",
        v: "center",
      },
    });
    excel.addColumns(yearDashboardColumnsExport);
    excel.addDataSource(listDashboardByYear);

    excel.saveAs(`Th???ng k?? ${startYear}-${endYear}.xlsx`);
  };
  const getData = async (defaultValues) => {
    setIsLoading(true);
    dispatch(
      getDashBoardByYear(
        defaultValues
          ? {
              startYear: defaultValues[0].year(),
              endYear: defaultValues[1].year(),
            }
          : { startYear: dayjs().year() - 9, endYear: dayjs().year() }
      )
    )
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onFinish = ({ years }) => {
    getData(years);
  };

  useEffect(() => {
    getData();
  }, [dispatch]);

  return (
    <Form
      className="dashboardByYear"
      name="dynamic_form_nest_item"
      autoComplete="off"
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        years: [
          dayjs(`${dayjs().year() - 9}`, "YYYY"),
          dayjs(`${dayjs().year()}`, "YYYY"),
        ],
      }}
    >
      <div className="top">
        <div className="left">
          <Title level={5} style={{ marginBottom: 0 }}>
            Xu???t d??? li???u
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
            name={"years"}
            className="details__item"
            rules={[
              {
                required: true,
                message: getMessage(
                  CODE_ERROR.ERROR_REQUIRED,
                  MESSAGE_ERROR,
                  "N??m"
                ),
              },
            ]}
          >
            <RangePicker
              picker="year"
              onChange={(years) => {
                years ? setCheckDisable(false) : setCheckDisable(true);
              }}
              placement="bottomRight"
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
            T??m ki???m
          </Button>
        </div>
      </div>

      <Table
        columns={colunns}
        rowClassName={(record, index) =>
          index % 2 === 0
            ? "table-row table-row-even"
            : "table-row table-row-odd"
        }
        dataSource={[...listDashboardByYear]}
        rowKey={(record) => record.year}
        loading={isLoading}
        scroll={{ x: "maxContent" }}
        pagination={false}
      />
    </Form>
  );
}
