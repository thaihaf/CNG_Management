import {
  Button,
  Form,
  message,
  Modal,
  notification,
  Spin,
  Tabs,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";

import "./ExportWrapper.css";

import deleteFileImg from "assets/icons/deleteFile.png";
import uploadFileImg from "assets/icons/uploadFile.png";

import { getStatusString } from "helpers/util.helper";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import StatisticGroups from "../StatisticGroups/StatisticGroups";
import TableUpdate from "../TableUpdate/TableUpdate";
import TableCreate from "../TableCreate/TableCreate";
import {
  clearProductExport,
  createProductExport,
  deleteProductExport,
  ProductExportManagerPaths,
  updateProductExports,
} from "features/export-product/exportProduct";
import HeaderTable from "../HeaderTable/HeaderTable";
import {
  statusProductExport,
  statusProductReExport,
} from "features/export-product/constants/export-product.constants";

const { Title } = Typography;

const ExportWrapper = ({ updateMode }) => {
  const { productsExport, productExportDetails } = useSelector(
    (state) => state.productExport
  );

  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();

  const [activeTab, setActiveTab] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const onDeleteProductExport = () => {
    Modal.confirm({
      title: "Xoá Đơn xuất",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có chắc chắn muốn xoá Đơn xuất không?",
      okText: "Xoá bỏ",
      cancelText: "Huỷ bỏ",
      onOk: () => {
        setIsLoading(true);
        dispatch(deleteProductExport(productExportDetails.id))
          .then(unwrapResult)
          .then((res) => {
            dispatch(clearProductExport());
            history.push(ProductExportManagerPaths.LIST_PRODUCT_EXPORT);
            notification.success({
              message: "Xoá Đơn xuất",
              description: "Xoá Đơn xuất thành công!",
            });
            setIsLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setIsLoading(false);
            notification.error({
              message: "Xoá Đơn xuất",
              description: "Xoá Đơn xuất thất bại",
            });
          });
      },
      onCancel: () => {},
    });
  };
  const onBeforeSubmit = () => {
    const listHeaderItemValue = form.getFieldsValue([
      "customerId",
      "employeeId",
      "type",
      "licensePlates",
      "exportDate",
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

    if (listProduct.length === 0) {
      notification.warning({
        message: "Đơn xuất",
        description: "Vui lòng chọn ít nhất một sản phẩm!",
      });
      return;
    }

    const pLostWarehouse = listProduct.find((p) => {
      let warehouse = form.getFieldValue([`${p.id}_${p.index}`, "warehouse"]);
      return (
        (!p.value.warehouse || p.value.warehouse.length === 0) &&
        (!warehouse || warehouse.length === 0)
      );
    });

    if (pLostWarehouse) {
      notification.warning({
        message: "Đơn xuất",
        description: `Sản phẩm có Mã ${pLostWarehouse.id}, với vị trí tại ${pLostWarehouse.index} cần chọn ít nhất một Kho`,
      });
      return;
    }

    let exportProductDetailDTOS = listProduct.map((p) => {
      const pWithIndex = productsExport.find((item) => item.index === p.index);

      const exportProductDetailDTO = {
        ...p.value,
        productDetailDTO: {
          id: p.value.productDetailId,
          productId: p.id,
        },
        exportProductDetailWarehouseList: form.getFieldValue([
          `${p.id}_${p.index}`,
          "warehouse",
        ]),
        id: typeof pWithIndex.id === "number" ? pWithIndex.id : null,
        noteExport: p.value.noteExport ? p.value.noteExport : "",
        costPerSquareMeter: pWithIndex.costPerSquareMeter,
        exportProductId: productExportDetails?.id,
      };
      return exportProductDetailDTO;
    });

    let exportData = {
      id: productExportDetails?.id,
      licensePlates: value.licensePlates,
      customerId: value.customerId,
      employeeId: value.employeeId,
      createDate: value.exportDate.format("YYYY-MM-DD"),
      status: value.status,
      type: value.type,
      exportProductDetailDTOS: exportProductDetailDTOS,
    };

    console.log(exportData);

    setIsLoading(true);
    dispatch(
      updateMode
        ? updateProductExports({
            id: productExportDetails?.id,
            data: exportData,
          })
        : createProductExport(exportData)
    )
      .then(unwrapResult)
      .then((res) => {
        console.log(res);

        setIsLoading(false);
        notification.success({
          message: "Đơn xuất",
          description: `${
            updateMode ? "Cập nhật" : "Tạo mới"
          } Đơn xuất thành công!`,
        });
        history.push(ProductExportManagerPaths.LIST_PRODUCT_EXPORT);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
        notification.error({
          message: "Đơn xuất",
          description: `${
            updateMode ? "Cập nhật" : "Tạo mới"
          } Đơn xuất thất bại!`,
        });
      });
  };

  const initialValues = updateMode ? productExportDetails : null;

  useEffect(() => {
    form.setFieldValue(initialValues);

    if (initialValues) {
      let arr =
        initialValues.type === "EXPORT"
          ? statusProductExport
          : statusProductReExport;

      form.setFieldValue(
        "statusExport",
        getStatusString(initialValues.status, arr)
      );
    }
  }, [dispatch, updateMode, initialValues]);

  if (!initialValues && updateMode == true) {
    return <Spin spinning={isLoading} />;
  }

  return (
    <Spin spinning={isLoading}>
      <Form
        className="product"
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
            Chi tiết Đơn xuất
          </Title>

          {updateMode &&
            typeof productExportDetails?.status === "number" &&
            productExportDetails?.status !== 4 && (
              <>
                <Button
                  type="danger"
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
                  onClick={() => onDeleteProductExport()}
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

export default React.memo(ExportWrapper);
