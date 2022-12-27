import { DatePicker, Form, Input, Select, Typography } from "antd";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { getEmployees } from "features/employee-manager/employeeManager";
import { getMessage, getStatusString } from "helpers/util.helper";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";

import "./HeaderTable.css";
import { statusProductImport } from "features/import-product/constants/import-product.constants";

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
        label={<Text>Nhân viên</Text>}
        className="details__item"
        rules={[
          {
            required: true,
            message: getMessage(
              CODE_ERROR.ERROR_REQUIRED,
              MESSAGE_ERROR,
              "Nhân viên"
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
          disabled={productImportDetails?.status === 2 ? true : false}
        >
          {listEmployees.map(
            (item) =>
              item.status && (
                <Select.Option value={item.id} key={item.id}>
                  {`${item.firstName} ${item.lastName}`}
                </Select.Option>
              )
          )}
        </Select>
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
        <Input disabled={productImportDetails?.status === 2 ? true : false} />
      </Form.Item>
      <Form.Item
        name="importDate"
        label={<Text>Ngày nhập</Text>}
        className="details__item"
        rules={[
          {
            required: true,
            message: getMessage(
              CODE_ERROR.ERROR_REQUIRED,
              MESSAGE_ERROR,
              "Ngày nhập"
            ),
          },
        ]}
        initialValue={
          updateMode
            ? dayjs(productImportDetails?.createDate, "YYYY-MM-DD")
            : dayjs()
        }
      >
        <DatePicker
          format="YYYY-MM-DD"
          disabled={productImportDetails?.status === 2 ? true : false}
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
            options={statusProductImport}
            onChange={(value) =>
              form.setFieldValue(
                "statusImport",
                getStatusString(value, statusProductImport)
              )
            }
            disabled={productImportDetails?.status === 2 ? true : false}
          ></Select>
        </Form.Item>
      )}
    </div>
  );
}
