import { Button, DatePicker, Form, message, notification, Select } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { searchProduct } from "features/product-manager/productManager";
import dayjs from "dayjs";
import "./HeaderTable.css";
import { updateProductImport } from "features/import-product/importProduct";
import { getMessage } from "helpers/util.helper";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { getDashboardCustomerDaily } from "features/dashboard/dashboard";

const { RangePicker } = DatePicker;
const { Option } = Select;

const HeaderTable = ({ type, checkDisable, setCheckDisable }) => {
  const { listCustomers } = useSelector((state) => state.customer);
  const { listEmployees } = useSelector((state) => state.employee);

  return (
    <>
      {type ? (
        <div className="headerTable wrapper">
          {type === "day" || type === "month" ? (
            <div className="wrapper dashboard">
              <Form.Item
                name={"data"}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      type === "day" ? "Năm và Tháng" : "Năm"
                    ),
                  },
                ]}
              >
                <DatePicker
                  picker={type === "day" ? "month" : "year"}
                  format={type === "day" ? "MM/YYYY" : "YYYY"}
                  onChange={(dates) => {
                    dates ? setCheckDisable(false) : setCheckDisable(true);
                  }}
                />
              </Form.Item>
            </div>
          ) : (
            <div className="wrapper dashboard">
              <Form.Item
                name={"years"}
                className="details__item"
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
                <RangePicker
                  picker="year"
                  onChange={(years) => {
                    years ? setCheckDisable(false) : setCheckDisable(true);
                  }}
                  placement="bottomRight"
                />
              </Form.Item>
            </div>
          )}

          <Button
            type="primary"
            shape={"round"}
            size={"large"}
            htmlType={"submit"}
            disabled={checkDisable === false ? false : true}
            style={{
              width: 180,
            }}
          >
            Tìm kiếm
          </Button>
        </div>
      ) : (
        <div className="headerTable wrapper">
          <div className="wrapper">
            <Form.Item name="customer">
              <Select
                showSearch
                allowClear
                onChange={() => setCheckDisable(false)}
                placeholder="Khách hàng"
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
                    type === "day" ? "Tháng" : "Năm"
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
          </div>

          <Button
            type="primary"
            shape={"round"}
            size={"large"}
            htmlType={"submit"}
            disabled={checkDisable === false ? false : true}
            style={{
              width: 180,
            }}
          >
            Tìm kiếm
          </Button>
        </div>
      )}
    </>
  );
};

export default React.memo(HeaderTable);
