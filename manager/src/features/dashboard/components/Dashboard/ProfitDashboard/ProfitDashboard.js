import React, { useEffect } from "react";
import Chart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Spin,
  Typography,
  notification,
} from "antd";

import { getMessage } from "helpers/util.helper";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { useState } from "react";
import dayjs from "dayjs";
import {
  DashboardPaths,
  getProfitDashBoardByDay,
  getProfitDashBoardByMonth,
  getProfitDashBoardByYear,
} from "features/dashboard/dashboard";

import rightArrowImg from "assets/icons/rightArrow.png";

import "./ProfitDashboard.css";

const { RangePicker } = DatePicker;
const { Title } = Typography;

export default function ProfitDashboard() {
  const { series, options } = useSelector(
    (state) => state.dashboard.dashboard.profit
  );

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [type, setType] = useState("years");
  const [isLoading, setIsLoading] = useState(false);

  const PickerWithType = ({ type }) => {
    if (type === "month" || type === "year")
      return (
        <Form.Item
          name="data"
          rules={[
            {
              required: true,
              message: getMessage(
                CODE_ERROR.ERROR_REQUIRED,
                MESSAGE_ERROR,
                type === "date" ? "Tháng và Năm" : "Năm"
              ),
            },
          ]}
          initialValue={
            type === "month"
              ? dayjs(`${dayjs().month() + 1}/${dayjs().year()}`, "MM/YYYY")
              : dayjs(`${dayjs().year()}`, "YYYY")
          }
        >
          <DatePicker picker={type} placement="bottomRight" />
        </Form.Item>
      );

    return (
      <Form.Item
        name="years"
        rules={[
          {
            required: true,
            message: getMessage(
              CODE_ERROR.ERROR_REQUIRED,
              MESSAGE_ERROR,
              "Năm"
            ),
          },
        ]}
      >
        <RangePicker picker="year" placement="bottomRight" />
      </Form.Item>
    );
  };

  const getData = async (values) => {
    setIsLoading(true);
    switch (type) {
      case "month":
        const data = values
          ? {
              month: values.data.month() + 1,
              year: values.data.year(),
            }
          : {
              month: form.getFieldValue("data").month() + 1,
              year: form.getFieldValue("data").year(),
            };
        dispatch(getProfitDashBoardByDay(data))
          .then(() => {
            setIsLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
        break;
      case "year":
        const data2 = values
          ? values.data.year()
          : form.getFieldValue("data").year();
        dispatch(getProfitDashBoardByMonth(data2))
          .then(() => {
            setIsLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
        break;
      case "years":
        const years = form.getFieldValue("years");
        const data3 = values
          ? {
              startYear: values.years[0].year(),
              endYear: values.years[1].year(),
            }
          : {
              startYear: years[0].year(),
              endYear: years[1].year(),
            };

        dispatch(getProfitDashBoardByYear(data3))
          .then(() => {
            setIsLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
        break;
    }
  };

  const onFinish = (values) => {
    getData(values);
  };

  useEffect(() => {
    getData();
  }, [dispatch, type]);

  return (
    <Spin spinning={isLoading}>
      <Form
        className="area-chart"
        form={form}
        colon={false}
        onFinish={onFinish}
        initialValues={{
          years: [
            dayjs(`${dayjs().year() - 9}`, "YYYY"),
            dayjs(`${dayjs().year()}`, "YYYY"),
          ],
        }}
      >
        <div className="top">
          <Title className="title" level={5}>
            Tổng quan lợi nhuận
          </Title>
          <a
            href={DashboardPaths.DASHBOARD_MANAGER}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            Xem tất cả
            <img
              src={rightArrowImg}
              alt=""
              style={{ width: "1rem", height: "1rem" }}
            />
          </a>
        </div>
        <div className="options">
          <div className="options-left">
            <Form.Item name="type" label="Loại" initialValue={type}>
              <Select
                style={{
                  width: "max-content",
                  minWidth: "100px",
                }}
                onChange={setType}
                options={[
                  {
                    value: "month",
                    label: "Ngày",
                  },
                  {
                    value: "year",
                    label: "Tháng",
                  },
                  {
                    value: "years",
                    label: "Năm",
                  },
                ]}
              />
            </Form.Item>
            <PickerWithType type={type} />
          </div>

          <Button
            type="primary"
            shape="round"
            htmlType="submit"
            // disabled={checkDisable === false ? false : true}
            style={{
              width: 120,
              background: "lightcoral",
            }}
          >
            Tìm kiếm
          </Button>
        </div>

        <Chart options={options} series={series} type="area" height={250} />
      </Form>
    </Spin>
  );
}
