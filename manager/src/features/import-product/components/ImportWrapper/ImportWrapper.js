import {
  Button,
  Form,
  Modal,
  notification,
  Select,
  Spin,
  Tabs,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import queryString from "query-string";
import {
  clearProductImport,
  createProductImport,
  deleteProductImport,
  ImportProductManagerPaths,
  updateProductImports,
} from "features/import-product/importProduct";
import "./ImportWrapper.css";

import deleteFileImg from "assets/icons/deleteFile.png";
import uploadFileImg from "assets/icons/uploadFile.png";

import { getStatusString } from "helpers/util.helper";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import StatisticGroups from "../StatisticGroups/StatisticGroups";
import InsertProductTable from "../TableCreate/TableCreate";
import TableUpdate from "../TableUpdate/TableUpdate";
import TableCreate from "../TableCreate/TableCreate";
import { statusProductImport } from "features/import-product/constants/import-product.constants";
import HeaderTable from "../HeaderTable/HeaderTable";

const { Option } = Select;
const { Title } = Typography;

const ImportWrapper = ({ updateMode }) => {
  const { productsImport, productImportDetails } = useSelector(
    (state) => state.productImport
  );

  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const onDeleteProductImport = () => {
    Modal.confirm({
      title: "Xoá Đơn nhập",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có chắc chắn muốn xoá Đơn nhập không?",
      okText: "Xoá bỏ",
      cancelText: "Huỷ bỏ",
      onOk: () => {
        setIsLoading(true);
        dispatch(deleteProductImport(productImportDetails.id))
          .then(unwrapResult)
          .then((res) => {
            dispatch(clearProductImport());
            history.push(ImportProductManagerPaths.LIST_PRODUCT_IMPORT);
            notification.success({
              message: "Xoá Đơn nhập",
              description: "Xoá Xoá Đơn nhập thành công!",
            });
            setIsLoading(false);
          })
          .catch((err) => {
            console.log(err);
            notification.error({
              message: "Xoá Đơn nhập",
              description: "Xoá Xoá Đơn nhập thất bại",
            });
          });
      },
      onCancel: () => {},
    });
  };
  const onBeforeSubmit = () => {
    const listHeaderItemValue = form.getFieldsValue([
      "employeeId",
      "licensePlates",
      "importDate",
    ]);

    let firstCheck = true;
    for (const key in listHeaderItemValue) {
      if (!listHeaderItemValue[key]) {
        firstCheck = false;
        break;
      }
    }

    if (firstCheck) {
      setActiveTab("table");
    } else {
      setActiveTab("details");
    }
  };
  const onFinish = (value) => {
    let listProduct = [];

    for (const key in value) {
      if (key.includes("_")) {
        listProduct.push({
          id: key.split("_")[0],
          index: Number(key.split("_")[1]),
          value: {
            ...value[key],
            productDetailId: Number(value[key].type.split("_")[0]),
            type: value[key].type.split("_")[1],
          },
        });
      }
    }

    // ko có sản phẩm
    if (listProduct.length === 0) {
      notification.warning({
        message: "Đơn nhập",
        description: "Vui lòng nhập ít nhất một sản phẩm!",
      });
      setActiveTab("table");
      return;
    }

    // ko có warehouse
    const pLostWarehouse = listProduct.find((p) => {
      let warehouse = form.getFieldValue([`${p.id}_${p.index}`, "warehouse"]);
      return (
        (!p.value.warehouse || p.value.warehouse.length === 0) &&
        (!warehouse || warehouse.length === 0)
      );
    });
    if (pLostWarehouse) {
      notification.warning({
        message: "Đơn nhập",
        description: `Sản phẩm có Mã ${pLostWarehouse.id}, với STT tại ${pLostWarehouse.index} cần chọn ít nhất một Kho`,
      });

      setActiveTab("table");
      return;
    }

    // thời gian tương lai
    if (value.importDate.isAfter(dayjs()) && value.status === 2) {
      notification.warning({
        message: "Đơn nhập",
        description: "Ngày nhập không thể sau ngày hiện tại!",
      });

      setActiveTab("details");
      return;
    }

    let importProductDetailDTOS = listProduct.map((p) => {
      const pWithIndex = productsImport.find((item) => item.index === p.index);
      const importProductDetailDTO = {
        ...p.value,
        importProductDetailWarehouseDTOList: form.getFieldValue([
          `${p.id}_${p.index}`,
          "warehouse",
        ]),
        noteImport: p.value.noteImport ? p.value.noteImport : "",
        id: typeof pWithIndex.id === "number" ? pWithIndex.id : null,
      };
      return importProductDetailDTO;
    });

    let exportData = {
      licensePlates: value.licensePlates,
      supplierId: value.supplierId,
      employeeId: value.employeeId,
      createDate: value.importDate.format("YYYY-MM-DD"),
      status: value.status,
      importProductDetailDTOS: importProductDetailDTOS,
    };

    setIsLoading(true);
    dispatch(
      updateMode
        ? updateProductImports({
            id: productImportDetails?.id,
            data: exportData,
          })
        : createProductImport(exportData)
    )
      .then(unwrapResult)
      .then((res) => {
        setIsLoading(false);
        notification.success({
          message: "Đơn nhập",
          description: `${
            updateMode ? "Cập nhật" : "Tạo mới"
          } Đơn nhập thành công!`,
        });

        const params = queryString.parse(location.search);
        history.push({
          pathname: ImportProductManagerPaths.LIST_PRODUCT_IMPORT,
          search: queryString.stringify({
            ...params,
            sort: "createAt,desc",
          }),
        });
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
        notification.error({
          message: "Đơn nhập",
          description: `${
            updateMode ? "Cập nhật" : "Tạo mới"
          } Đơn nhập thất bại!`,
        });
      });
  };

  const initialValues = updateMode ? productImportDetails : null;

  useEffect(() => {
    form.setFieldValue(initialValues);

    if (initialValues) {
      form.setFieldValue(
        "statusImport",
        getStatusString(initialValues.status, statusProductImport)
      );
    }
  }, [dispatch, updateMode, initialValues]);

  if (!initialValues && updateMode == true) {
    return <Spin spinning={isLoading} />;
  }

  return (
    <Spin spinning={isLoading}>
      <Form
        className="import-product"
        form={form}
        name="dynamic_form_nest_item"
        autoComplete="off"
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialValues}
      >
        <StatisticGroups updateMode={updateMode} />

        <div className="actions-group">
          <Title level={3} style={{ marginBottom: 0, marginRight: "auto" }}>
            Chi tiết Đơn nhập
          </Title>

          {updateMode &&
            typeof productImportDetails?.status === "number" &&
            productImportDetails?.status !== 2 && (
              <>
                <Button
                  danger
                  type="primary"
                  shape="round"
                  size={"large"}
                  style={{
                    width: "fitContent",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    paddingTop: "2.1rem",
                    paddingBottom: "2.1rem",
                    paddingLeft: "2.8rem",
                    paddingRight: "2.8rem",
                  }}
                  onClick={() => onDeleteProductImport()}
                >
                  <img
                    src={deleteFileImg}
                    alt=""
                    style={{ height: "2.5rem", width: "2.5rem" }}
                  />
                  Xoá bỏ
                </Button>
                <Button
                  type="primary"
                  shape="round"
                  // icon={<CaretUpOutlined />}
                  size={"large"}
                  htmlType="submit"
                  style={{
                    width: "fitContent",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    paddingTop: "2.1rem",
                    paddingBottom: "2.1rem",
                    paddingLeft: "2.8rem",
                    paddingRight: "2.8rem",
                  }}
                  onClick={onBeforeSubmit}
                >
                  <img
                    src={uploadFileImg}
                    alt=""
                    style={{ height: "2.5rem", width: "2.5rem" }}
                  />
                  Cập nhật
                </Button>
              </>
            )}
          {!updateMode && (
            <Button
              type="primary"
              shape="round"
              // icon={<CaretUpOutlined />}
              size={"large"}
              htmlType="submit"
              style={{
                width: "fitContent",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                paddingTop: "2.1rem",
                paddingBottom: "2.1rem",
                paddingLeft: "2.8rem",
                paddingRight: "2.8rem",
              }}
              onClick={onBeforeSubmit}
            >
              <img
                src={uploadFileImg}
                alt=""
                style={{ height: "2.5rem", width: "2.5rem" }}
              />
              Tạo mới
            </Button>
          )}
        </div>

        <Tabs
          defaultActiveKey={`table`}
          activeKey={activeTab}
          onTabClick={(key) => setActiveTab(key)}
          items={[
            {
              label: `Danh sách sản phẩm`,
              key: `table`,
              children: updateMode ? (
                <TableUpdate form={form} updateMode={updateMode} />
              ) : (
                <TableCreate form={form} updateMode={updateMode} />
              ),
            },
            {
              label: `Thông tin khác`,
              key: `details`,
              children: <HeaderTable form={form} updateMode={updateMode} />,
            },
          ]}
        />
      </Form>
    </Spin>
  );
};

export default React.memo(ImportWrapper);
