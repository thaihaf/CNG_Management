import {
  Button,
  Col,
  Form,
  message,
  Modal,
  Row,
  Select,
  Spin,
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
import {
  DetailsBar,
  ListProductImport,
} from "features/import-product/components";
import {
  createProductImport,
  ImportProductManagerPaths,
  updateListProductLv2,
  updateProductImport,
} from "features/import-product/importProduct";
import "./CreateProductImport.css";
import { getSuppliers } from "features/supplier-manager/supplierManager";

const { Option } = Select;
const { Title } = Typography;

export default function CreateImportProduct() {
  const { productsImport } = useSelector(
    (state) => state.importProduct
  );

  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();

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

    const pLostWarehouse = listProduct.find(
      (p) => !p.value.warehouse || p.value.warehouse.length === 0
    );
    if (pLostWarehouse) {
      message.warning(
        `Product ${pLostWarehouse.id}, with index of ${pLostWarehouse.index} need select warehouse`
      );
    } else {
      let importProductDetailDTOS = listProduct.map((p) => {
        const importProductDetailDTO = {
          ...p.value,
          status: 1,
          noteImport: "",
          importProductDetailWarehouseDTOList: [...p.value.warehouse],
        };
        return importProductDetailDTO;
      });

      let exportData = {
        licensePlates: value.licensePlates,
        supplierId: value.supplierId,
        employeeId: value.employeeId,
        importProductDetailDTOS: importProductDetailDTOS,
      };

      console.log("exportData", exportData);

      setIsLoading(true);
      dispatch(createProductImport(exportData))
        .then(unwrapResult)
        .then((res) => {
          console.log(res);
          setIsLoading(false);
          message.success("Create Product Import Successfully!");
          history.push(ImportProductManagerPaths.LIST_PRODUCT_IMPORT);
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err);
          message.error(err);
        });
    }
  };

  useEffect(() => {
    dispatch(getWarehouses());
  }, [dispatch]);

  return (
    <Spin spinning={isLoading}>
      <Form
        form={form}
        className="product"
        name="dynamic_form_nest_item"
        autoComplete="off"
        layout="vertical"
        onFinish={onFinish}
      >
        <div className="product-left">
          <div className="actions-group">
            <Title level={2}>Create Product Import</Title>

            <Select
              placeholder="search product by code"
              style={{
                minWidth: 200,
                width: 300,
                overflow: "visible",
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
          </div>

          <ListProductImport form={form} />
        </div>

        <DetailsBar form={form} />
      </Form>
    </Spin>
  );
}
