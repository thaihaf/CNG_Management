import React, { useEffect, useRef, useState } from "react";
import queryString from "query-string";
import Highlighter from "react-highlight-words";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import {
  CameraOutlined,
  DownloadOutlined,
  LockOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Switch,
  Space,
  Table,
  Tag,
  Typography,
  Dropdown,
  Menu,
  Upload,
} from "antd";
import {
  SupplierManagerPaths,
  getSuppliers,
} from "features/supplier-manager/supplierManager";

import "./SupplierList.css";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { getMessage } from "helpers/util.helper";
import {
  updateErrorProcess,
  createSupplier,
  createDetails,
} from "features/supplier-manager/supplierManager";
import { ClassSharp } from "@mui/icons-material";
const { Title, Text } = Typography;

export default function SupplierList() {
  const { listSuppliers, totalElements, totalPages, size } = useSelector(
    (state) => state.supplier
  );
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [componentDisabled, setComponentDisabled] = useState(true);
  const [modal1Open, setModal1Open] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  useEffect(() => {
    const query = queryString.parse(location.search);
    setIsLoading(true);
    dispatch(getSuppliers())
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
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
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
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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

  const menu = (
    <Menu
      selectable
      //   defaultSelectedKeys={['3']}
      items={[
        {
          key: "1",
          label: "View",
        },
        {
          key: "2",
          label: "Edit",
        },
        {
          key: "3",
          label: "Delete",
        },
      ]}
    />
  );

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatarSupplier",
      key: "avatarSupplier",
      width: "10%",
      ...getColumnSearchProps("avatarSupplier"),
      render: (text, record) => {
        return (
          <div>
            <Avatar src={record.avatarSupplier} />
          </div>
        );
      },
    },
    {
      title: "Supplier Name",
      dataIndex: "supplierName",
      key: "supplierName",
      width: "20%",
      ...getColumnSearchProps("supplierName"),
      sorter: (a, b) => a.supplierName - b.supplierName,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "First Contact Name",
      dataIndex: "firstContactName",
      key: "firstContactName",
      width: "20%",
      ...getColumnSearchProps("firstContactName"),
      sorter: (a, b) => a.firstContactName.length - b.firstContactName.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Last Contact Name",
      dataIndex: "lastContactName",
      key: "lastContactName",
      width: "20%",
      ...getColumnSearchProps("lastContactName"),
      sorter: (a, b) => a.lastContactName.length - b.lastContactName.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Phone Number Contact",
      dataIndex: "phoneNumberContact",
      key: "phoneNumberContact",
      width: "20%",
      ...getColumnSearchProps("phoneNumberContact"),
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
        let color = s === 1 ? "green" : "volcano";
        return s === 1 ? (
          <Tag color={color} key={s}>
            Approved
          </Tag>
        ) : (
          <Tag color={color} key={s}>
            Pending
          </Tag>
        );
      },
      width: "20%",
      sorter: (a, b) => a.status - b.status,
      sortDirections: ["descend", "ascend"],
    },
    {
      render: () => (
        <Space size="middle">
          <Dropdown overlay={menu}>
            <a>
              Action <DownOutlined />
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const onRowClick = (record) => {
    history.push(
      SupplierManagerPaths.SUPPLIER_DETAIL.replace(
        ":supplierId",
        record.id || ""
      )
    );
    console.log(record.id);
  };

  const onSubmitCreate = async ({ ...args }) => {
    dispatch(
      createDetails({
        data: {
          ...args,
          status: 1,
        },
      })
    )
      .then(unwrapResult)
      .then((res) => {
        console.log(res);
        message.success("Create details success!");
      })
      .catch((error) => {
        console.log(error);
        console.log(args);
        message.error("Username or password not correct");
        //  dispatch(updateError(CODE_ERROR.ERROR_LOGIN));
      });
  };

  return (
    <div className="employee-list">
      <div className="top">
        <Title level={2}>Supplier List</Title>
        <Button
          type="primary"
          shape={"round"}
          size={"large"}
          onClick={() => setModal1Open(true)}
        >
          Create Supplier
        </Button>

        <Modal
          title="Create New Supplier"
          style={{ top: 20 }}
          open={modal1Open}
          onOk={() => setModal1Open(false)}
          onCancel={() => setModal1Open(false)}
          footer={[]}
        >
          <Form
            form={form}
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 14,
            }}
            layout="horizontal"
            name="form"
            colon={false}
            onFinish={onSubmitCreate}
          >
            <div className="details__group">
              <Avatar src="http://static1.squarespace.com/static/55c7a3e2e4b0fa365689d8aa/55e0aceae4b0643202e59629/55e322ade4b077beb0266329/1590769127854/?format=1500w" />
              <Form.Item
                name="avatarSupplier"
                label={<Text>Avatar Supplier</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "avatarSupplier"
                    ),
                  },
                ]}
              >
                <Input placeholder="Image Address" />
              </Form.Item>
            </div>
            <div className="details__group">
              <Form.Item
                name="firstContactName"
                label={<Text>First Contact Name</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "firstContactName"
                    ),
                  },
                  {
                    max: 25,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "firstContactName",
                      25
                    ),
                  },
                  {
                    min: 8,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "firstContactName",
                      8
                    ),
                  },
                ]}
              >
                <Input placeholder="FirstContactName" />
              </Form.Item>

              <Form.Item
                name="lastContactName"
                label={<Text>Last Contact Name</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "lastContactName"
                    ),
                  },
                  {
                    max: 25,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "lastContactName",
                      25
                    ),
                  },
                  {
                    min: 8,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "lastContactName",
                      8
                    ),
                  },
                ]}
              >
                <Input placeholder="LastContactName" />
              </Form.Item>
            </div>
            <div className="details__group">
              <Form.Item
                name="bankName"
                label={<Text>Bank Name</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "bankName"
                    ),
                  },
                  {
                    max: 25,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "bankName",
                      25
                    ),
                  },
                  {
                    min: 4,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "bankName",
                      8
                    ),
                  },
                ]}
              >
                <Input placeholder="BankName" />
              </Form.Item>

              <Form.Item
                name="bankAccountNumber"
                label={<Text>Bank Account Number</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "bankAccountNumber"
                    ),
                  },
                  {
                    max: 25,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "bankAccountNumber",
                      25
                    ),
                  },
                  {
                    min: 8,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "bankAccountNumber",
                      8
                    ),
                  },
                ]}
              >
                <Input placeholder="BankAccountNumber" />
              </Form.Item>
            </div>
            <div className="details__group">
              <Form.Item
                name="phoneNumberContact"
                label={<Text>Phone Number Contact</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "phoneNumberContact"
                    ),
                  },
                  {
                    max: 11,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "phoneNumberContact",
                      11
                    ),
                  },
                  {
                    min: 10,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "phoneNumberContact",
                      10
                    ),
                  },
                ]}
              >
                <Input placeholder="PhoneNumberContact" />
              </Form.Item>

              <Form.Item
                name="supplierName"
                label={<Text>Supplier Name</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "supplierName"
                    ),
                  },
                  {
                    max: 25,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "supplierName",
                      25
                    ),
                  },
                  {
                    min: 8,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "supplierName",
                      8
                    ),
                  },
                ]}
              >
                <Input placeholder="SupplierName" />
              </Form.Item>
            </div>
            <div className="details__group">
              <Form.Item
                name="taxCode"
                label={<Text>Tax Code</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "taxCode"
                    ),
                  },
                  {
                    max: 13,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "taxCode",
                      13
                    ),
                  },
                  {
                    min: 10,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "taxCode",
                      10
                    ),
                  },
                ]}
              >
                <Input placeholder="TaxCode" />
              </Form.Item>
            </div>

            <div className="btns">
              <Button
                key="back"
                shape={"round"}
                htmlType="reset"
                onClick={() => {
                  setModal1Open(false);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button
                key="submit"
                shape={"round"}
                type="primary"
                htmlType="submit"
              >
                Submit
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={listSuppliers}
        onRow={(record) => ({
          onClick: () => {
            onRowClick(record);
          },
        })}
        pagination={
          listSuppliers.length !== 0
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

// // import React from 'react'

// // export default function SupplierList() {
// // 	return (
// // 		<div>SupplierList</div>
// // 	)
// // }
// import { DownOutlined } from "@ant-design/icons";
// import { Dropdown, Menu, Typography } from "antd";
// import { SearchOutlined } from "@ant-design/icons";
// import { Avatar, Button, Input, Space, Table, Tag } from "antd";
// import React, { useEffect, useRef, useState } from "react";
// import queryString from "query-string";
// import Highlighter from "react-highlight-words";

// import { unwrapResult } from "@reduxjs/toolkit";
// import { useDispatch, useSelector } from "react-redux";
// import { useHistory, useLocation } from "react-router-dom";
// import "./SupplierList.css";
// import {
//   SupplierManagerPaths,
//   getSuppliers,
// } from "features/supplier-manager/supplierManager";

// const App = () => {
//   const { listSuppliers, totalElements, totalPages, size } = useSelector(
//     (state) => state.supplier
//   );

//   const history = useHistory();
//   const location = useLocation();
//   const dispatch = useDispatch();

//   const [modal1Open, setModal1Open] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const [searchText, setSearchText] = useState("");
//   const [searchedColumn, setSearchedColumn] = useState("");
//   const searchInput = useRef(null);

//   useEffect(() => {
//     // const query = queryString.parse(location.search);
//     setIsLoading(true);
//     dispatch(getSuppliers())
//       .then(unwrapResult)
//       .then(() => setIsLoading(false));
//   }, [dispatch, location]);

//   const handleSearch = (selectedKeys, confirm, dataIndex) => {
//     confirm();
//     setSearchText(selectedKeys[0]);
//     setSearchedColumn(dataIndex);
//   };

//   const handleReset = (clearFilters) => {
//     clearFilters();
//     setSearchText("");
//   };

//   const getColumnSearchProps = (dataIndex) => ({
//     filterDropdown: ({
//       setSelectedKeys,
//       selectedKeys,
//       confirm,
//       clearFilters,
//     }) => (
//       <div
//         style={{
//           padding: 8,
//         }}
//       >
//         <Input
//           ref={searchInput}
//           placeholder={`Search ${dataIndex}`}
//           value={selectedKeys[0]}
//           onChange={(e) =>
//             setSelectedKeys(e.target.value ? [e.target.value] : [])
//           }
//           onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
//           style={{
//             marginBottom: 8,
//             display: "block",
//           }}
//         />
//         <Space>
//           <Button
//             type="primary"
//             onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
//             icon={<SearchOutlined />}
//             size="small"
//             style={{
//               width: 90,
//             }}
//           >
//             Search
//           </Button>
//           <Button
//             onClick={() => clearFilters && handleReset(clearFilters)}
//             size="small"
//             style={{
//               width: 90,
//             }}
//           >
//             Reset
//           </Button>
//           <Button
//             type="link"
//             size="small"
//             onClick={() => {
//               confirm({
//                 closeDropdown: false,
//               });
//               setSearchText(selectedKeys[0]);
//               setSearchedColumn(dataIndex);
//             }}
//           >
//             Filter
//           </Button>
//         </Space>
//       </div>
//     ),
//     filterIcon: (filtered) => (
//       <SearchOutlined
//         style={{
//           color: filtered ? "#1890ff" : undefined,
//         }}
//       />
//     ),
//     onFilter: (value, record) =>
//       record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
//     onFilterDropdownOpenChange: (visible) => {
//       if (visible) {
//         setTimeout(() => searchInput.current?.select(), 100);
//       }
//     },
//     render: (text) =>
//       searchedColumn === dataIndex ? (
//         <Highlighter
//           highlightStyle={{
//             backgroundColor: "#ffc069",
//             padding: 0,
//           }}
//           searchWords={[searchText]}
//           autoEscape
//           textToHighlight={text ? text.toString() : ""}
//         />
//       ) : (
//         text
//       ),
//   });

//   const menu = (
//     <Menu
//       selectable
//       //   defaultSelectedKeys={['3']}
//       items={[
//         {
//           key: "1",
//           label: "View",
//         },
//         {
//           key: "2",
//           label: "Edit",
//         },
//         {
//           key: "3",
//           label: "Delete",
//         },
//       ]}
//     />
//   );

//   // const data = [
//   //   {
//   //     avatarSupplier: "https://joeschmoe.io/api/v1/random",
//   //     supplierName: "John Brown",
//   //     firstContactName: 32,
//   //     address: "New York No. 1 Lake Park",
//   //   },
//   //   {
//   //     avatarSupplier: "2",
//   //     supplierName: "Jim Green",
//   //     firstContactName: 42,
//   //     address: "London No. 1 Lake Park",
//   //   },
//   //   {
//   //     avatarSupplier: "3",
//   //     supplierName: "Joe Black",
//   //     firstContactName: 32,
//   //     address: "Sidney No. 1 Lake Park",
//   //   },
//   //   {
//   //     avatarSupplier: "4",
//   //     supplierName: "Jim Red",
//   //     firstContactName: 32,
//   //     address: "London No. 2 Lake Park",
//   //   },
//   // ];

//   const columns = [
//     {
//       title: "Avatar",
//       dataIndex: "avatarSupplier",
//       key: "avatarSupplier",
//       width: "10%",
//       ...getColumnSearchProps("avatarSupplier"),
//       render: (text, record) => {
//         return (
//           <div>
//             <Avatar src={record.avatarSupplier} />
//           </div>
//         );
//       },
//     },
//     {
//       title: "Supplier Name",
//       dataIndex: "supplierName",
//       key: "supplierName",
//       width: "20%",
//       ...getColumnSearchProps("supplierName"),
//       sorter: (a, b) => a.supplierName - b.supplierName,
//       sortDirections: ["descend", "ascend"],
//     },
//     {
//       title: "Contact Name",
//       colSpan: 2,
//       dataIndex: "firstContactName",
//       width: "10%",
//       ...getColumnSearchProps("lastContactName"),
//       sorter: (a, b) => a.lastContactName.length - b.lastContactName.length,
//       sortDirections: ["descend", "ascend"],
//     },
//     {
//       title: "Phone",
//       colSpan: 0,
//       dataIndex: "lastContactName",
//       width: "10%",
//     },
//     {
//       title: "Phone Number Contact",
//       dataIndex: "phoneNumberContact",
//       key: "phoneNumberContact",
//       width: "20%",
//       ...getColumnSearchProps("phoneNumberContact"),
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       filters: [
//         {
//           text: "Active",
//           value: 1,
//         },
//         {
//           text: "In Active",
//           value: 0,
//         },
//       ],
//       onFilter: (value, record) => record.status === value,
//       filterSearch: true,
//       render: (s) => {
//         let color = s === 1 ? "green" : "volcano";
//         return s === 1 ? (
//           <Tag color={color} key={s}>
//             Approved
//           </Tag>
//         ) : (
//           <Tag color={color} key={s}>
//             Pending
//           </Tag>
//         );
//       },
//       width: "20%",
//       sorter: (a, b) => a.status - b.status,
//       sortDirections: ["descend", "ascend"],
//     },
//     {
//       render: () => (
//         <Space size="middle">
//           <Dropdown overlay={menu}>
//             <a>
//               Action <DownOutlined />
//             </a>
//           </Dropdown>
//         </Space>
//       ),
//     },
//   ];

//   const onRowClick = (record) => {
//     history.push(
//       SupplierManagerPaths.SUPPLIER_DETAIL.replace(
//         ":supplierId",
//         record.id || ""
//       )
//     );
//   };

//   return (
//     <>
//       <>
//         <Button type="primary">Add Supplier</Button>
//         <h1>Supplier List</h1>
//         <br />
//         <Button
//           type="primary"
//           shape={"round"}
//           size={"large"}
//           onClick={() => setModal1Open(true)}
//         >
//           Create New
//         </Button>

//       </>
//       <br />
//       <Table
//         rowKey="id"
//         columns={columns}
//         dataSource={listSuppliers}
//         onRow={(record) => ({
//           onClick: () => {
//             onRowClick(record);
//           },
//         })}
//         pagination={
//           listSuppliers.length !== 0
//             ? {
//                 showSizeChanger: true,
//                 position: ["bottomCenter"],
//                 size: "default",
//                 pageSize: 10,
//                 // current: getPageUrl || pageHead,
//                 totalElements,
//                 // onChange: (page, size) =>
//                 // 	onHandlePagination(page, size),
//                 pageSizeOptions: ["10", "15", "20", "25"],
//               }
//             : false
//         }
//         loading={isLoading}
//       />
//     </>
//   );
// };

// export default App;
