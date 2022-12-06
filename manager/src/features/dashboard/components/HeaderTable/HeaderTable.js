import { Button, DatePicker, Form, message, notification, Select } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { searchProduct } from "features/product-manager/productManager";
import moment from "moment";
import "./HeaderTable.css";
import { updateProductImport } from "features/import-product/importProduct";
import { getMessage } from "helpers/util.helper";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";

const { Option } = Select;

const HeaderTable = ({ type }) => {
  return (
    <>
      {type ? (
        <div className="headerTable">
          <Form.Item
            name={"data"}
            className="details__item"
            // style={{
            //   width: 180,
            //   marginRight: "2rem",
            // }}
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
            <DatePicker
              picker={type === "day" ? "month" : "year"}
              format={type === "day" ? "MM/YYYY" : "YYYY"}
            />
          </Form.Item>
          <Button
            type="primary"
            shape={"round"}
            size={"large"}
            htmlType={"submit"}
            // onClick={async () => await handleGetList()}
            // disabled={datesPicker ? false : true}
            style={{
              width: 180,
            }}
          >
            Tìm kiếm
          </Button>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default React.memo(HeaderTable);
