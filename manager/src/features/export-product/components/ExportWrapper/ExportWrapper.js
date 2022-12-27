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
import excelImg from "assets/icons/excel.png";

import { getStatusString } from "helpers/util.helper";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import StatisticGroups from "../StatisticGroups/StatisticGroups";
import TableUpdate from "../TableUpdate/TableUpdate";
import TableCreate from "../TableCreate/TableCreate";
import {
  buildExportColumns,
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
import { Excel } from "antd-table-saveas-excel";
import dayjs from "dayjs";

const { Title } = Typography;

const ExportWrapper = ({ updateMode }) => {
  const { productsExport, productExportDetails } = useSelector(
    (state) => state.productExport
  );
  const { listCustomers } = useSelector((state) => state.customer);

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

  const handleExportExcel = () => {
    const excel = new Excel();

    let dateExport = productExportDetails.createDate.split("T")[0];
    const dayExport = dateExport.split("-")[2];
    const monthExport = dateExport.split("-")[1];
    const yearExport = dateExport.split("-")[0];
    const customer = listCustomers.find(
      (c) => c.id === productExportDetails.customerId
    );
    const newProductsExport = [
      ...productsExport,
      {
        index: "TỔNG CỘNG",
        id: "",
        totalSquareMeter: productExportDetails.totalSquareMeterExport,
        totalPrice: productExportDetails.totalExportOrderPrice,
      },
    ];
    excel.addSheet("Hoá đơn bán hàng");

    excel.setTHeadStyle({
      h: "center",
      v: "center",
      fontSize: 10,
      fontName: "SF Mono",
    });
    excel.setTBodyStyle({
      h: "center",
      v: "center",
      fontSize: 10,
      fontName: "SF Mono",
      border: true,
    });

    excel.addCol();
    excel.addCol();

    excel.drawCell(2, 0, {
      hMerge: 6,
      vMerge: 2,
      value: `HOÁ ĐƠN BÁN HÀNG`,
      style: {
        bold: true,
        v: "center",
        h: "center",
        fontSize: 20,
        fontName: "SF Mono",
      },
    });

    excel.drawCell(2, 3, {
      value: `Liên 2: Gửi khách hàng`,
      hMerge: 6,
      style: {
        fontSize: 11,
        v: "center",
        h: "center",
        border: false,
        fontName: "SF Mono",
      },
    });
    excel.drawCell(2, 4, {
      value: `Ngày ${dayExport} tháng ${monthExport} năm ${yearExport}`,
      hMerge: 6,
      style: {
        fontSize: 11,
        v: "center",
        h: "center",
        border: false,
        fontName: "SF Mono",
      },
    });

    excel.drawCell(9, 1, {
      value: `Mẫu số: 02GTGT3/01`,
      hMerge: 1,
      style: {
        fontSize: 11,
        v: "center",
        h: "left",
        border: false,
        fontName: "SF Mono",
      },
    });
    excel.drawCell(9, 2, {
      value: `Ký hiệu: CNG-HDBL`,
      hMerge: 1,
      style: {
        fontSize: 11,
        v: "center",
        h: "left",
        border: false,
        fontName: "SF Mono",
      },
    });
    excel.drawCell(9, 3, {
      value: `Số: ${productExportDetails.id}`,
      hMerge: 1,
      style: {
        fontSize: 11,
        v: "center",
        h: "left",
        border: false,
        fontName: "SF Mono",
      },
    });

    excel.drawCell(2, 5, {
      value: `Đơn vị bán hàng: Nhà phân phối gạch CNG (Cường Năng Group)`,
      hMerge: 8,
      style: {
        fontSize: 10,
        v: "center",
        h: "left",
        border: false,
        fontName: "SF Mono",
      },
    });
    excel.drawCell(2, 6, {
      value: `Mã số thuế: 0900406845-001`,
      hMerge: 8,
      style: {
        fontSize: 10,
        v: "center",
        h: "left",
        border: false,
        fontName: "SF Mono",
      },
    });
    excel.drawCell(2, 7, {
      value: `Địa chỉ: Số nhà 333, Tân Phú, Sơn Đông, Sơn Tây, Hà Nội`,
      hMerge: 8,
      style: {
        fontSize: 10,
        v: "center",
        h: "left",
        border: false,
        fontName: "SF Mono",
      },
    });
    excel.drawCell(2, 8, {
      value: `Điện thoại: 0912.228.698`,
      hMerge: 8,
      style: {
        fontSize: 10,
        v: "center",
        h: "left",
        border: false,
        fontName: "SF Mono",
      },
    });
    excel.drawCell(2, 9, {
      value: `Số tài khoản: CTK: Đỗ Mạnh Cường- STK: 4511.0000.102.888, Ngân hàng: BIDV`,
      hMerge: 8,
      style: {
        fontSize: 10,
        v: "center",
        h: "left",
        bold: true,
        fontName: "SF Mono",
      },
    });
    excel.drawCell(2, 10, {
      value: `CTK: Nguyễn Thị Hải Năng, STK: 105.0055.08855, Ngân hàng Vietinbank, chi nhánh: Bắc Hưng Yên`,
      hMerge: 8,
      style: {
        fontSize: 10,
        v: "center",
        h: "left",
        bold: true,
        fontName: "SF Mono",
      },
    });

    excel.drawCell(2, 11, {
      value: `Họ tên người mua hàng: ${customer.firstName} ${customer.lastName}`,
      hMerge: 8,
      style: {
        fontSize: 10,
        v: "center",
        h: "left",
        border: false,
        fontName: "SF Mono",
      },
    });
    excel.drawCell(2, 12, {
      value: `Tên đơn vị: ${customer.shopName}`,
      hMerge: 8,
      style: {
        fontSize: 10,
        v: "center",
        h: "left",
        border: false,
        fontName: "SF Mono",
      },
    });
    excel.drawCell(2, 13, {
      value: `Địa chỉ: ${customer.addressDTO.apartmentNumber}, ${customer.addressDTO.ward}, ${customer.addressDTO.district}, ${customer.addressDTO.city}`,
      hMerge: 8,
      style: {
        fontSize: 10,
        v: "center",
        h: "left",
        border: false,
        fontName: "SF Mono",
      },
    });
    excel.drawCell(2, 14, {
      value: `Điện thoại: `,
      hMerge: 8,
      style: {
        fontSize: 10,
        v: "center",
        h: "left",
        border: false,
        fontName: "SF Mono",
      },
    });
    excel.drawCell(2, 15, {
      value: `Số tài khoản: `,
      hMerge: 5,
      style: {
        fontSize: 10,
        v: "center",
        h: "left",
        border: false,
        fontName: "SF Mono",
      },
    });
    excel.drawCell(8, 15, {
      value: `Tên ngân hàng: `,
      hMerge: 2,
      style: {
        fontSize: 10,
        v: "center",
        h: "left",
        border: false,
        fontName: "SF Mono",
      },
    });
    excel.drawCell(2, 16, {
      value: `Hình thức thanh toán: Tiền mặt/Chuyển khoản`,
      hMerge: 5,
      style: {
        fontSize: 10,
        v: "center",
        h: "left",
        border: false,
        fontName: "SF Mono",
      },
    });
    excel.drawCell(8, 16, {
      value: `MST:`,
      hMerge: 2,
      style: {
        fontSize: 10,
        v: "center",
        h: "left",
        border: false,
        fontName: "SF Mono",
      },
    });

    excel.addRow();
    excel.addColumns(buildExportColumns);
    excel.addDataSource(newProductsExport);

    excel.addRow();
    excel.drawCell(2, excel.currentRow, {
      hMerge: 8,
      value: `Thành tiền (viết bằng chữ): `,
      style: {
        v: "center",
        h: "left",
        i: true,
        fontSize: 10,
        fontName: "SF Mono",
      },
    });
    excel.drawCell(2, excel.currentRow, {
      hMerge: 8,
      value: `Biển số xe: ${productExportDetails.licensePlates}`,
      style: {
        v: "center",
        h: "left",
        i: true,
        fontSize: 10,
        fontName: "SF Mono",
      },
    });

    excel.addRow();
    excel.addRow();
    const currentRow = excel.currentRow;

    excel.drawCell(3, currentRow, {
      hMerge: 2,
      value: `KHÁCH HÀNG`,
      style: {
        h: "center",
        fontName: "SF Mono",
        v: "top",
      },
    });
    excel.drawCell(3, currentRow + 1, {
      hMerge: 2,
      vMerge: 5,
    });
    excel.drawCell(7, currentRow - 1, {
      hMerge: 2,
      value: `Ngày ${dayjs().day()},tháng ${dayjs().month()} năm ${dayjs().year()}`,
      style: {
        h: "center",
        fontName: "SF Mono",
        i: true,
        v: "top",
      },
    });
    excel.drawCell(7, currentRow, {
      hMerge: 2,
      value: `NGƯỜI XUẤT HOÁ ĐƠN`,
      style: {
        h: "center",
        fontName: "SF Mono",
        v: "top",
      },
    });
    excel.drawCell(7, currentRow + 1, {
      hMerge: 2,
      vMerge: 5,
    });

    excel.saveAs("Hoá đơn bán hàng.xlsx");
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
        className="export-product"
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
            productExportDetails?.status !== 2 &&
            productExportDetails?.status !== 4 && (
              <>
                <Button
                  danger
                  type="primary"
                  shape="round"
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

          {updateMode && (
            <Button
              type="primary"
              shape="round"
              style={{
                width: "fitContent",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                paddingTop: "2.1rem",
                paddingBottom: "2.1rem",
                paddingLeft: "2.8rem",
                paddingRight: "2.8rem",
                background: "darkcyan",
              }}
              onClick={() => handleExportExcel()}
            >
              <img
                src={excelImg}
                alt=""
                style={{ height: "2.5rem", width: "2.5rem" }}
              />
              Xuất hoá đơn
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
