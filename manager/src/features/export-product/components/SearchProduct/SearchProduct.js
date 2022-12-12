import { message, notification, Select } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { searchProduct } from "features/product-manager/productManager";

// import "./SearchProduct.css";
import { updateProductExport } from "features/export-product/exportProduct";

const { Option } = Select;

const SearchProduct = () => {
  const { productsExport } = useSelector((state) => state.productExport);

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
    notification.success({
      message: "Đơn xuất",
      description: `Thêm sản phẩm thành công!`,
    });

    setSearchProductVal(newValue);
    dispatch(
      updateProductExport([
        ...productsExport,
        { ...option.item, index: productsExport.length + 1 },
      ])
    );
  };

  return (
    <Select
      placeholder="Tìm kiếm sản phẩm"
      style={{
        minWidth: 200,
        width: 350,
        overflow: "visible",
        marginRight: "auto",
      }}
      showSearch
      optionLabelProp="label"
      filterOption={false}
      showArrow={false}
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
                Tên : {d.productName.toUpperCase()}
              </div>
              <div className="search-code">
                {d.id} - {d.titleSize}
              </div>
              <div className="search-origin">Suất xứ : {d.origin}</div>
            </div>
          </Option>
        );
      })}
    </Select>
  );
};

export default React.memo(SearchProduct);
