import { Button, DatePicker, Form, Tabs, Typography } from "antd";
import {
  CustomerProfit,
  EmployeeProfit,
  ProductProfit,
  SupplierProfit,
  CategoryProfit,
} from "features/dashboard/components";
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Excel } from "antd-table-saveas-excel";

import "./Profit.css";
import { useSelector } from "react-redux";
import { DashboardPaths } from "features/dashboard/dashboard";
import { getMessage } from "helpers/util.helper";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import queryString from "query-string";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;
const { Title } = Typography;

export default function Profit() {
  const {
    productProfit,
    customerProfit,
    employeeProfit,
    supplierProfit,
    categoryProfit,
  } = useSelector((state) => state.dashboard);

  const [form] = Form.useForm();
  const location = useLocation();
  const history = useHistory();

  const params = queryString.parse(location.search);
  const initialValues =
    params.startDate && params.endDate
      ? {
          data: [
            dayjs(params.startDate, "DD/MM/YYYY"),
            dayjs(params.endDate, "DD/MM/YYYY"),
          ],
        }
      : { data: [dayjs().startOf("month"), dayjs().endOf("month")] };

  const handleTabClick = (key) => {
    let size = 20;
    let number = 0;

    switch (key) {
      case DashboardPaths.PRODUCT_PROFIT:
        if (productProfit.size !== 0) {
          size = productProfit.size;
          number = productProfit.number;
        }
        break;
      case DashboardPaths.CUSTOMER_PROFIT:
        if (customerProfit.size !== 0) {
          size = customerProfit.size;
          number = customerProfit.number;
        }
        break;
      case DashboardPaths.EMPLOYEE_PROFIT:
        if (employeeProfit.size !== 0) {
          size = employeeProfit.size;
          number = employeeProfit.number;
        }
        break;
      case DashboardPaths.SUPPLIER_PROFIT:
        if (supplierProfit.size !== 0) {
          size = supplierProfit.size;
          number = supplierProfit.number;
        }
        break;
      case DashboardPaths.CATEGORY_PROFIT:
        if (categoryProfit.size !== 0) {
          size = categoryProfit.size;
          number = categoryProfit.number;
        }
        break;
    }
    const params = queryString.parse(location.search);
    history.push({
      pathname: key,
      search: queryString.stringify({
        ...params,
        startDate: `${initialValues.data[0].format("DD/MM/YYYY")}`,
        endDate: `${initialValues.data[1].format("DD/MM/YYYY")}`,
        size: size,
        number: number + 1,
      }),
    });
  };
  const onFinish = ({ data }) => {
    const params = queryString.parse(location.search);

    history.push({
      pathname: location.pathname,
      search: queryString.stringify({
        ...params,
        startDate: `${data[0].format("DD/MM/YYYY")}`,
        endDate: `${data[1].format("DD/MM/YYYY")}`,
      }),
    });
  };

  return (
    <Form
      className="profit"
      form={form}
      autoComplete="off"
      onFinish={onFinish}
      initialValues={initialValues}
    >
      <div className="top">
        <Title level={3} style={{ marginBottom: 0, marginRight: "auto" }}>
          Lợi nhuận
        </Title>
        <div className="right">
          <Form.Item
            name="data"
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
              placement="bottomRight"
              // onChange={(dates) => {
              //   dates ? setCheckDisable(false) : setCheckDisable(true);
              // }}
            />
          </Form.Item>
          <Button
            type="primary"
            shape={"round"}
            size={"large"}
            style={{ marginLeft: "1rem" }}
            htmlType={"submit"}
          >
            Tìm kiếm
          </Button>
        </div>
      </div>

      <Tabs
        activeKey={location.pathname}
        onTabClick={(key) => handleTabClick(key)}
        style={{
          boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px",
          borderRadius: "2rem",
          marginTop: "2rem",
        }}
        items={[
          {
            label: `Theo sản phẩm`,
            key: DashboardPaths.PRODUCT_PROFIT,
            children: <ProductProfit />,
          },
          {
            label: `Theo cung cấp`,
            key: DashboardPaths.SUPPLIER_PROFIT,
            children: <SupplierProfit />,
          },
          {
            label: `Theo khách hàng`,
            key: DashboardPaths.CUSTOMER_PROFIT,
            children: <CustomerProfit />,
          },
          {
            label: `Theo nhân viên`,
            key: DashboardPaths.EMPLOYEE_PROFIT,
            children: <EmployeeProfit />,
          },
          {
            label: `Theo chức năng`,
            key: DashboardPaths.CATEGORY_PROFIT,
            children: <CategoryProfit />,
          },
        ]}
      />
    </Form>
  );
}
