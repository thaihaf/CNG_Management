import { Form, message, Select } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { searchProduct } from "features/product-manager/productManager";

// import "./SearchProduct.css";
import { updateProductImport } from "features/import-product/importProduct";
import { getMessage } from "helpers/util.helper";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";

const { Option } = Select;

const SearchProduct = () => {
  const { productsImport } = useSelector((state) => state.productImport);
  const { listSuppliers } = useSelector((state) => state.supplier);

  const dispatch = useDispatch();

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
    message.success("Insert Product Import Success");

    setSearchProductVal(newValue);
    dispatch(
      updateProductImport([
        ...productsImport,
        { ...option.item, index: productsImport.length + 1 },
      ])
    );
  };

  return (
    <>
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
        style={{
          width: 180,
          marginRight : "2rem"
        }}
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
            width: "100%",
          }}
        >
          {listSuppliers.map((item) => (
            <Select.Option value={item.id} key={item.id}>
              {item.supplierName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

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
    </>
  );
};

export default React.memo(SearchProduct);