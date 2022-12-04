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

import { useHistory, useParams } from "react-router-dom";

import avt_default from "assets/images/avt-default.png";
import newFileImg from "assets/icons/newFile.png";
import deleteFileImg from "assets/icons/deleteFile.png";
import uploadFileImg from "assets/icons/uploadFile.png";
import uploadImageImg from "assets/icons/uploadImage.png";
import resetFileImg from "assets/icons/resetFile.png";
import minusButtonImg from "assets/icons/minusButton.png";

import TableDetails from "../TableDetails/TableDetails";
import moment from "moment";
import StatisticGroups from "../StatisticGroups/StatisticGroups";
import { getSupplierDebtDetails } from "features/supplier-debt/supplierDebt";

const { Title } = Typography;
const { Step } = Steps;
const { RangePicker } = DatePicker;

const DetailsForm = () => {
  const { supplierDebtDetails } = useSelector((state) => state.supplierDebt);

  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [imgURL, setImgUrl] = useState(null);
  const [datesPicker, setDatesPicker] = useState(null);

  const handleGetList = async () => {
    setIsLoading(true);
    dispatch(getSupplierDebtDetails({ id: id, ...datesPicker }))
      .then(unwrapResult)
      .then(() => {
        setDatesPicker(null);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
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
    <Spin spinning={isLoading}>
      <Form
        form={form}
        autoComplete="off"
        layout="vertical"
        initialValues={supplierDebtDetails}
      >
        <StatisticGroups />

        <div className="product-details">
          <div className="actions-group">
            <Title level={3} style={{ marginBottom: 0, marginRight: "auto" }}>
              Chi tiết Nhà cung cấp
            </Title>

            <RangePicker
               defaultValue={[moment().startOf("month"), moment().endOf("month")]}
              format={"DD/MM/YYYY"}
              onChange={(dates, dateString) => {
                if (dates) {
                  let value = {
                    startDate: dates[0].format("MM/DD/YYYY"),
                    endDate: dates[1].format("MM/DD/YYYY"),
                  };
                  setDatesPicker(value);
                } else {
                  setDatesPicker(null);
                }
              }}
              renderExtraFooter={(value, a, b) => {
                return (
                  <Button
                    type="primary"
                    shape={"round"}
                    size={"large"}
                    onClick={async () => await handleGetList()}
                    disabled={datesPicker ? false : true}
                  >
                    Tìm kiếm
                  </Button>
                );
              }}
            />
          </div>

          <div className="details">
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
          </div>
        </div>
      </Form>
    </Spin>
  );
};

export default React.memo(DetailsForm);