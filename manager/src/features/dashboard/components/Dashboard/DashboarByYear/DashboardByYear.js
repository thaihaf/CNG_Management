import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
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
import avt_default from "assets/images/avt-default.png";
import { getDashBoardByYear } from "features/dashboard/dashboard";
import HeaderTable from "../HeaderTable/HeaderTable";

const { Text } = Typography;

export default function DashboardByDay() {
  const { listDashboardByYear, totalElements, totalPages, size } = useSelector(
    (state) => state.dashboard.dashboardByYear
  );

  const history = useHistory();
  const dispatch = useDispatch();
  const [DayForm] = Form.useForm();

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
      title: "Năm",
      key: "date",
      align: "center",
      render: (record) => {
        return <Text>{record.year}</Text>;
      },
      // ...getColumnSearchProps("id"),
    },
    {
      title: "Số M2 nhập hàng (m2)",
      dataIndex: "totalSquareMeterImport",
      key: "totalSquareMeterImport",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={0} />;
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
      title: "Số M2 trả hàng (vnđ)",
      dataIndex: "totalSquareMeterReExport",
      key: "totalSquareMeterReExport",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={0} />;
      },
    },
    {
      title: "Tiền trả hàng (vnđ)",
      dataIndex: "totalPriceReExport",
      key: "totalPriceReExport",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={0} />;
      },
    },
    {
      title: "Số M2 xuất hàng (vnđ)",
      dataIndex: "totalSquareMeterExport",
      key: "totalSquareMeterExport",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={0} />;
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

  const getData = async (defaultValues) => {
    setIsLoading(true);
    dispatch(
      getDashBoardByYear(
        defaultValues
          ? defaultValues
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
      className="product"
      form={DayForm}
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
      <Table
        size="middle"
        columns={colunns}
        dataSource={[...listDashboardByYear]}
        rowKey={(record) => record.year}
        loading={isLoading}
        scroll={{ x: "maxContent" }}
        pagination={false}
        title={() => (
          <HeaderTable
            type={"year"}
            checkDisable={checkDisable}
            setCheckDisable={setCheckDisable}
          />
        )}
      />
    </Form>
  );
}
