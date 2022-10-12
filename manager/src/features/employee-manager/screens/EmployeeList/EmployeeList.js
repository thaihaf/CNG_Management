import React, { useEffect, useRef, useState } from "react";
import queryString from "query-string";
import Highlighter from "react-highlight-words";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

import {
     DownloadOutlined,
     LockOutlined,
     SearchOutlined,
} from "@ant-design/icons";
import {
     Button,
     Form,
     Input,
     Modal,
     Space,
     Table,
     Tag,
     Typography,
} from "antd";
import {
     EmployeeManagerPaths,
     getEmployees,
} from "features/employee-manager/employeeManager";

import "./EmployeeList.css";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { getMessage } from "helpers/util.helper";

const { Title, Text } = Typography;

export default function EmployeeList() {
     const { listEmployees, totalElements, totalPages, size } = useSelector(
          (state) => state.employee
     );
     const history = useHistory();
     const location = useLocation();
     const dispatch = useDispatch();

     const [modal1Open, setModal1Open] = useState(false);
     const [isLoading, setIsLoading] = useState(false);
     const [searchText, setSearchText] = useState("");
     const [searchedColumn, setSearchedColumn] = useState("");
     const searchInput = useRef(null);

     useEffect(() => {
          const query = queryString.parse(location.search);
          setIsLoading(true);
          dispatch(getEmployees())
               .then(unwrapResult)
               .then(() => setIsLoading(false));
     }, [dispatch, location]);

     const handleSearch = (selectedKeys, confirm, dataIndex) => {
          confirm();
          setSearchText(selectedKeys[0]);
          setSearchedColumn(dataIndex);
     };

     const handleReset = (clearFilters) => {
          clearFilters();
          setSearchText("");
     };

     const getColumnSearchProps = (dataIndex) => ({
          filterDropdown: ({
               setSelectedKeys,
               selectedKeys,
               confirm,
               clearFilters,
          }) => (
               <div
                    style={{
                         padding: 8,
                    }}
               >
                    <Input
                         ref={searchInput}
                         placeholder={`Search ${dataIndex}`}
                         value={selectedKeys[0]}
                         onChange={(e) =>
                              setSelectedKeys(
                                   e.target.value ? [e.target.value] : []
                              )
                         }
                         onPressEnter={() =>
                              handleSearch(selectedKeys, confirm, dataIndex)
                         }
                         style={{
                              marginBottom: 8,
                              display: "block",
                         }}
                    />
                    <Space>
                         <Button
                              type="primary"
                              onClick={() =>
                                   handleSearch(
                                        selectedKeys,
                                        confirm,
                                        dataIndex
                                   )
                              }
                              icon={<SearchOutlined />}
                              size="small"
                              style={{
                                   width: 90,
                              }}
                         >
                              Search
                         </Button>
                         <Button
                              onClick={() =>
                                   clearFilters && handleReset(clearFilters)
                              }
                              size="small"
                              style={{
                                   width: 90,
                              }}
                         >
                              Reset
                         </Button>
                         <Button
                              type="link"
                              size="small"
                              onClick={() => {
                                   confirm({
                                        closeDropdown: false,
                                   });
                                   setSearchText(selectedKeys[0]);
                                   setSearchedColumn(dataIndex);
                              }}
                         >
                              Filter
                         </Button>
                    </Space>
               </div>
          ),
          filterIcon: (filtered) => (
               <SearchOutlined
                    style={{
                         color: filtered ? "#1890ff" : undefined,
                    }}
               />
          ),
          onFilter: (value, record) =>
               record[dataIndex]
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
          onFilterDropdownOpenChange: (visible) => {
               if (visible) {
                    setTimeout(() => searchInput.current?.select(), 100);
               }
          },
          render: (text) =>
               searchedColumn === dataIndex ? (
                    <Highlighter
                         highlightStyle={{
                              backgroundColor: "#ffc069",
                              padding: 0,
                         }}
                         searchWords={[searchText]}
                         autoEscape
                         textToHighlight={text ? text.toString() : ""}
                    />
               ) : (
                    text
               ),
     });

     const columns = [
          {
               title: "ID",
               dataIndex: "id",
               key: "id",
               sorter: (a, b) => a.id - b.id,
               sortDirections: ["descend", "ascend"],
               ...getColumnSearchProps("id"),
          },
          {
               title: "Firstname",
               dataIndex: "firstName",
               key: "firstName",
               sorter: (a, b) => a.firstName.length - b.firstName.length,
               sortDirections: ["descend", "ascend"],
               ...getColumnSearchProps("firstName"),
          },
          {
               title: "Lastname",
               dataIndex: "lastName",
               key: "lastName",
               sorter: (a, b) => a.lastName.length - b.lastName.length,
               sortDirections: ["descend", "ascend"],
               ...getColumnSearchProps("lastName"),
          },
          {
               title: "Gender",
               dataIndex: "gender",
               key: "gender",
               filters: [
                    {
                         text: "Male",
                         value: true,
                    },
                    {
                         text: "Female",
                         value: false,
                    },
               ],
               onFilter: (value, record) => record.gender == value,
               filterSearch: true,
               render: (s) => (s ? "Male" : "Female"),
               sorter: (a, b) => a.gender.length - b.gender.length,
               sortDirections: ["descend", "ascend"],
          },
          {
               title: "Phone",
               dataIndex: "phoneNumber",
               key: "phoneNumber",
               ...getColumnSearchProps("phoneNumber"),
          },
          {
               title: "Email",
               dataIndex: "email",
               key: "email",
               sorter: (a, b) => a.email.length - b.email.length,
               sortDirections: ["descend", "ascend"],
               ...getColumnSearchProps("email"),
          },
          {
               title: "Status",
               dataIndex: "status",
               key: "status",
               filters: [
                    {
                         text: "Active",
                         value: 1,
                    },
                    {
                         text: "In Active",
                         value: 0,
                    },
               ],
               onFilter: (value, record) => record.status === value,
               filterSearch: true,
               render: (s) => {
                    let color = s == 1 ? "green" : "volcano";
                    return s == 1 ? (
                         <Tag color={color} key={s}>
                              Active
                         </Tag>
                    ) : (
                         <Tag color={color} key={s}>
                              In Active
                         </Tag>
                    );
               },
               sorter: (a, b) => a.status - b.status,
               sortDirections: ["descend", "ascend"],
          },
          // {
          //      title: "Account",
          // 		 render: (s) => {reutrn<>View</>},
          //      key: "account",
          // },
     ];

     const onRowClick = (record) => {
          history.push(
               EmployeeManagerPaths.EMPLOYEE_DETAILS.replace(
                    ":employeeId",
                    record.id || ""
               )
          );
     };

     return (
          <div className="employee-list">
               <div className="top">
                    <Title level={2}>Employee List</Title>
                    <Button
                         type="primary"
                         shape={"round"}
                         size={"large"}
                         onClick={() => setModal1Open(true)}
                    >
                         Create New
                    </Button>

                    <Modal
                         title="Create New Employee"
                         style={{ top: 20 }}
                         open={modal1Open}
                         onOk={() => setModal1Open(false)}
                         onCancel={() => setModal1Open(false)}
                         footer={[
                              <Button
                                   key="back"
                                   shape={"round"}
                                   onClick={() => setModal1Open(false)}
                              >
                                   Cancel
                              </Button>,
                              <Button
                                   key="submit"
                                   shape={"round"}
                                   type="primary"
                                   //  loading={loading}
                                   onClick={() => setModal1Open(false)}
                              >
                                   Submit
                              </Button>,
                         ]}
                    >
                         <Form
                              // form={form}
                              labelCol={{
                                   span: 4,
                              }}
                              wrapperCol={{
                                   span: 14,
                              }}
                              layout="horizontal"
                              // onValuesChange={onFormLayoutChange}
                              name="form"
                              // initialValues={initialValues}
                              // onFinish={onFinish}
                              colon={false}
                         >
                              <div className="details__group">
                                   <Form.Item
                                        name="username"
                                        label={<Text>Username</Text>}
                                        className="details__item"
                                        rules={[
                                             {
                                                  required: true,
                                                  message: getMessage(
                                                       CODE_ERROR.ERROR_REQUIRED,
                                                       MESSAGE_ERROR,
                                                       "Password"
                                                  ),
                                             },
                                             {
                                                  max: 20,
                                                  message: getMessage(
                                                       CODE_ERROR.ERROR_NUMBER_MAX,
                                                       MESSAGE_ERROR,
                                                       "Password",
                                                       20
                                                  ),
                                             },
                                             {
                                                  min: 3,
                                                  message: getMessage(
                                                       CODE_ERROR.ERROR_NUMBER_MIN,
                                                       MESSAGE_ERROR,
                                                       "Password",
                                                       3
                                                  ),
                                             },
                                        ]}
                                   >
                                        <Input placeholder="username" />
                                   </Form.Item>
                                   <Form.Item
                                        name="email"
                                        label={<Text>Email</Text>}
                                        className="details__item"
                                        rules={[
                                             {
                                                  required: true,
                                                  message: getMessage(
                                                       CODE_ERROR.ERROR_REQUIRED,
                                                       MESSAGE_ERROR,
                                                       "Password"
                                                  ),
                                             },
                                             {
                                                  max: 20,
                                                  message: getMessage(
                                                       CODE_ERROR.ERROR_NUMBER_MAX,
                                                       MESSAGE_ERROR,
                                                       "Password",
                                                       20
                                                  ),
                                             },
                                             {
                                                  min: 3,
                                                  message: getMessage(
                                                       CODE_ERROR.ERROR_NUMBER_MIN,
                                                       MESSAGE_ERROR,
                                                       "Password",
                                                       3
                                                  ),
                                             },
                                        ]}
                                   >
                                        <Input placeholder="username" />
                                   </Form.Item>
                              </div>

                              <div className="details__group">
                                   <Form.Item
                                        name="password"
                                        label={<Text>Password</Text>}
                                        className="details__item"
                                        rules={[
                                             {
                                                  required: true,
                                                  message: getMessage(
                                                       CODE_ERROR.ERROR_REQUIRED,
                                                       MESSAGE_ERROR,
                                                       "Password"
                                                  ),
                                             },
                                             {
                                                  max: 20,
                                                  message: getMessage(
                                                       CODE_ERROR.ERROR_NUMBER_MAX,
                                                       MESSAGE_ERROR,
                                                       "Password",
                                                       20
                                                  ),
                                             },
                                             {
                                                  min: 3,
                                                  message: getMessage(
                                                       CODE_ERROR.ERROR_NUMBER_MIN,
                                                       MESSAGE_ERROR,
                                                       "Password",
                                                       3
                                                  ),
                                             },
                                        ]}
                                   >
                                        <Input.Password
                                             prefix={
                                                  <LockOutlined className="site-form-item-icon" />
                                             }
                                             type="password"
                                             placeholder="●●●●●●●●●"
                                             className="login_input"
                                        />
                                   </Form.Item>
                                   <Form.Item
                                        name="rePassword"
                                        label={<Text>Re-password</Text>}
                                        className="details__item"
                                        rules={[
                                             {
                                                  required: true,
                                                  message: getMessage(
                                                       CODE_ERROR.ERROR_REQUIRED,
                                                       MESSAGE_ERROR,
                                                       "Password"
                                                  ),
                                             },
                                             {
                                                  max: 20,
                                                  message: getMessage(
                                                       CODE_ERROR.ERROR_NUMBER_MAX,
                                                       MESSAGE_ERROR,
                                                       "Password",
                                                       20
                                                  ),
                                             },
                                             {
                                                  min: 3,
                                                  message: getMessage(
                                                       CODE_ERROR.ERROR_NUMBER_MIN,
                                                       MESSAGE_ERROR,
                                                       "Password",
                                                       3
                                                  ),
                                             },
                                        ]}
                                   >
                                        <Input.Password
                                             prefix={
                                                  <LockOutlined className="site-form-item-icon" />
                                             }
                                             type="password"
                                             placeholder="●●●●●●●●●"
                                             className="login_input"
                                        />
                                   </Form.Item>
                              </div>
                         </Form>
                    </Modal>
               </div>
               <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={listEmployees}
                    onRow={(record) => ({
                         onClick: () => {
                              onRowClick(record);
                         },
                    })}
                    pagination={
                         listEmployees.length !== 0
                              ? {
                                     showSizeChanger: true,
                                     position: ["bottomCenter"],
                                     size: "default",
                                     pageSize: 10,
                                     // current: getPageUrl || pageHead,
                                     totalElements,
                                     // onChange: (page, size) =>
                                     // 	onHandlePagination(page, size),
                                     pageSizeOptions: ["10", "15", "20", "25"],
                                }
                              : false
                    }
                    loading={isLoading}
               />
          </div>
     );
}
