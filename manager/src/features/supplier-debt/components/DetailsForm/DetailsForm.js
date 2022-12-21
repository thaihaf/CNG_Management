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

import queryString from "query-string";
import { motion } from "framer-motion/dist/framer-motion";
import TableDetails from "../TableDetails/TableDetails";
import dayjs from "dayjs";
import StatisticGroups from "../StatisticGroups/StatisticGroups";
import { SupplierDebtPaths, getSupplierDebtDetails } from "features/supplier-debt/supplierDebt";

const { Title } = Typography;
const { Step } = Steps;
const { RangePicker } = DatePicker;

const DetailsForm = ({ isLoading }) => {
  const { supplierDebtDetails } = useSelector((state) => state.supplierDebt);

  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [form] = Form.useForm();

  const [imgURL, setImgUrl] = useState(null);
  const [datesPicker, setDatesPicker] = useState(null);

  const handleGetList = async () => {
    const params = queryString.parse(location.search);

    history.push({
      pathname: SupplierDebtPaths.SUPPLIER_DEBT_DETAILS.replace(":id", id),
      search: queryString.stringify({
        ...params,
        ...datesPicker,
      }),
    });
  };

  useEffect(() => {
    setImgUrl(supplierDebtDetails?.supplierDTO?.avatarSupplier);

    for (const key in supplierDebtDetails) {
      if (key === "supplierDTO") {
        let supplierDTO = supplierDebtDetails[key];
        for (const key in supplierDTO) {
          if (key === "firstContactName") {
            form.setFieldValue(
              "fullname",
              `${supplierDTO["firstContactName"]} ${supplierDTO["lastContactName"]}`
            );
          } else {
            form.setFieldValue(key, supplierDTO[key]);
          }
        }
      } else {
        form.setFieldValue(key, supplierDebtDetails[key]);
      }
    }
  }, [dispatch, supplierDebtDetails]);

  return (
    <Form
      form={form}
      autoComplete="off"
      layout="vertical"
      initialValues={supplierDebtDetails}
      className="details-form-supplier-debt"
    >
      <StatisticGroups />

      <div className="product-details">
        <div className="actions-group">
          <Title level={3} style={{ marginBottom: 0, marginRight: "auto" }}>
            Chi tiết Nhà cung cấp
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
                title="Thông tin Nhà cung cấp"
                status="finish"
                description={
                  <div className="group-data">
                    <Form.Item label="Nhà cung cấp" name="supplierName">
                      <Input disabled />
                    </Form.Item>
                    <Form.Item label="Tên người liên hệ" name="fullname">
                      <Input disabled />
                    </Form.Item>
                    <Form.Item
                      label="Số điện thoại liên hệ"
                      name="phoneNumberContact"
                    >
                      <Input disabled />
                    </Form.Item>
                    <Form.Item label="Tên ngân hàng" name="bankName">
                      <Input disabled />
                    </Form.Item>
                    <Form.Item label="Mã số thuế" name="taxCode">
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
