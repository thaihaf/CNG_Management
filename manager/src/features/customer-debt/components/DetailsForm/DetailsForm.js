import React, { useEffect, useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import {
  Button,
  DatePicker,
  Form,
  Image,
  Input,
  notification,
  Select,
  Spin,
  Steps,
  Typography,
  Upload,
} from "antd";

import "./DetailsForm.css";
import { getMessage } from "helpers/util.helper";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";

import { useHistory, useLocation, useParams } from "react-router-dom";

import avt_default from "assets/images/avt-default.png";
import newFileImg from "assets/icons/newFile.png";
import deleteFileImg from "assets/icons/deleteFile.png";
import uploadFileImg from "assets/icons/uploadFile.png";
import uploadImageImg from "assets/icons/uploadImage.png";
import resetFileImg from "assets/icons/resetFile.png";
import minusButtonImg from "assets/icons/minusButton.png";

import TableDetails from "../TableDetails/TableDetails";
import dayjs from "dayjs";
import {
  CustomerDebtPaths,
  getCustomerDebtDetails,
} from "features/customer-debt/customerDebt";
import StatisticGroups from "../StatisticGroups/StatisticGroups";
import queryString from "query-string";
import { motion } from "framer-motion/dist/framer-motion";

const { Title } = Typography;
const { Step } = Steps;
const { RangePicker } = DatePicker;

const DetailsForm = ({ isLoading }) => {
  const { customerDebtDetails } = useSelector((state) => state.customerDebt);

  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [imgURL, setImgUrl] = useState(null);
  const [datesPicker, setDatesPicker] = useState(null);

  const handleGetList = async () => {
    const params = queryString.parse(location.search);

    history.push({
      pathname: CustomerDebtPaths.CUSTOMER_DEBT_DETAILS.replace(":id", id),
      search: queryString.stringify({
        ...params,
        ...datesPicker,
      }),
    });
  };

  useEffect(() => {
    setImgUrl(customerDebtDetails?.customerDTO?.fileAttachDTO?.filePath);

    for (const key in customerDebtDetails) {
      if (key === "customerDTO") {
        let customerDTO = customerDebtDetails[key];
        for (const key in customerDTO) {
          if (key === "firstName") {
            form.setFieldValue(
              "fullname",
              `${customerDTO[key]} ${customerDTO["lastName"]}`
            );
          } else {
            form.setFieldValue(key, customerDTO[key]);
          }
        }
      } else {
        form.setFieldValue(key, customerDebtDetails[key]);
      }
    }
  }, [dispatch, customerDebtDetails]);

  return (
    <Form
      form={form}
      autoComplete="off"
      layout="vertical"
      initialValues={customerDebtDetails}
      className="details-form-customer-debt"
    >
      <StatisticGroups />

      <div className="product-details">
        <div className="actions-group">
          <Title level={3} style={{ marginBottom: 0, marginRight: "auto" }}>
            Công nợ Khách hàng
          </Title>

          <RangePicker
            defaultValue={[dayjs().startOf("month"), dayjs().endOf("month")]}
            format={"DD/MM/YYYY"}
            onChange={(dates, dateString) => {
              if (dates) {
                let value = {
                  startDate: dates[0].format("DD/MM/YYYY"),
                  endDate: dates[1].format("DD/MM/YYYY"),
                };
                setDatesPicker(value);
              } else {
                setDatesPicker(null);
              }
            }}
          />

          <Button
            type="primary"
            shape={"round"}
            size={"large"}
            onClick={async () => await handleGetList()}
            disabled={datesPicker ? false : true}
          >
            Tìm kiếm
          </Button>
        </div>

        <Spin spinning={isLoading}>
          <motion.div
            className="details"
            animate={{ opacity: [0, 1], y: [100, 0] }}
            exit={{ opacity: [1, 0] }}
            transition={{ duration: 1 }}
          >
            <div className="details__avatar">
              <div className="details__avatar-img">
                <img
                  src={!imgURL || imgURL === "" ? avt_default : imgURL}
                  alt="avt"
                />
              </div>
            </div>

            <Steps direction="vertical" className="list-data">
              <Step
                title="Thông tin Khách hàng"
                status="finish"
                description={
                  <div className="group-data">
                    <Form.Item
                      label="Họ và tên"
                      name="fullname"
                      rules={[
                        {
                          required: true,
                          message: getMessage(
                            CODE_ERROR.ERROR_REQUIRED,
                            MESSAGE_ERROR,
                            "Họ và tên"
                          ),
                        },
                      ]}
                    >
                      <Input disabled />
                    </Form.Item>
                    <Form.Item
                      label="Tên cửa hàng"
                      name="shopName"
                      rules={[
                        {
                          required: true,
                          message: getMessage(
                            CODE_ERROR.ERROR_REQUIRED,
                            MESSAGE_ERROR,
                            "Tên cửa hàng"
                          ),
                        },
                      ]}
                    >
                      <Input disabled />
                    </Form.Item>
                    <Form.Item
                      label="Số điện thoại"
                      name="phoneNumber"
                      rules={[
                        {
                          required: true,
                          message: getMessage(
                            CODE_ERROR.ERROR_REQUIRED,
                            MESSAGE_ERROR,
                            "Số điện thoại"
                          ),
                        },
                      ]}
                    >
                      <Input disabled />
                    </Form.Item>
                    <Form.Item
                      label="Mã số thuế"
                      name="taxCode"
                      rules={[
                        {
                          required: true,
                          message: getMessage(
                            CODE_ERROR.ERROR_REQUIRED,
                            MESSAGE_ERROR,
                            "Mã số thuế"
                          ),
                        },
                      ]}
                    >
                      <Input disabled />
                    </Form.Item>
                  </div>
                }
              />

              <Step
                title="Các khoản phát sinh"
                status="finish"
                description={<TableDetails form={form} />}
              />

              <Step title="" status="finish" />
            </Steps>
          </motion.div>
        </Spin>
      </div>
    </Form>
  );
};

export default React.memo(DetailsForm);
