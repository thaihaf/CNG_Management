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
     UserOutlined,
} from "@ant-design/icons";
import {
     Avatar,
     Button,
     Divider,
     Form,
     Image,
     Input,
     message,
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
import {
     updateErrorProcess,
     createAccEmployee,
} from "features/employee-manager/employeeManager";
const { Title, Text } = Typography;

export default function EmployeeList() {
     const { listEmployees, totalElements, totalPages, size } = useSelector(
          (state) => state.employee
     );
     const history = useHistory();
     const location = useLocation();
     const dispatch = useDispatch();
     const [form] = Form.useForm();

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
               title: "Avatar",
               dataIndex: "avatar",
               key: "avatar",
               render: (s) => <Avatar size={50} icon={<UserOutlined />} />,
          },
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

     const onSubmitCreate = ({ rePassword, ...params }) => {
          dispatch(
               createAccEmployee({ data: { ...params, role: "ROLE_EMPLOYEE" } })
          )
               .then(unwrapResult)
               .then(({ data, status }) => {
                    if (data === true) {
                         form.resetFields();
                         message.success("Create account employee success!");
                    } else {
                         message.error(data.Error.message);
                    }
               })
               .catch((error) => {
                    console.log("err", error);
                    message.error("Username or password not correct");
                    // dispatch(updateErrorProcess(CODE_ERROR.ERROR_CREATE));
               });
     };

     return (
          <div className="employee-list">
               <div className="top">
                    <Title level={2}>Employee List</Title>
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
