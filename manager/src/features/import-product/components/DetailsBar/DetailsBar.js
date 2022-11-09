import { CaretUpOutlined } from "@ant-design/icons";
import {
  Button,
  Divider,
  Input,
  Form,
  Typography,
  Statistic,
  Select,
} from "antd";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { getEmployees } from "features/employee-manager/employeeManager";
import { getSuppliers } from "features/supplier-manager/supplierManager";
import { getMessage } from "helpers/util.helper";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./DetailsBar.css";

const { TextArea } = Input;
const { Text, Title } = Typography;

export default function DetailsBar({ form }) {
  const { listSuppliers } = useSelector((state) => state.supplier);
  const { listEmployees } = useSelector((state) => state.employee);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSuppliers());
    dispatch(getEmployees());
  }, [dispatch]);

  return (
    <div className="details-bar">
      <Title
        level={4}
        style={{ margin: "1rem 0 2rem 0", textAlign: "center", width: "100%" }}
      >
        Details Import
      </Title>

      <div className="details mb-auto">
        <Form.Item
          name="supplierId"
          label={<Text>Supplier</Text>}
          className="details__item"
          rules={[
            {
              required: true,
              message: getMessage(
                CODE_ERROR.ERROR_REQUIRED,
                MESSAGE_ERROR,
                "Supplier"
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
            {listSuppliers.map((item) => (
              <Select.Option value={item.id} key={item.id}>
                {item.supplierName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
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
          name="note"
          label={<Text>Note</Text>}
          className="details__item"
        >
          <TextArea
            showCount
            maxLength={300}
            style={{
              height: 120,
              resize: "none",
            }}
          />
        </Form.Item>
      </div>

      <Divider />

      <div className="total-caculator">
        <Form.Item
          name={"totalQuantityBox"}
          onChange={(value) => console.log(value)}
          initialValue={0}
          label={<Text>Total Quantity Box</Text>}
        >
          <Statistic />
        </Form.Item>
        <Form.Item
          name={"totalCostPrice"}
          onChange={(value) => console.log(value)}
          initialValue={0}
          label={<Text>Total Cost Price</Text>}
        >
          <Statistic />
        </Form.Item>
      </div>

      <Divider />

      <div className="btn-groups">
        <Button
          type="primary"
          shape="round"
          // icon={<CaretUpOutlined />}
          size={"large"}
          htmlType="submit"
          style={{
            width: "100%",
            height: "45px",
          }}
        >
          Submit
        </Button>
        <Button
          type="primary"
          shape="round"
          size={"large"}
          htmlType="reset"
          style={{
            width: "100%",
            height: "45px",
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
