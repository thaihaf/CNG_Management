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
import { searchProductBySupplier } from "features/product-manager/productManager";

import {
  clearProductImport,
  createProductImport,
  deleteProductImport,
  ImportProductManagerPaths,
  updateProductImport,
  updateProductImports,
} from "features/import-product/importProduct";
import "./ImportWrapper.css";
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
import { statusProductImport } from "features/import-product/constants/import-product.constants";

const { Option } = Select;

const ImportWrapper = ({ updateMode }) => {
  const { productsImport, productImportDetails } = useSelector(
    (state) => state.productImport
  );
  const { listSuppliers } = useSelector((state) => state.supplier);

  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();

  const [openHeader, setOpenHeader] = useState(updateMode);
  const [isLoading, setIsLoading] = useState(false);
  const [dataSearch, setDataSearch] = useState([]);
  const [searchProductVal, setSearchProductVal] = useState();

  let timeout;
  let currentValue;

  const fetch = (value, supplierId, callback) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = value;

    const fake = () => {
      dispatch(searchProductBySupplier({ code: value, supplierId: supplierId }))
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
    let supplierId = form.getFieldValue("supplierId");

    if (supplierId) {
      if (newValue) {
        fetch(newValue, supplierId, setDataSearch);
      } else {
        setDataSearch([]);
      }
    } else {
      message.warn("Please choose Supplier first!");
    }
  };
  const handleSelectChange = (newValue, option) => {
    message.success("Insert Product Import Success");

    setSearchProductVal(newValue);
    dispatch(
      updateProductImport([
        ...productsImport,
        { ...option.item, index: productsImport.length },
      ])
    );
  };

  const onDeleteProductImport = () => {
    Modal.confirm({
      title: "Delete Product Import",
      icon: <ExclamationCircleOutlined />,
      content:
        "Are you really want to Delete Product Import? Action can't revert, scarefully",
      okText: "Delete",
      cancelText: "Cancel",
      onOk: () => {
        setIsLoading(true);
        dispatch(deleteProductImport(productImportDetails.id))
          .then(unwrapResult)
          .then((res) => {
            dispatch(clearProductImport());
            history.push(ImportProductManagerPaths.LIST_PRODUCT_IMPORT);
            message.success("Delete Product Import successfully");
            setIsLoading(false);
          })
          .catch((err) => {
            console.log(err);
            message.error("Error deleting Product Import");
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
      setOpenHeader(false);
    } else {
      setOpenHeader(true);
    }
  };
  const onFinish = (value) => {
    console.log(value);
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

    console.log(listProduct);

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

    console.log(exportData);
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
        console.log(res);
        setIsLoading(false);
        message.success(
          `${updateMode ? "Update" : "Create"} Product Import Successfully!`
        );
        history.push(ImportProductManagerPaths.LIST_PRODUCT_IMPORT);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
        message.error(err);
      });
  };

  const initialValues = updateMode ? productImportDetails : null;

  useEffect(() => {
    form.setFieldValue(initialValues);

    if (initialValues) {
      form.setFieldValue("statusImport", getStatusString(initialValues.status));
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

        {/* <Title level={3}>Create Product Import</Title> */}
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

          <Form.Item
            name="supplierId"
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
              placeholder="Select supplier first"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children ?? "").includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.children ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.children ?? "").toLowerCase())
              }
              style={{
                width: 180,
              }}
              // onChange={() =>
              //   form.getFieldValue("supplierId") &&
              //   productsImport.length > 0 &&
              //   info()
              // }
            >
              {/* let supplierId = form.getFieldValue("supplierId");

                  console.log(supplierId);
                  if (supplierId && productsImport.length > 0) {
                    info();
                  } */}
              {listSuppliers.map((item) => (
                <Select.Option value={item.id} key={item.id}>
                  {item.supplierName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Select
            placeholder="Search product by code"
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
              // let isDisabled = productsImport.find((p) => p.id === d.id);
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
              onClick={() => onDeleteProductImport()}
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

export default React.memo(ImportWrapper);
