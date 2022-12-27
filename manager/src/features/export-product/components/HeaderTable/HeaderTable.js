import { DatePicker, Form, Input, Select, Typography } from "antd";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { getEmployees } from "features/employee-manager/employeeManager";
import { getMessage, getStatusString } from "helpers/util.helper";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";

import "./HeaderTable.css";
import {
  statusProductExport,
  statusProductReExport,
  typeExport,
} from "features/export-product/constants/export-product.constants";
import { useState } from "react";

const { Title, Text } = Typography;

export default function HeaderTable({ form, updateMode }) {
  const { listEmployees } = useSelector((state) => state.employee);
  const { listCustomers } = useSelector((state) => state.customer);
  const { productExportDetails, listProductLv2 } = useSelector(
    (state) => state.productExport
  );

  const dispatch = useDispatch();

  const [statusByType, setStatusByType] = useState("EXPORT");

  useEffect(() => {
    productExportDetails && setStatusByType(productExportDetails.type);
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
          placeholder="Chọn khách hàng"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children ?? "").includes(input)
          }
          filterSort={(optionA, optionB) =>
            (optionA?.children ?? "")
              .toLowerCase()
              .localeCompare((optionB?.children ?? "").toLowerCase())
          }
          disabled={
            productExportDetails?.status === 2 ||
            productExportDetails?.status === 4
              ? true
              : false
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
          placeholder="Chọn người bán"
          disabled={
            productExportDetails?.status === 2 ||
            productExportDetails?.status === 4
              ? true
              : false
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
          placeholder="Chọn hình thức xuất"
          options={typeExport}
          onChange={(value) => {
            if (value === "EXPORT") {
              setStatusByType(value);
            }

            if (!productExportDetails) {
              listProductLv2.map((record) => {
                form.setFieldValue([
                  `${record.id}_${record.index}`,
                  "warehouse",
                ]);
              });
            }
          }}
          disabled={
            updateMode ||
            productExportDetails?.status === 2 ||
            productExportDetails?.status === 4
              ? true
              : false
          }
        />
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
        <Input
          placeholder="Vd : 29v3-41065"
          disabled={
            productExportDetails?.status === 2 ||
            productExportDetails?.status === 4
              ? true
              : false
          }
        />
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
            ? dayjs(productExportDetails?.createDate, "YYYY-MM-DD")
            : dayjs()
        }
      >
        <DatePicker
          format="YYYY-MM-DD"
          disabled={
            productExportDetails?.status === 2 ||
            productExportDetails?.status === 4
              ? true
              : false
          }
        />
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
            options={
              statusByType !== "RE-EXPORT"
                ? statusProductExport
                : statusProductReExport
            }
            onChange={(value) =>
              form.setFieldValue(
                "statusExport",
                getStatusString(
                  value,
                  statusByType !== "RE-EXPORT"
                    ? statusProductExport
                    : statusProductReExport
                )
              )
            }
            disabled={
              productExportDetails?.status === 2 ||
              productExportDetails?.status === 4
                ? true
                : false
            }
          />
        </Form.Item>
      )}
    </div>
  );
}
