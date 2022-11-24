import {
  Button,
  Form,
  message,
  Modal,
  Select,
  Spin,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getWarehouses } from "features/warehouse-manager/warehouseManager";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  searchProduct,
  searchProductBySupplier,
} from "features/product-manager/productManager";

import "./ExportWrapper.css";
import { getSuppliers } from "features/supplier-manager/supplierManager";

import totalCostImg from "assets/gif/purse.gif";

import { getMessage, getStatusString } from "helpers/util.helper";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import {
  CaretDownFilled,
  CaretUpFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import StatisticGroups from "../StatisticGroups/StatisticGroups";
import InsertProductTable from "../TableCreate/TableCreate";
import TableUpdate from "../TableUpdate/TableUpdate";
import TableCreate from "../TableCreate/TableCreate";
import {
  clearProductExport,
  createProductExport,
  deleteProductExport,
  ProductExportManagerPaths,
  updateProductExport,
  updateProductExports,
} from "features/export-product/exportProduct";

const { Option } = Select;

const ExportWrapper = ({ updateMode }) => {
  const { productsExport, productExportDetails } = useSelector(
    (state) => state.productExport
  );

  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();

  const [openHeader, setOpenHeader] = useState(updateMode);
  const [isLoading, setIsLoading] = useState(false);
  const [dataSearch, setDataSearch] = useState([]);
  const [searchProductVal, setSearchProductVal] = useState();

  let timeout;
  let currentValue;

  const fetch = (value, callback) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = value;

    const fake = () => {
      dispatch(searchProduct(value))
        .then(unwrapResult)
        .then((data) => {
          if (currentValue === value) {
            callback(data);
          }
        });
    };

    timeout = setTimeout(fake, 300);
  };
  const handleSearch = (newValue) => {
    if (newValue) {
      fetch(newValue, setDataSearch);
    } else {
      setDataSearch([]);
    }
  };
  const handleSelectChange = (newValue, option) => {
    message.success("Insert Product Export Success");

    setSearchProductVal(newValue);
    dispatch(
      updateProductExport([
        ...productsExport,
        { ...option.item, index: productsExport.length + 1 },
      ])
    );
  };

  const ondeleteProductExport = () => {
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
            message.error("Error deleting Product Export");
          });
      },
      onCancel: () => {},
    });
  };
  const onBeforeSubmit = () => {
    const listHeaderItemValue = form.getFieldsValue([
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
      setOpenHeader(false);
    } else {
      setOpenHeader(true);
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

        {/* <Title level={3}>Create Product Export</Title> */}
        <div className="actions-group">
          <Tooltip placement="topRight" title={"Show more input"}>
            {openHeader ? (
              <CaretUpFilled
                style={{
                  fontSize: "23px",
                  transition: "all 0.3s ease",
                }}
                onClick={(e) => setOpenHeader(false)}
              />
            ) : (
              <CaretDownFilled
                style={{
                  fontSize: "23px",
                  transition: "all 0.3s ease",
                }}
                onClick={(e) => setOpenHeader(true)}
              />
            )}
          </Tooltip>

          <Select
            placeholder="Search product"
            style={{
              minWidth: 200,
              width: 350,
              overflow: "visible",
              marginRight: "auto",
            }}
            showSearch
            allowClear
            optionLabelProp="label"
            filterOption={false}
            notFoundContent={null}
            defaultActiveFirstOption={false}
            value={searchProductVal}
            onSearch={handleSearch}
            onChange={handleSelectChange}
          >
            {dataSearch?.map((d) => {
              // let isDisabled = productsExport.find((p) => p.id === d.id);
              return (
                <Option
                  className="searchProduct"
                  value={`${d.id} - ${d.productName} - ${d.titleSize}`}
                  lable={`${d.id} - ${d.productName} - ${d.titleSize}`}
                  key={d.id}
                  item={d}
                  // disabled={isDisabled}
                >
                  <div className="search-img">
                    <img src={d.listImage[0].filePath} alt="" />
                  </div>
                  <div className="search-details">
                    <div className="search-name">
                      Name : {d.productName.toUpperCase()}
                    </div>
                    <div className="search-code">
                      {d.id} - {d.titleSize}
                    </div>
                    <div className="search-origin">Origin : {d.origin}</div>
                  </div>
                </Option>
              );
            })}
          </Select>

          {updateMode && (
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
                marginLeft: "auto",
              }}
              onClick={() => ondeleteProductExport()}
            >
              <img
                src={totalCostImg}
                alt=""
                style={{ height: "2.5rem", width: "2.5rem" }}
              />
              Delete
            </Button>
          )}
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
              src={totalCostImg}
              alt=""
              style={{ height: "2.5rem", width: "2.5rem" }}
            />
            {updateMode ? "Update" : "Create"}
          </Button>
        </div>

        {updateMode ? (
          <TableUpdate
            form={form}
            updateMode={updateMode}
            openHeader={openHeader}
          />
        ) : (
          <TableCreate
            form={form}
            updateMode={updateMode}
            openHeader={openHeader}
          />
        )}
      </Form>
    </Spin>
  );
};

export default React.memo(ExportWrapper);
