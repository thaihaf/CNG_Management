import React, { useEffect, useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import {
  CaretUpOutlined,
  HighlightOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  notification,
  Select,
  Space,
  Spin,
  Steps,
  Switch,
  Typography,
  Upload,
} from "antd";

import { storage } from "firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

import "./ProductDetailsForm.css";
import { getMessage } from "helpers/util.helper";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";

import { getActiveCategories } from "features/category-manager/categoryManager";
import {
  getSupplierDetails,
  getSuppliers,
} from "features/supplier-manager/supplierManager";
import {
  createProduct,
  updateProduct,
  ProductManagerPaths,
  titleSizeList,
  abrasionResistanceList,
} from "features/product-manager/productManager";
import { useHistory } from "react-router-dom";

import newFileImg from "assets/icons/newFile.png";
import deleteFileImg from "assets/icons/deleteFile.png";
import uploadFileImg from "assets/icons/uploadFile.png";
import uploadImageImg from "assets/icons/uploadImage.png";
import resetFileImg from "assets/icons/resetFile.png";
import minusButtonImg from "assets/icons/minusButton.png";

import TableDetails from "../TableDetails/TableDetails";
import DetailsModal from "../DetailsModal/DetailsModal";

const { Title } = Typography;
const { Step } = Steps;

const ProductDetailsForm = ({ updateMode }) => {
  const { provinces } = useSelector((state) => state.provinces);
  const { listActiveCategories } = useSelector((state) => state.category);
  const { listSuppliers, dataDetails } = useSelector((state) => state.supplier);
  const { productDetails } = useSelector((state) => state.product);

  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [brand, setBrand] = useState();
  const [cateValues, setCateValues] = useState();
  const [categories, setCategories] = useState();
  const [supplier, setSupplier] = useState();

  const handleRemoveImageProduct = (image) => {
    setImageList(imageList.filter((e) => e.filePath !== image));
  };
  const handleBeforeUploadImage = async (file) => {
    setIsLoading(true);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          if (file == null) return;

          const imgRef = ref(storage, `images/${file.name + v4()}`);
          uploadBytes(imgRef, file).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
              setImageList([...imageList, { filePath: url }]);
              setIsLoading(false);
            });
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };
  const onFinish = (values) => {
    if (imageList.length === 0) {
      notification.success({
        message: "Chi tiết sản phầm",
        description: "Vui lòng chọn ít nhất một ảnh",
      });
    } else {
      setIsLoading(true);

      let titleSizeStr = values.titleSize.split("x");
      let squareMeterPerBox =
        (Number(titleSizeStr[0]) *
          Number(titleSizeStr[1]) *
          values.quantityBrick) /
        10000;

      if (updateMode) {
        let data = {
          ...values,
          id: values.id.toUpperCase(),
          categoryDTO: categories ? categories : initialValues.categoryDTO,
          supplierDTO: supplier ? supplier : initialValues.supplierDTO,
          brandId: brand ? brand : initialValues.brandId,
          listImage: imageList,
          status: values.status ? 1 : 0,
          squareMeterPerBox: squareMeterPerBox,
        };

        console.log(data);
        dispatch(
          updateProduct({
            id: values.id.toUpperCase(),
            data: data,
          })
        )
          .then(unwrapResult)
          .then((res) => {
            setIsLoading(false);
            notification.success({
              message: "Chi tiết sản phầm",
              description: "Cập nhật thông tin sản phẩm thành công!",
            });
          })
          .catch((error) => {
            console.log(error);
            setIsLoading(false);
            notification.error({
              message: "Chi tiết sản phầm",
              description: "Cập nhật thông tin sản phẩm thất bại!",
            });
          });
      } else {
        let data = {
          ...values,
          id: values.id.toUpperCase(),
          categoryDTO: categories,
          supplierDTO: supplier,
          brandId: brand,
          listImage: imageList,
          status: values.status ? 1 : 0,
          squareMeterPerBox: squareMeterPerBox,
        };

        console.log(data);
        dispatch(
          createProduct({
            data: data,
          })
        )
          .then(unwrapResult)
          .then((res) => {
            setIsLoading(false);
            history.push(ProductManagerPaths.PRODUCT_MANAGER);
            notification.success({
              message: "Tạo sản phầm",
              description: "Tạo sản phẩm thành công!",
            });
          })
          .catch((error) => {
            console.log(error);
            setIsLoading(false);
            notification.error({
              message: "Tạo sản phầm",
              description: "Tạo sản phẩm thất bại!",
            });
          });
      }
    }
  };

  const initialValues = updateMode ? productDetails : null;

  useEffect(() => {
    form.setFieldsValue(initialValues);
    setCateValues(initialValues?.categoryDTO?.map((c) => c.categoryName));
    setImageList(initialValues?.listImage ? initialValues?.listImage : []);

    dispatch(getActiveCategories());
    dispatch(getSuppliers());
  }, [dispatch, initialValues]);

  if (!initialValues && updateMode == true) {
    return <Spin spinning={isLoading} />;
  }

  return (
    <Spin spinning={isLoading}>
      <Form
        form={form}
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
        className="product"
        layout="vertical"
        initialValues={initialValues}
      >
        <div className="product-details">
          <div className="actions-group">
            <Title level={3} style={{ marginBottom: 0, marginRight: "auto" }}>
              {updateMode ? "Chi tiết sản phẩm" : "Tạo sản phẩm"}
            </Title>

            <Button
              type="primary"
              shape="round"
              size={"large"}
              htmlType="reset"
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
            >
              <img
                src={resetFileImg}
                alt=""
                style={{ height: "2.5rem", width: "2.5rem" }}
              />
              Đặt lại
            </Button>

            {updateMode && (
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
                  //    onClick={() => onDeleteProductExport()}
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
              >
                <img
                  src={newFileImg}
                  alt=""
                  style={{ height: "2.5rem", width: "2.5rem" }}
                />
                Tạo mới
              </Button>
            )}
          </div>

          <div className="details">
            <div className="list-images">
              <Image.PreviewGroup>
                {imageList?.map((image, index) => (
                  <div className="image-product" key={index}>
                    <Image src={image.filePath} />
                    <img
                      src={minusButtonImg}
                      alt=""
                      onClick={() => handleRemoveImageProduct(image.filePath)}
                      className="minusImg"
                      style={{ width: "3rem", height: "3rem" }}
                    />
                  </div>
                ))}
              </Image.PreviewGroup>
              <Form.Item>
                <Upload
                  listType="picture-card"
                  beforeUpload={handleBeforeUploadImage}
                  className="btnUploadImage"
                >
                  {imageList?.length < 6 && (
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        justifyContent: "center",
                        alignContent: "center",
                      }}
                    >
                      <img
                        src={uploadImageImg}
                        alt=""
                        style={{ width: "3rem", height: "3rem" }}
                      />
                      Thêm ảnh
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </div>

            <Steps direction="vertical" className="list-data">
              <Step
                title="Thông tin sản phẩm"
                status="finish"
                description={
                  <div className="group-data">
                    <Form.Item
                      label="Mã sản phẩm"
                      name="id"
                      rules={[
                        {
                          required: true,
                          message: getMessage(
                            CODE_ERROR.ERROR_REQUIRED,
                            MESSAGE_ERROR,
                            "Mã sản phẩm"
                          ),
                        },
                      ]}
                    >
                      <Input
                        style={{
                          textTransform: "uppercase",
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Tên sản phẩm"
                      name="productName"
                      rules={[
                        {
                          required: true,
                          message: getMessage(
                            CODE_ERROR.ERROR_REQUIRED,
                            MESSAGE_ERROR,
                            "Tên sản phẩm"
                          ),
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Màu"
                      name="color"
                      rules={[
                        {
                          required: true,
                          message: getMessage(
                            CODE_ERROR.ERROR_REQUIRED,
                            MESSAGE_ERROR,
                            "Màu"
                          ),
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Nơi sản xuất"
                      name="origin"
                      rules={[
                        {
                          required: true,
                          message: getMessage(
                            CODE_ERROR.ERROR_REQUIRED,
                            MESSAGE_ERROR,
                            "Nơi sản xuất"
                          ),
                        },
                      ]}
                    >
                      <Select allowClear showSearch>
                        {provinces?.map((p) => {
                          return (
                            <Select.Option value={p.name} key={p.code}>
                              {p.name}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="Nhà cung cấp"
                      name={["supplierDTO", "supplierName"]}
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
                    >
                      <Select
                        showSearch
                        allowClear
                        onChange={(value, option) => {
                          setIsLoading(true);
                          dispatch(getSupplierDetails(option.id))
                            .then(unwrapResult)
                            .then(() => {
                              setIsLoading(false);
                              setSupplier(option);
                            })
                            .catch((error) => {
                              console.log(error);
                              setIsLoading(false);
                              message.error("Check error in F12");
                            });
                        }}
                      >
                        {listSuppliers.map((s) => (
                          <Select.Option
                            value={s.supplierName}
                            key={s.id}
                            id={s.id}
                          >
                            {s.supplierName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="Nhãn hàng"
                      name={["brandDTO", "brandName"]}
                      rules={[
                        {
                          required: true,
                          message: getMessage(
                            CODE_ERROR.ERROR_REQUIRED,
                            MESSAGE_ERROR,
                            "Nhãn hàng"
                          ),
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        allowClear
                        onChange={(value, option) => {
                          setBrand(option.id);
                        }}
                      >
                        {dataDetails?.listBrand?.map((data) => {
                          return (
                            <Select.Option
                              value={data.brandName}
                              key={data.id}
                              id={data.id}
                            >
                              {data.brandName}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="Chức năng"
                      rules={[
                        {
                          required: true,
                          message: getMessage(
                            CODE_ERROR.ERROR_REQUIRED_SELECT,
                            MESSAGE_ERROR,
                            "Chức năng"
                          ),
                        },
                      ]}
                    >
                      <Select
                        mode="multiple"
                        maxTagCount="responsive"
                        value={cateValues}
                        allowClear
                        onChange={(value, option) => {
                          setCateValues(value);
                          setCategories(option);
                        }}
                      >
                        {listActiveCategories.map((c) => (
                          <Select.Option
                            value={c.categoryName}
                            key={c.id}
                            id={c.id}
                          >
                            {c.categoryName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      valuePropName="checked"
                      name="status"
                      label="Trạng thái hoạt động"
                    >
                      <Switch />
                    </Form.Item>
                  </div>
                }
              />

              <Step
                title="Thống kê sản phẩm"
                status="finish"
                description={
                  <div className="group-data">
                    <Form.Item
                      label="Kích thước"
                      name="titleSize"
                      rules={[
                        {
                          required: true,
                          message: getMessage(
                            CODE_ERROR.ERROR_REQUIRED,
                            MESSAGE_ERROR,
                            "Kích thước"
                          ),
                        },
                      ]}
                    >
                      <Select>
                        {titleSizeList.map((item) => (
                          <Select.Option value={item.value} key={item.text}>
                            {item.value}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="Bề mặt"
                      name="titleSurface"
                      rules={[
                        {
                          required: true,
                          message: getMessage(
                            CODE_ERROR.ERROR_REQUIRED,
                            MESSAGE_ERROR,
                            "Bề mặt"
                          ),
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Chất liệu gạch"
                      name="brickMaterial"
                      rules={[
                        {
                          required: true,
                          message: getMessage(
                            CODE_ERROR.ERROR_REQUIRED,
                            MESSAGE_ERROR,
                            "Chất liệu gạch"
                          ),
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Kết cấu gạch"
                      name="brickTexture"
                      rules={[
                        {
                          required: true,
                          message: getMessage(
                            CODE_ERROR.ERROR_REQUIRED,
                            MESSAGE_ERROR,
                            "Kết cấu gạch"
                          ),
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Lực bẻ cong"
                      name="bendingStrength"
                      rules={[
                        {
                          required: true,
                          message: getMessage(
                            CODE_ERROR.ERROR_REQUIRED,
                            MESSAGE_ERROR,
                            "Lực bẻ cong"
                          ),
                        },
                      ]}
                    >
                      <InputNumber />
                    </Form.Item>
                    <Form.Item
                      label="Hấp thụ nước"
                      name="waterAbsorption"
                      rules={[
                        {
                          required: true,
                          message: getMessage(
                            CODE_ERROR.ERROR_REQUIRED,
                            MESSAGE_ERROR,
                            "Hấp thụ nước"
                          ),
                        },
                      ]}
                    >
                      <InputNumber />
                    </Form.Item>
                    <Form.Item
                      label="Chịu mài mòn"
                      name="abrasionResistance"
                      rules={[
                        {
                          required: true,
                          message: getMessage(
                            CODE_ERROR.ERROR_REQUIRED,
                            MESSAGE_ERROR,
                            "Chịu mài mòn"
                          ),
                        },
                      ]}
                    >
                      <Select>
                        {abrasionResistanceList.map((item) => (
                          <Select.Option value={item.value} key={item.text}>
                            {item.value}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="Số lượng gạch"
                      name="quantityBrick"
                      rules={[
                        {
                          required: true,
                          message: getMessage(
                            CODE_ERROR.ERROR_REQUIRED,
                            MESSAGE_ERROR,
                            "Số lượng gạch"
                          ),
                        },
                      ]}
                    >
                      <InputNumber />
                    </Form.Item>
                  </div>
                }
              />

              {updateMode && (
                <Step
                  title={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <div>Lô hàng và loại sản phẩm</div>
                      <DetailsModal type={"create"} record={initialValues} />
                    </div>
                  }
                  status="finish"
                  description={<TableDetails form={form} />}
                />
              )}

              <Step title="" status="finish" />
            </Steps>
          </div>
        </div>
      </Form>
    </Spin>
  );
};

export default React.memo(ProductDetailsForm);
