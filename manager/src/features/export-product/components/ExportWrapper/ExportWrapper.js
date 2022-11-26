import { Button, Form, message, Modal, Spin, Tabs, Typography } from "antd";
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
      title: "Delete Product Export",
      icon: <ExclamationCircleOutlined />,
      content:
        "Are you really want to Delete Product Export? Action can't revert, scarefully",
      okText: "Delete",
      cancelText: "Cancel",
      onOk: () => {
        setIsLoading(true);
        dispatch(deleteProductExport(productExportDetails.id))
          .then(unwrapResult)
          .then((res) => {
            dispatch(clearProductExport());
            history.push(ProductExportManagerPaths.LIST_PRODUCT_EXPORT);
            message.success("Delete Product Export successfully");
            setIsLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setIsLoading(false);
            message.error("Error deleting Product Export");
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
      message.warning("You must insert least once product to table");
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
      message.warning(
        `Product Id ${pLostWarehouse.id}, with index of ${pLostWarehouse.index} need select warehouse`
      );
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
        message.success(
          `${updateMode ? "Update" : "Create"} Product Export Successfully!`
        );
        history.push(ProductExportManagerPaths.LIST_PRODUCT_EXPORT);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
        message.error(err);
      });
  };

  const initialValues = updateMode ? productExportDetails : null;

  useEffect(() => {
    form.setFieldValue(initialValues);

    if (initialValues) {
      form.setFieldValue("statusExport", getStatusString(initialValues.status));
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
            Export Product Details
          </Title>

          {updateMode &&
            typeof productExportDetails?.status === "number" &&
            productExportDetails?.status !== 2 && (
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
                  Delete
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
                  "Update"
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
              "Create"
            </Button>
          )}
        </div>

        <Tabs
          defaultActiveKey={`table`}
          activeKey={activeTab}
          onTabClick={(key) => setActiveTab(key)}
          items={[
            {
              label: `Tab 1`,
              key: `table`,
              children: updateMode ? (
                <TableUpdate form={form} updateMode={updateMode} />
              ) : (
                <TableCreate form={form} updateMode={updateMode} />
              ),
            },
            {
              label: `Tab 2`,
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
