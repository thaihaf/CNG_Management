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
		 abrasionResistanceList
} from "features/product-manager/productManager";
import { useHistory } from "react-router-dom";

const { Title } = Typography;
const { Step } = Steps;

const ProductDetailsForm = ({ updateMode }) => {
     const { provinces } = useSelector((state) => state.provinces);
     const { listActiveCategories } = useSelector((state) => state.category);
     const { listSuppliers, dataDetails } = useSelector(
          (state) => state.supplier
     );
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

                         const imgRef = ref(
                              storage,
                              `images/${file.name + v4()}`
                         );
                         uploadBytes(imgRef, file).then((snapshot) => {
                              getDownloadURL(snapshot.ref).then((url) => {
                                   setImageList([
                                        ...imageList,
                                        { filePath: url },
                                   ]);
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
               message.error("Please choose image product");
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
                         categoryDTO: categories
                              ? categories
                              : initialValues.categoryDTO,
                         supplierDTO: supplier
                              ? supplier
                              : initialValues.supplierDTO,
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
                              message.success("Update details success!");
                         })
                         .catch((error) => {
                              console.log(error);
                              setIsLoading(false);
                              message.error("Check error in F12");
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
                              message.success("Create details success!");
                         })
                         .catch((error) => {
                              console.log(error);
                              setIsLoading(false);
                              message.error("Check error in F12");
                         });
               }
          }
     };

     const initialValues = updateMode ? productDetails : null;

     useEffect(() => {
          form.setFieldsValue(initialValues);
          setCateValues(initialValues?.categoryDTO?.map((c) => c.categoryName));
          setImageList(
               initialValues?.listImage ? initialValues?.listImage : []
          );

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
                         <Title level={2} className="title">
                              {updateMode
                                   ? "Details Product"
                                   : "Create Product"}
                         </Title>

                         <div className="details">
                              <div className="list-images">
                                   <Image.PreviewGroup>
                                        {imageList?.map((image, index) => (
                                             <div
                                                  className="image-product"
                                                  key={index}
                                             >
                                                  <Image src={image.filePath} />
                                                  <MinusCircleOutlined
                                                       onClick={() =>
                                                            handleRemoveImageProduct(
                                                                 image.filePath
                                                            )
                                                       }
                                                  />
                                             </div>
                                        ))}
                                   </Image.PreviewGroup>
                                   <Form.Item>
                                        <Upload
                                             listType="picture-card"
                                             beforeUpload={
                                                  handleBeforeUploadImage
                                             }
                                             className="btnUploadImage"
                                        >
                                             {imageList?.length < 6 && (
                                                  <>
                                                       <UploadOutlined />
                                                       Add Image
                                                  </>
                                             )}
                                        </Upload>
                                   </Form.Item>
                              </div>

                              <Steps direction="vertical" className="list-data">
                                   <Step
                                        title="1"
                                        status="finish"
                                        description={
                                             <div className="group-data">
                                                  <Form.Item
                                                       label="Code"
                                                       name="id"
                                                       rules={[
                                                            {
                                                                 required: true,
                                                                 message: getMessage(
                                                                      CODE_ERROR.ERROR_REQUIRED,
                                                                      MESSAGE_ERROR,
                                                                      "Product Code"
                                                                 ),
                                                            },
                                                       ]}
                                                  >
                                                       <Input
                                                            style={{
                                                                 textTransform:
                                                                      "uppercase",
                                                            }}
                                                       />
                                                  </Form.Item>
                                                  <Form.Item
                                                       label="Name"
                                                       name="productName"
                                                       rules={[
                                                            {
                                                                 required: true,
                                                                 message: getMessage(
                                                                      CODE_ERROR.ERROR_REQUIRED,
                                                                      MESSAGE_ERROR,
                                                                      "Product Name"
                                                                 ),
                                                            },
                                                       ]}
                                                  >
                                                       <Input />
                                                  </Form.Item>
                                                  <Form.Item
                                                       label="Origin"
                                                       name="origin"
                                                       rules={[
                                                            {
                                                                 required: true,
                                                                 message: getMessage(
                                                                      CODE_ERROR.ERROR_REQUIRED,
                                                                      MESSAGE_ERROR,
                                                                      "Product Origin"
                                                                 ),
                                                            },
                                                       ]}
                                                  >
                                                       <Select
                                                            allowClear
                                                            showSearch
                                                       >
                                                            {provinces?.map(
                                                                 (p) => {
                                                                      return (
                                                                           <Select.Option
                                                                                value={
                                                                                     p.name
                                                                                }
                                                                                key={
                                                                                     p.code
                                                                                }
                                                                           >
                                                                                {
                                                                                     p.name
                                                                                }
                                                                           </Select.Option>
                                                                      );
                                                                 }
                                                            )}
                                                       </Select>
                                                  </Form.Item>
                                                  <Form.Item
                                                       label="Quantity Brick"
                                                       name="quantityBrick"
                                                       rules={[
                                                            {
                                                                 required: true,
                                                                 message: getMessage(
                                                                      CODE_ERROR.ERROR_REQUIRED,
                                                                      MESSAGE_ERROR,
                                                                      "Quantity Brick"
                                                                 ),
                                                            },
                                                       ]}
                                                  >
                                                       <InputNumber />
                                                  </Form.Item>
                                             </div>
                                        }
                                   />

                                   <Step
                                        title="2"
                                        status="finish"
                                        description={
                                             <div className="group-data">
                                                  <Form.Item
                                                       label="Title Surface"
                                                       name="titleSurface"
                                                       rules={[
                                                            {
                                                                 required: true,
                                                                 message: getMessage(
                                                                      CODE_ERROR.ERROR_REQUIRED,
                                                                      MESSAGE_ERROR,
                                                                      "Title Surface"
                                                                 ),
                                                            },
                                                       ]}
                                                  >
                                                       <Input />
                                                  </Form.Item>
                                                  <Form.Item
                                                       label="Brick Material"
                                                       name="brickMaterial"
                                                       rules={[
                                                            {
                                                                 required: true,
                                                                 message: getMessage(
                                                                      CODE_ERROR.ERROR_REQUIRED,
                                                                      MESSAGE_ERROR,
                                                                      "Brick Material"
                                                                 ),
                                                            },
                                                       ]}
                                                  >
                                                       <Input />
                                                  </Form.Item>
                                             </div>
                                        }
                                   />

                                   <Step
                                        title="3"
                                        status="finish"
                                        description={
                                             <div className="group-data">
                                                  <Form.Item
                                                       label="Supplier"
                                                       name={[
                                                            "supplierDTO",
                                                            "supplierName",
                                                       ]}
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
                                                            onChange={(
                                                                 value,
                                                                 option
                                                            ) => {
                                                                 setIsLoading(
                                                                      true
                                                                 );
                                                                 dispatch(
                                                                      getSupplierDetails(
                                                                           option.id
                                                                      )
                                                                 )
                                                                      .then(
                                                                           unwrapResult
                                                                      )
                                                                      .then(
                                                                           () => {
                                                                                setIsLoading(
                                                                                     false
                                                                                );
                                                                                setSupplier(
                                                                                     option
                                                                                );
                                                                           }
                                                                      )
                                                                      .catch(
                                                                           (
                                                                                error
                                                                           ) => {
                                                                                console.log(
                                                                                     error
                                                                                );
                                                                                setIsLoading(
                                                                                     false
                                                                                );
                                                                                message.error(
                                                                                     "Check error in F12"
                                                                                );
                                                                           }
                                                                      );
                                                            }}
                                                       >
                                                            {listSuppliers.map(
                                                                 (s) => (
                                                                      <Select.Option
                                                                           value={
                                                                                s.supplierName
                                                                           }
                                                                           key={
                                                                                s.id
                                                                           }
                                                                           id={
                                                                                s.id
                                                                           }
                                                                      >
                                                                           {
                                                                                s.supplierName
                                                                           }
                                                                      </Select.Option>
                                                                 )
                                                            )}
                                                       </Select>
                                                  </Form.Item>
                                                  <Form.Item
                                                       label="Brand"
                                                       name={[
                                                            "brandDTO",
                                                            "brandName",
                                                       ]}
                                                       rules={[
                                                            {
                                                                 required: true,
                                                                 message: getMessage(
                                                                      CODE_ERROR.ERROR_REQUIRED,
                                                                      MESSAGE_ERROR,
                                                                      "Brand"
                                                                 ),
                                                            },
                                                       ]}
                                                  >
                                                       <Select
                                                            showSearch
                                                            allowClear
                                                            onChange={(
                                                                 value,
                                                                 option
                                                            ) => {
                                                                 setBrand(
                                                                      option.id
                                                                 );
                                                            }}
                                                       >
                                                            {dataDetails?.listBrand?.map(
                                                                 (data) => {
                                                                      return (
                                                                           <Select.Option
                                                                                value={
                                                                                     data.brandName
                                                                                }
                                                                                key={
                                                                                     data.id
                                                                                }
                                                                                id={
                                                                                     data.id
                                                                                }
                                                                           >
                                                                                {
                                                                                     data.brandName
                                                                                }
                                                                           </Select.Option>
                                                                      );
                                                                 }
                                                            )}
                                                       </Select>
                                                  </Form.Item>
                                                  <Form.Item
                                                       label="Categories"
                                                       rules={[
                                                            {
                                                                 required: true,
                                                                 message: getMessage(
                                                                      CODE_ERROR.ERROR_REQUIRED,
                                                                      MESSAGE_ERROR,
                                                                      "Product Category"
                                                                 ),
                                                            },
                                                       ]}
                                                  >
                                                       <Select
                                                            mode="multiple"
                                                            maxTagCount="responsive"
                                                            value={cateValues}
                                                            allowClear
                                                            onChange={(
                                                                 value,
                                                                 option
                                                            ) => {
                                                                 setCateValues(
                                                                      value
                                                                 );
                                                                 setCategories(
                                                                      option
                                                                 );
                                                            }}
                                                       >
                                                            {listActiveCategories.map(
                                                                 (c) => (
                                                                      <Select.Option
                                                                           value={
                                                                                c.categoryName
                                                                           }
                                                                           key={
                                                                                c.id
                                                                           }
                                                                           id={
                                                                                c.id
                                                                           }
                                                                      >
                                                                           {
                                                                                c.categoryName
                                                                           }
                                                                      </Select.Option>
                                                                 )
                                                            )}
                                                       </Select>
                                                  </Form.Item>
                                             </div>
                                        }
                                   />

                                   <Step
                                        title="4"
                                        status="finish"
                                        description={
                                             <div className="group-data">
                                                  <Form.Item
                                                       label="Brick Texture"
                                                       name="brickTexture"
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
                                                       <Input />
                                                  </Form.Item>
                                                  <Form.Item
                                                       label="Title Size"
                                                       name="titleSize"
                                                       rules={[
                                                            {
                                                                 required: true,
                                                                 message: getMessage(
                                                                      CODE_ERROR.ERROR_REQUIRED,
                                                                      MESSAGE_ERROR,
                                                                      "Title Size"
                                                                 ),
                                                            },
                                                       ]}
                                                  >
                                                       <Select>
                                                            {titleSizeList.map(
                                                                 (item) => (
                                                                      <Select.Option
                                                                           value={
                                                                                item.value
                                                                           }
                                                                           key={
                                                                                item.text
                                                                           }
                                                                      >
                                                                           {
                                                                                item.value
                                                                           }
                                                                      </Select.Option>
                                                                 )
                                                            )}
                                                       </Select>
                                                  </Form.Item>
                                             </div>
                                        }
                                   />

                                   <Step
                                        title="5"
                                        status="finish"
                                        description={
                                             <div className="group-data">
                                                  <Form.Item
                                                       label="Bending Strength"
                                                       name="bendingStrength"
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
                                                       <InputNumber />
                                                  </Form.Item>
                                                  <Form.Item
                                                       label="Water Absorption"
                                                       name="waterAbsorption"
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
                                                       <InputNumber />
                                                  </Form.Item>
                                                  <Form.Item
                                                       label="Abrasion Resistance"
                                                       name="abrasionResistance"
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
                                                       <Select>
                                                            {abrasionResistanceList.map(
                                                                 (item) => (
                                                                      <Select.Option
                                                                           value={
                                                                                item.value
                                                                           }
                                                                           key={
                                                                                item.text
                                                                           }
                                                                      >
                                                                           {
                                                                                item.value
                                                                           }
                                                                      </Select.Option>
                                                                 )
                                                            )}
                                                       </Select>
                                                  </Form.Item>
                                             </div>
                                        }
                                   />

                                   <Step
                                        title="6"
                                        status="finish"
                                        description={
                                             <div className="group-data">
                                                  <Form.Item
                                                       valuePropName="checked"
                                                       name="status"
                                                       label="Active Status"
                                                  >
                                                       <Switch />
                                                  </Form.Item>
                                             </div>
                                        }
                                   />
                              </Steps>
                         </div>
                    </div>

                    {/* <div className="product-descriptions">
                         <Title level={3} className="title">
                              Product Descriptions
                         </Title>

                         <Form.List name="list-descriptions">
                              {(fields, { add, remove }) => (
                                   <>
                                        {fields.map((field) => {
                                             console.log(field);
                                             return (
                                                  <Space
                                                       key={field.key}
                                                       align="baseline"
                                                       style={{ width: "100%" }}
                                                  >
                                                       <MinusCircleOutlined
                                                            className="minus-icon"
                                                            style={{
                                                                 padding: "2rem",
                                                            }}
                                                            onClick={() =>
                                                                 remove(
                                                                      field.name
                                                                 )
                                                            }
                                                       />

                                                       <Form.Item
                                                            {...field}
                                                            label="Title"
                                                            name={[
                                                                 field.name,
                                                                 "title",
                                                            ]}
                                                            rules={[
                                                                 {
                                                                      required: true,
                                                                      message: "Missing Title",
                                                                 },
                                                            ]}
                                                       >
                                                            <Input />
                                                       </Form.Item>
                                                       <Form.Item
                                                            {...field}
                                                            label="Descriptions"
                                                            name={[
                                                                 field.name,
                                                                 "descriptions",
                                                            ]}
                                                            rules={[
                                                                 {
                                                                      required: true,
                                                                      message: "Missing descriptions",
                                                                 },
                                                            ]}
                                                       >
                                                            <TextArea
                                                                 rows={4}
                                                            />
                                                       </Form.Item>
                                                       <Form.Item
                                                            {...field}
                                                            label="Image"
                                                            name={[
                                                                 field.name,
                                                                 "image",
                                                            ]}
                                                            rules={[
                                                                 {
                                                                      required: true,
                                                                      message: "Missing image",
                                                                 },
                                                            ]}
                                                       >
                                                            <Input />
                                                       </Form.Item>
                                                  </Space>
                                             );
                                        })}

                                        <Form.Item>
                                             <Button
                                                  type="dashed"
                                                  onClick={() => add()}
                                                  block
                                                  icon={<PlusOutlined />}
                                             >
                                                  Add More Descriptions
                                             </Button>
                                        </Form.Item>
                                   </>
                              )}
                         </Form.List>
                    </div> */}

                    <div className="product-btn-groups">
                         <Form.Item className="details__item">
                              <Button
                                   type="primary"
                                   shape="round"
                                   icon={<CaretUpOutlined />}
                                   size={"large"}
                                   htmlType="submit"
                                   style={{
                                        width: "100%",
                                        height: "45px",
                                   }}
                              >
                                   {updateMode ? "Update" : "Create"}
                              </Button>
                         </Form.Item>
                         <Form.Item className="details__item">
                              <Button
                                   type="primary"
                                   shape="round"
                                   icon={<HighlightOutlined />}
                                   size={"large"}
                                   htmlType="reset"
                                   style={{
                                        width: "100%",
                                        height: "45px",
                                   }}
                              >
                                   Reset
                              </Button>
                         </Form.Item>
                    </div>
               </Form>
          </Spin>
     );
};

export default React.memo(ProductDetailsForm);