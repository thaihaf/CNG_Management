import { DatePicker, Form, Input, Select, Typography } from "antd";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { getEmployees } from "features/employee-manager/employeeManager";
import { getMessage, getStatusString } from "helpers/util.helper";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import "./HeaderTable.css";
import { statusProductExport, typeExport } from "features/export-product/constants/export-product.constants";

const { Title, Text } = Typography;

export default function HeaderTable({ form, updateMode }) {
  const { listEmployees } = useSelector((state) => state.employee);
  const { listCustomers } = useSelector((state) => state.customer);
  const { productExportDetails } = useSelector((state) => state.productExport);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getEmployees());
  }, [dispatch, productExportDetails, form]);

  return (
    <div className="headerHidden">
      <Form.Item
        name="customerId"
        label={<Text>Khách hàng</Text>}
        className="details__item"
        rules={[
          {
            required: true,
            message: getMessage(
              CODE_ERROR.ERROR_REQUIRED,
              MESSAGE_ERROR,
              "Khách hàng"
            ),
          },
        ]}
      >
        <Select
          showSearch
          allowClear
          placeholder="Select customer"
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
          {listCustomers.map((item) => (
            <Select.Option value={item.id} key={item.id}>
              {`${item.firstName} ${item.lastName}`}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="employeeId"
        label={<Text>Người bán</Text>}
        className="details__item"
        rules={[
          {
            required: true,
            message: getMessage(
              CODE_ERROR.ERROR_REQUIRED,
              MESSAGE_ERROR,
              "Người bán"
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
          placeholder="Select employee"
        >
          {listEmployees.map((item) => (
            <Select.Option value={item.id} key={item.id}>
              {`${item.firstName} ${item.lastName}`}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="type"
        label={<Text>Hình thức xuất</Text>}
        className="details__item"
        rules={[
          {
            required: true,
            message: getMessage(
              CODE_ERROR.ERROR_REQUIRED,
              MESSAGE_ERROR,
              "Hình thức xuất"
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
          placeholder="Select type"
          options={typeExport}
        ></Select>
      </Form.Item>
      <Form.Item
        name="licensePlates"
        label={<Text>Biển số xe</Text>}
        className="details__item"
        rules={[
          {
            required: true,
            message: getMessage(
              CODE_ERROR.ERROR_REQUIRED,
              MESSAGE_ERROR,
              "Biển số xe"
            ),
          },
        ]}
      >
        <Input placeholder="29v3-41065" />
      </Form.Item>
      <Form.Item
        name="exportDate"
        label={<Text>Ngày xuất</Text>}
        className="details__item"
        rules={[
          {
            required: true,
            message: getMessage(
              CODE_ERROR.ERROR_REQUIRED,
              MESSAGE_ERROR,
              "Ngày xuất"
            ),
          },
        ]}
        initialValue={
          updateMode
            ? moment(productExportDetails?.createDate, "YYYY-MM-DD").add(1, "d")
            : moment()
        }
      >
        <DatePicker format="YYYY-MM-DD" />
      </Form.Item>
      {updateMode && (
        <Form.Item
          name="status"
          label={<Text>Trạng thái</Text>}
          className="details__item"
          rules={[
            {
              required: true,
              message: getMessage(
                CODE_ERROR.ERROR_REQUIRED,
                MESSAGE_ERROR,
                "Trạng thái"
              ),
            },
          ]}
        >
          <Select
            showSearch
            allowClear
            options={statusProductExport}
            onChange={(value) =>
              form.setFieldValue("statusExport", getStatusString(value))
            }
          ></Select>
        </Form.Item>
      )}
    </div>
  );
}
