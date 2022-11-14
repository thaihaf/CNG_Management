import { DatePicker, Form, Input, Select, Typography } from "antd";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { getEmployees } from "features/employee-manager/employeeManager";
import { getMessage } from "helpers/util.helper";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import "./HeaderTable.css";

const { Title, Text } = Typography;

export default function HeaderTable({ form, updateMode }) {
  const { listEmployees } = useSelector((state) => state.employee);
  const { productImportDetails } = useSelector((state) => state.productImport);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getEmployees());
  }, [dispatch, productImportDetails, form]);

  return (
    <div className="headerHidden">
      <Form.Item
        name="employeeId"
        label={<Text>Employee</Text>}
        className="details__item"
        rules={[
          {
            required: true,
            message: getMessage(
              CODE_ERROR.ERROR_REQUIRED,
              MESSAGE_ERROR,
              "Employee"
            ),
          },
        ]}
      >
        <Select
          showSearch
          allowClear
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children ?? "").includes(input)
          }
          filterSort={(optionA, optionB) =>
            (optionA?.children ?? "")
              .toLowerCase()
              .localeCompare((optionB?.children ?? "").toLowerCase())
          }
        >
          {listEmployees.map((item) => (
            <Select.Option value={item.id} key={item.id}>
              {`${item.firstName} ${item.lastName}`}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="licensePlates"
        label={<Text>License Plates</Text>}
        className="details__item"
        rules={[
          {
            required: true,
            message: getMessage(
              CODE_ERROR.ERROR_REQUIRED,
              MESSAGE_ERROR,
              "License Plates"
            ),
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="importDate"
        label={<Text>Import Date</Text>}
        className="details__item"
        rules={[
          {
            required: true,
            message: getMessage(
              CODE_ERROR.ERROR_REQUIRED,
              MESSAGE_ERROR,
              "Import Date"
            ),
          },
        ]}
        initialValue={
          updateMode
            ? moment(productImportDetails?.createDate, "YYYY-MM-DD").add(1, "d")
            : moment()
        }
      >
        <DatePicker
          format="YYYY-MM-DD"
          // format="YYYY-MM-DD HH:mm:ss"
          // showTime={{
          //   defaultValue: moment("00:00:00", "HH:mm:ss"),
          // }}
        />
      </Form.Item>
    </div>
  );
}
