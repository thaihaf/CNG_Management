import React, { useEffect, useState } from "react";
import {
     CameraOutlined,
     CaretUpOutlined,
     HighlightOutlined,
     MinusCircleOutlined,
     PlusOutlined,
     UploadOutlined,
} from "@ant-design/icons";
import {
     Button,
     Cascader,
     Checkbox,
     DatePicker,
     Form,
     Image,
     Input,
     InputNumber,
     Radio,
     Select,
     Space,
     Spin,
     Steps,
     Switch,
     TreeSelect,
     Typography,
     Upload,
} from "antd";
import ImgCrop from "antd-img-crop";

import { storage } from "firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

import "./CreateProduct.css";
import { useDispatch, useSelector } from "react-redux";
import { getMessage } from "helpers/util.helper";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { Step } = Steps;

export default function CreateProduct() {
     const { provinces } = useSelector((state) => state.provinces);

     const dispatch = useDispatch();
     const [form] = Form.useForm();

     const [isLoading, setIsLoading] = useState(false);
     const [imageList, setImageList] = useState([]);

     const handleRemoveImageProduct = (image) => {
          setImageList(imageList.filter((e) => e !== image));
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
                                   setIsLoading(false);
                                   setImageList([...imageList, url]);
                              });
                         });
                    }
               };
               reader.readAsDataURL(file);
          });
     };
     const onFinish = (values) => {
          console.log("Received values of form:", values);
     };

     useEffect(() => {}, [dispatch]);

     return (
          <Spin spinning={isLoading}>
               <Form
                    form={form}
                    name="dynamic_form_nest_item"
                    onFinish={onFinish}
                    autoComplete="off"
                    className="product"
                    layout="vertical"
               >
                    <div className="product-details">
                         <Title level={2} className="title">
                              Create Product
                         </Title>

                         <div className="details">
                              <div className="list-images">
                                   <Image.PreviewGroup>
                                        {imageList?.map((image, index) => (
                                             <div
                                                  className="image-product"
                                                  key={index}
                                             >
                                                  <Image src={image} />
                                                  <MinusCircleOutlined
                                                       onClick={() =>
                                                            handleRemoveImageProduct(
                                                                 image
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
                                             {imageList.length < 6 && (
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
                                                            labelInValue
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
                                                                                {`${p.name}`}
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
                                                       label="Category"
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
                                                       <Select>
                                                            <Select.Option value="demo">
                                                                 Demo
                                                            </Select.Option>
                                                       </Select>
                                                  </Form.Item>
                                                  <Form.Item
                                                       label="Supplier"
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
                                                            <Select.Option value="demo">
                                                                 Demo
                                                            </Select.Option>
                                                       </Select>
                                                  </Form.Item>
                                                  <Form.Item
                                                       label="Brand"
																											 name="brandId"
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
                                                       <Select>
                                                            <Select.Option value="demo">
                                                                 Demo
                                                            </Select.Option>
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
                                                  <Form.Item label="Brick Texture" name="brickTexture">
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
                                                            <Select.Option value="20x20">
                                                                 20x20
                                                            </Select.Option>
                                                            <Select.Option value="30x30">
                                                                 30x30
                                                            </Select.Option>
                                                            <Select.Option value="50x50">
                                                                 50x50
                                                            </Select.Option>
                                                            <Select.Option value="60x60">
                                                                 60x60
                                                            </Select.Option>
                                                            <Select.Option value="60x80">
                                                                 60x80
                                                            </Select.Option>
                                                            <Select.Option value="80x80">
                                                                 80x80
                                                            </Select.Option>
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
                                                  <Form.Item label="Bending Strength" name="bendingStrength">
                                                       <Input />
                                                  </Form.Item>
                                                  <Form.Item label="Water Absorption" name="waterAbsorption">
                                                       <Input />
                                                  </Form.Item>
                                                  <Form.Item label="Abrasion Resistance" name="abrasionResistance">
                                                       <Input />
                                                  </Form.Item>
                                             </div>
                                        }
                                   />

                                   <Step
                                        title="6"
                                        status="finish"
                                        description={
                                             <div className="group-data">
                                                  <Form.Item valuePropName="checked">
                                                       <Switch />
                                                  </Form.Item>
                                             </div>
                                        }
                                   />
                              </Steps>
                         </div>
                    </div>

                    <div className="product-descriptions">
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
                    </div>

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
                                   {/* {createMode ? "Create" : "Update"} */}
                                   Submit
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
}
