import { Button, DatePicker, Form, Tabs, Typography } from "antd";
import {
  CategoryInventory,
  ProductInventory,
  SupplierInventory,
  WarehouseInventory,
} from "features/dashboard/components";
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Excel } from "antd-table-saveas-excel";

import "./Inventory.css";
import { useSelector } from "react-redux";
import { DashboardPaths } from "features/dashboard/dashboard";
import { getMessage } from "helpers/util.helper";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import queryString from "query-string";
import dayjs from "dayjs";

const { Title } = Typography;

export default function Inventory() {
  const {
    productInventory,
    categoryInventory,
    supplierInventory,
    warehouseInventory,
  } = useSelector((state) => state.dashboard);

  const [form] = Form.useForm();
  const location = useLocation();
  const history = useHistory();

  const params = queryString.parse(location.search);
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

  const handleTabClick = (key) => {
    let size = 20;
    let number = 0;

    switch (key) {
      case DashboardPaths.PRODUCT_INVENTORY:
        if (productInventory.size !== 0) {
          size = productInventory.size;
          number = productInventory.number;
        }
        break;
      case DashboardPaths.CATEGORY_INVENTORY:
        if (categoryInventory.size !== 0) {
          size = categoryInventory.size;
          number = categoryInventory.number;
        }
        break;
      case DashboardPaths.SUPPLIER_INVENTORY:
        if (supplierInventory.size !== 0) {
          size = supplierInventory.size;
          number = supplierInventory.number;
        }
        break;
      case DashboardPaths.WAREHOUSE_INVENTORY:
        if (warehouseInventory.size !== 0) {
          size = warehouseInventory.size;
          number = warehouseInventory.number;
        }
        break;
    }
    const params = queryString.parse(location.search);
    history.push({
      pathname: key,
      search: queryString.stringify({
        ...params,
        month: `${initialValues.data.month() + 1}`,
        year: `${initialValues.data.year()}`,
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
        month: `${data.month() + 1}`,
        year: `${data.year()}`,
      }),
    });
  };

  return (
    <Form
      className="inventory"
      form={form}
      autoComplete="off"
      onFinish={onFinish}
      initialValues={initialValues}
    >
      <div className="top-wrapper">
        <Title level={3} style={{ marginBottom: 0, marginRight: "auto" }}>
          Tồn kho
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
                  "Năm và Tháng"
                ),
              },
            ]}
          >
            <DatePicker picker="month" format="MM/YYYY" />
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
            key: DashboardPaths.PRODUCT_INVENTORY,
            children: <ProductInventory />,
          },
          {
            label: `Theo nhà cung cấp`,
            key: DashboardPaths.SUPPLIER_INVENTORY,
            children: <SupplierInventory />,
          },
          {
            label: `Theo chức năng`,
            key: DashboardPaths.CATEGORY_INVENTORY,
            children: <CategoryInventory />,
          },
          {
            label: `Theo kho hàng`,
            key: DashboardPaths.WAREHOUSE_INVENTORY,
            children: <WarehouseInventory />,
          },
        ]}
      />
    </Form>
  );
}
