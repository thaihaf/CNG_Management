import { Form, message, Modal, notification, Select } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { searchProduct, searchProductBySupplier } from "features/product-manager/productManager";

import "./SearchProduct.css";
import {
  clearProductImport,
  updateDataSearch,
  updateProductImport,
} from "features/import-product/importProduct";
import { getMessage } from "helpers/util.helper";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";

const { Option } = Select;

const SearchProduct = ({ updateMode, form }) => {
  const { productsImport, dataSearch } = useSelector(
    (state) => state.productImport
  );
  const { listSuppliers } = useSelector((state) => state.supplier);

  const dispatch = useDispatch();

  const [searchProductVal, setSearchProductVal] = useState();
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  let timeout;
  let currentValue;

  const fetch = (value, supplier, callback) => {
    if (timeout) {
      setIsLoading(false);
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = value;

    const fake = () => {
      setIsLoading(true);
      dispatch(searchProductBySupplier({ code: value, supplierId: supplier }))
        .then(unwrapResult)
        .then((data) => {
          if (currentValue === value) {
            callback(data);
            dispatch(updateDataSearch(data));
          }
        });
    };

    timeout = setTimeout(fake, 300);
  };
  const handleSearch = (newValue) => {
    let supplier = form.getFieldValue("supplierId");

    if (supplier) {
      if (newValue) {
        fetch(newValue, supplier, updateDataSearch);
      } else {
        dispatch(updateDataSearch([]));
      }
    } else {
      notification.warning({
        message: "Nhập sản phẩm",
        description: "Vui lòng chọn Nhà cung cấp",
      });
    }
  };
  const handleSelectChange = (newValue, option) => {
    notification.success({
      message: "Đơn nhập",
      description: `Thêm sản phẩm thành công!`,
    });

    setSearchProductVal();
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
              "Nhà cung cấp"
            ),
          },
        ]}
        style={{
          marginRight: "2rem",
        }}
      >
        <Select
          showSearch
          placeholder="Nhà cung cấp"
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
          disabled={updateMode ? true : false}
          onDropdownVisibleChange={(value) => {
            let supplierId = form.getFieldValue("supplierId");

            if (
              value &&
              isFirstTime &&
              supplierId &&
              productsImport.length > 0
            ) {
              Modal.warn({
                title: "Nhập sản phẩm",
                content:
                  "Thay đổi Nhà cung cấp sẽ xoá tất cả sản phẩm đang nhập",
                onOk() {},
              });

              setIsFirstTime(false);
            }
          }}
          onChange={() => {
            if (productsImport.length > 0) {
              dispatch(clearProductImport());
              form.setFieldValue("searhcData");
            }
          }}
        >
          {listSuppliers.map(
            (item) =>
              item.status === 1 && (
                <Select.Option value={item.id} key={item.id}>
                  {item.supplierName}
                </Select.Option>
              )
          )}
        </Select>
      </Form.Item>

      <Form.Item name="searhcData" className="details__item">
        <Select
          placeholder="Tìm kiếm sản phẩm"
          style={{
            minWidth: 200,
            width: 350,
            overflow: "visible",
            marginRight: "auto",
          }}
          notFoundContent={null}
          loading={isLoading}
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
            return (
              <Option
                className="searchProduct"
                value={`${d.id} - ${d.productName} - ${d.titleSize}`}
                lable={`${d.id} - ${d.productName} - ${d.titleSize}`}
                key={d.id}
                item={d}
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
      </Form.Item>
    </>
  );
};

export default React.memo(SearchProduct);
