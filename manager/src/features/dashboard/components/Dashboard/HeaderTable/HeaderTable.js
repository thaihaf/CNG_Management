import { Button, DatePicker, Form, notification, Select } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import "./HeaderTable.css";
import { getMessage } from "helpers/util.helper";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";

const { RangePicker } = DatePicker;

const HeaderTable = ({ type, checkDisable, setCheckDisable }) => {
  const { listCustomers } = useSelector((state) => state.customer);
  const { listEmployees } = useSelector((state) => state.employee);

  return (
    <>
      {type ? (
        <div className="headerTable wrapper">
          {type === "day" || type === "month" ? (
            <div className="wrapper">
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
            <div className="wrapper">
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
