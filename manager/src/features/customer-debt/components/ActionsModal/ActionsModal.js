import { BarcodeOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Spin, Tabs, Tooltip, Typography } from "antd";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { getMessage } from "helpers/util.helper";
import React, { useState } from "react";

const { Title, Text } = Typography;

export default function ActionsModal() {
     const [productForm] = Form.useForm();

     const [modal1Open, setModal1Open] = useState(false);
     const [isLoadingModal, setIsLoadingModal] = useState(false);

     return (
          <>
               <Tooltip placement="topLeft" title={"Click to show Actions Modal"}>
                    <Title level={2} style={{cursor : "pointer"}} onClick={() => setModal1Open(true)}>
                         Product List
                    </Title>
               </Tooltip>

               <Modal
                    title="Product Action"
                    style={{ top: 20 }}
                    open={modal1Open}
                    onOk={() => setModal1Open(false)}
                    onCancel={() => setModal1Open(false)}
                    footer={[]}
                    width={1000}
                    className="modalSetting"
               >
                    <Spin spinning={isLoadingModal}>
                         <Tabs
                              //  defaultActiveKey="2"
                              items={[
                                   {
                                        label: (
                                             <span>
                                                  <BarcodeOutlined />
                                                  Import Product
                                             </span>
                                        ),
                                        key: "import-product",
                                        children: (
                                             <Form
                                                  form={productForm}
                                                  labelCol={{
                                                       span: 4,
                                                  }}
                                                  wrapperCol={{
                                                       span: 14,
                                                  }}
                                                  layout="horizontal"
                                                  name="changePassForm"
                                                  id="changePassForm"
                                                  colon={false}
                                                  // onFinish={
                                                  //      handleChangePassword
                                                  // }
                                             >
                                             </Form>
                                        ),
                                   },
                                   {
                                        label: (
                                             <span>
                                                  <SettingOutlined />
                                                  Export Product
                                             </span>
                                        ),
                                        key: "export-product",
                                        children: `Content of Tab Pane 2`,
                                   },
                              ]}
                         />
                    </Spin>
               </Modal>
          </>
     );
}
