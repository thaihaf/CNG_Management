import React, { useEffect, useRef, useState } from "react";
import queryString from "query-string";
import Highlighter from "react-highlight-words";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import {
  CameraOutlined,
  DeleteTwoTone,
  ExclamationCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Form,
  Input,
  message,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
  Dropdown,
  Menu,
  Upload,
  Select,
  notification,
} from "antd";
import {
  SupplierManagerPaths,
  getSuppliers,
  deleteSupplier,
  deleteSuppliers,
  bankNameList,
} from "features/supplier-manager/supplierManager";
import avt_default from "assets/images/avt-default.png";
import "./SupplierList.css";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { getMessage } from "helpers/util.helper";
import { storage } from "firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { createDetails } from "features/supplier-manager/supplierManager";
import {
  getDistrict,
  getProvince,
  getProvinces,
} from "features/provinces/provinces";
const { Title, Text } = Typography;
const { Option } = Select;
export default function SupplierList() {
  const { listSuppliers, totalElements, number, size } = useSelector(
    (state) => state.supplier
  );
  const { dataDetails, createMode } = useSelector((state) => state.supplier);
  const { provinces, districts, wards } = useSelector(
    (state) => state.provinces
  );
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [modal1Open, setModal1Open] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imgURL, setImgUrl] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const onHandlePagination = (pageCurrent, pageSize) => {
    setIsLoading(true);

    const page = pageCurrent.toString();
    const size = pageSize.toString();
    const params = queryString.parse(location.search);

    history.push({
      pathname: SupplierManagerPaths.SUPPLIER_LIST,
      search: queryString.stringify({
        ...params,
        size: size,
        number: page,
      }),
    });
  };

  const defaultValues = {
    status: 0,
    gender: true,
  };
  const initialValues = createMode ? defaultValues : dataDetails;

  function refreshPage() {
    window.location.reload(false);
  }

  const upLoadImg = async (file) => {
    if (file == null) return;

    const imgRef = ref(storage, `images/${file.name + v4()}`);
    uploadBytes(imgRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setIsLoading(false);
        setImgUrl(url);
      });
    });
  };

  const onRowDelete = (record) => {
    Modal.confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn chắc chắn muốn xoá không?",
      okText: "Xoá",
      cancelText: "Huỷ bỏ",
      onOk: () => {
        setIsLoading(true);
        dispatch(deleteSupplier(record.id))
          .then(unwrapResult)
          .then((res) => {
            console.log(res);
            dispatch(getProvinces())
              .then(unwrapResult)
              .then(() => {
                notification.success({
                  message: "Xoá Nhà cung cấp",
                  description: "Xoá Nhà cung cấp thành công",
                });
                setIsLoading(false);
              });
          })
          .catch((error) => {
            console.log(error);
            notification.error({
              message: "Xoá Nhà cung cấp",
              description: "Xoá Nhà cung cấp thất bại",
            });
          });
      },
      onCancel: () => {},
    });
  };
  const onRowDetails = (record) => {
    history.push(
      SupplierManagerPaths.SUPPLIER_DETAIL.replace(
        ":supplierId",
        record.id || ""
      )
    );
  };

  useEffect(() => {
    setIsLoading(true);

    let query = queryString.parse(location.search);
    if (query.number) {
      query.number = query.number - 1;
    }
    dispatch(getSuppliers(query))
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

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (a, b, index) => <Text>{index + 1}</Text>,
    },
    {
      title: "Ảnh đại diện",
      dataIndex: "avatarSupplier",
      key: "avatarSupplier",
      align: "center",
      render: (text, record) => {
        return (
          <div>
            <Avatar size={50} src={record.avatarSupplier} />
          </div>
        );
      },
    },
    {
      title: "Tên nhà cung cấp",
      dataIndex: "supplierName",
      key: "supplierName",
      align: "center",
      ...getColumnSearchProps("supplierName"),
      sorter: (a, b) => a.supplierName - b.supplierName,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Họ của Người liên hệ",
      dataIndex: "firstContactName",
      key: "firstContactName",
      align: "center",
      ...getColumnSearchProps("firstContactName"),
      sorter: (a, b) => a.firstContactName.length - b.firstContactName.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Tên của Người liên hệ",
      dataIndex: "lastContactName",
      key: "lastContactName",
      align: "center",
      ...getColumnSearchProps("lastContactName"),
      sorter: (a, b) => a.lastContactName.length - b.lastContactName.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Tên Ngân hàng",
      dataIndex: "bankName",
      key: "bankName",
      align: "center",
      ...getColumnSearchProps("bankName"),
      sorter: (a, b) => a.bankName.length - b.bankName.length,
    },
    {
      title: "Tài khoản ngân hàng",
      dataIndex: "bankAccountNumber",
      key: "bankAccountNumber",
      align: "center",
      ...getColumnSearchProps("bankAccountNumber"),
      sorter: (a, b) => a.bankAccountNumber.length - b.bankAccountNumber.length,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumberContact",
      key: "phoneNumberContact",
      align: "center",
      ...getColumnSearchProps("phoneNumberContact"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "Hoạt động",
          value: 1,
        },
        {
          text: "Không hoạt động",
          value: 0,
        },
      ],
      onFilter: (value, record) => record.status === value,
      filterSearch: true,
      render: (s) => {
        let color = s === 1 ? "green" : "volcano";
        return s === 1 ? (
          <Tag color={color} key={s}>
            Hoạt động
          </Tag>
        ) : (
          <Tag color={color} key={s}>
            Không hoạt động
          </Tag>
        );
      },
      align: "center",
      sorter: (a, b) => a.status - b.status,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Hành động",
      dataIndex: "operation",
      key: "operation",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 1,
                label: "Xem chi tiết và Cập nhật",
                onClick: () => onRowDetails(record),
              },
              {
                key: 2,
                label: "Xoá Nhà cung cấp",
                onClick: () => onRowDelete(record),
              },
            ],
          }}
        >
          <a>
            Xem thêm <DownOutlined />
          </a>
        </Dropdown>
      ),
    },
  ];

  const onSubmitCreate = async ({
    apartmentNumber,
    city,
    district,
    ward,
    ...args
  }) => {
    console.log(apartmentNumber);
    dispatch(
      createDetails({
        data: {
          address: {
            city: city.value,
            district: district.value,
            ward: ward.value,
            apartmentNumber: apartmentNumber,
          },
          ...args,
          status: 1,
          avatarSupplier: imgURL === null ? "" : imgURL,
        },
      })
    )
      .then(unwrapResult)
      .then((res) => {
        notification.success({
          message: "Tạo Nhà cung cấp",
          description: "Tạo Nhà cung cấp thành công",
        });
      })
      .catch((error) => {
        console.log(error);
        console.log(args);
        notification.error({
          message: "Tạo Nhà cung cấp",
          description: "Tạo Nhà cung cấp thất bại",
        });
      });
  };

  useEffect(() => {
    form.setFieldsValue(initialValues);
    if (!createMode && initialValues !== null) {
      setImgUrl(initialValues.avatarSupplier);
    }
  }, [dispatch, createMode, initialValues]);

  return (
    <div className="employee-list">
      <div className="top">
        <Title level={2}>Danh sách Nhà cung cấp</Title>
        <div>
          <Button
            type="primary"
            shape={"round"}
            size={"large"}
            onClick={() => setModal1Open(true)}
          >
            Tạo mới Nhà cung cấp
          </Button>
          <Modal
            title="Tạo mới Nhà cung cấp"
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
                <div className="details__avatar">
                  <div className="details__avatar-img">
                    <img
                      src={!imgURL || imgURL === "" ? avt_default : imgURL}
                      alt="avt"
                    />
                  </div>
                  <Form.Item
                    valuePropName="fileList"
                    className="item_choose-avt"
                    name="avt"
                  >
                    <ImgCrop rotate>
                      <Upload
                        listType="picture-card"
                        maxCount={1}
                        beforeUpload={(file) => {
                          setIsLoading(true);
                          return new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (reader.readyState === 2) {
                                setImgUrl(reader.result);
                                upLoadImg(file);
                              }
                            };
                            reader.readAsDataURL(file);
                          });
                        }}
                      >
                        <CameraOutlined
                          style={{
                            fontSize: "2rem",
                          }}
                        />
                      </Upload>
                    </ImgCrop>
                  </Form.Item>
                </div>
              </div>
              <div className="details__group">
                <Form.Item
                  name="firstContactName"
                  label={<Text>Họ của Người cung cấp</Text>}
                  className="details__item"
                  rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED,
                        MESSAGE_ERROR,
                        "Họ của Người cung cấp"
                      ),
                    },
                    {
                      pattern:
                        /^[a-zA-ZaAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ\s]{2,10}$/,
                      message: getMessage(
                        CODE_ERROR.ERROR_FORMAT,
                        MESSAGE_ERROR,
                        "Họ của Người cung cấp"
                      ),
                    },
                    {
                      max: 10,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MAX,
                        MESSAGE_ERROR,
                        "Họ của Người cung cấp",
                        10
                      ),
                    },
                    {
                      min: 2,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MIN,
                        MESSAGE_ERROR,
                        "Họ của Người cung cấp",
                        2
                      ),
                    },
                  ]}
                >
                  <Input placeholder="Họ của Người cung cấp" />
                </Form.Item>

                <Form.Item
                  name="lastContactName"
                  label={<Text>Tên của nhà cung cấp</Text>}
                  className="details__item"
                  rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED,
                        MESSAGE_ERROR,
                        "Tên của nhà cung cấp"
                      ),
                    },
                    {
                      pattern:
                        /^[a-zA-ZaAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ\s]{2,50}$/,
                      message: getMessage(
                        CODE_ERROR.ERROR_FORMAT,
                        MESSAGE_ERROR,
                        "Tên của nhà cung cấp"
                      ),
                    },
                    {
                      max: 50,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MAX,
                        MESSAGE_ERROR,
                        "Tên của nhà cung cấp",
                        50
                      ),
                    },
                    {
                      min: 2,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MIN,
                        MESSAGE_ERROR,
                        "Tên của nhà cung cấp",
                        2
                      ),
                    },
                  ]}
                >
                  <Input placeholder="Tên của nhà cung cấp" />
                </Form.Item>
              </div>
              <div className="details__group">
                <Form.Item
                  name="bankName"
                  label={<Text>Tên Ngân hàng</Text>}
                  className="details__item"
                  rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED,
                        MESSAGE_ERROR,
                        "Tên Ngân hàng"
                      ),
                    },
                    {
                      max: 10,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MAX,
                        MESSAGE_ERROR,
                        "Tên Ngân hàng",
                        10
                      ),
                    },
                    {
                      min: 2,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MIN,
                        MESSAGE_ERROR,
                        "Tên Ngân hàng",
                        2
                      ),
                    },
                  ]}
                >
                  <Input placeholder="Tên Ngân hàng" />
                </Form.Item>

                <Form.Item
                  name="bankAccountNumber"
                  label={<Text>Số tài khoản</Text>}
                  className="details__item"
                  rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED,
                        MESSAGE_ERROR,
                        "Số tài khoản"
                      ),
                    },
                    {
                      pattern: /^[1-9]{1}[0-9]{5,14}$/,
                      message: getMessage(
                        CODE_ERROR.ERROR_FORMAT_NUMBER,
                        MESSAGE_ERROR,
                        "Số tài khoản"
                      ),
                    },
                    {
                      max: 14,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MAX,
                        MESSAGE_ERROR,
                        "Số tài khoản",
                        14
                      ),
                    },
                    {
                      min: 5,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MIN,
                        MESSAGE_ERROR,
                        "Số tài khoản",
                        5
                      ),
                    },
                  ]}
                >
                  <Input placeholder="Số tài khoản" />
                </Form.Item>
              </div>
              <div className="details__group">
                <Form.Item
                  name="phoneNumberContact"
                  label={<Text>Số điện thoại người liên hệ</Text>}
                  className="details__item"
                  rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED,
                        MESSAGE_ERROR,
                        "Số điện thoại người liên hệ"
                      ),
                    },
                    {
                      pattern: /^[0]{1}[0-9]{9,10}$/,
                      message: getMessage(
                        CODE_ERROR.ERROR_FORMAT_NUMBER,
                        MESSAGE_ERROR,
                        "Số điện thoại người liên hệ"
                      ),
                    },
                    {
                      max: 11,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MAX,
                        MESSAGE_ERROR,
                        "Số điện thoại người liên hệ",
                        11
                      ),
                    },
                    {
                      min: 9,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MIN,
                        MESSAGE_ERROR,
                        "Số điện thoại người liên hệ",
                        9
                      ),
                    },
                  ]}
                >
                  <Input placeholder="Số điện thoại người liên hệ" />
                </Form.Item>

                <Form.Item
                  name="supplierName"
                  label={<Text>Tên nhà cung cấp</Text>}
                  className="details__item"
                  rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED,
                        MESSAGE_ERROR,
                        "Tên nhà cung cấp"
                      ),
                    },
                    {
                      pattern:
                        /^[a-zA-Z0-9aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ\s]{2,50}$/,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_LETTER,
                        MESSAGE_ERROR,
                        "Tên nhà cung cấp"
                      ),
                    },
                    {
                      max: 50,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MAX,
                        MESSAGE_ERROR,
                        "Tên nhà cung cấp",
                        50
                      ),
                    },
                    {
                      min: 2,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MIN,
                        MESSAGE_ERROR,
                        "Tên nhà cung cấp",
                        2
                      ),
                    },
                  ]}
                >
                  <Input placeholder="Tên nhà cung cấp" />
                </Form.Item>
              </div>
              <div className="details__group">
                <Form.Item
                  name="taxCode"
                  label={<Text>Mã số thuế</Text>}
                  className="details__item"
                  rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED,
                        MESSAGE_ERROR,
                        "Mã số thuế"
                      ),
                    },
                    {
                      pattern: /^[0-9]{10,13}$/,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER,
                        MESSAGE_ERROR,
                        "Mã số thuế"
                      ),
                    },
                    {
                      max: 13,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MAX,
                        MESSAGE_ERROR,
                        "Mã số thuế",
                        13
                      ),
                    },
                    {
                      min: 10,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MIN,
                        MESSAGE_ERROR,
                        "Mã số thuế",
                        10
                      ),
                    },
                  ]}
                >
                  <Input placeholder="Mã số thuế" />
                </Form.Item>
              </div>
              <div className="details__group">
                <Form.Item
                  name="apartmentNumber"
                  label={<Text>Tên đường, số nhà</Text>}
                  className="details__item"
                  rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED,
                        MESSAGE_ERROR,
                        "Tên đường, số nhà"
                      ),
                    },
                  ]}
                >
                  <Input placeholder="Tên đường, số nhà" />
                </Form.Item>
                <Form.Item
                  name="city"
                  label={<Text>Tỉnh, Thành phố</Text>}
                  className="details__item"
                  rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED,
                        MESSAGE_ERROR,
                        "Tỉnh, Thành phố"
                      ),
                    },
                  ]}
                >
                  <Select
                    labelInValue
                    showSearch
                    style={{
                      width: 200,
                    }}
                    onChange={(value) => {
                      dispatch(getProvince(value.key));
                    }}
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.includes(input)
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                  >
                    {provinces?.map((p) => {
                      return (
                        <Option value={p.name} key={p.code}>
                          {`${p.name}`}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </div>
              <div className="details__group">
                <Form.Item
                  name="district"
                  label={<Text>Quận, Huyện</Text>}
                  className="details__item"
                  rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED,
                        MESSAGE_ERROR,
                        "Quận, Huyện"
                      ),
                    },
                  ]}
                >
                  <Select
                    labelInValue
                    showSearch
                    style={{
                      width: 200,
                    }}
                    onChange={(value, e) => {
                      dispatch(getDistrict(value.key));
                    }}
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.includes(input)
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                  >
                    {districts?.map((d) => {
                      return (
                        <Option value={d.name} key={d.code}>
                          {`${d.name}`}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="ward"
                  label={<Text>Xã, Phường</Text>}
                  className="details__item"
                  rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED,
                        MESSAGE_ERROR,
                        "Xã, Phường"
                      ),
                    },
                  ]}
                >
                  <Select
                    labelInValue
                    showSearch
                    style={{
                      width: 200,
                    }}
                    onChange={(value, e) => {
                      console.log(value.value);
                    }}
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.includes(input)
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                  >
                    {wards?.map((w) => {
                      return (
                        <Option value={w.name} key={w.code}>
                          {`${w.name}`}
                        </Option>
                      );
                    })}
                  </Select>
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
                  Huỷ bỏ
                </Button>
                <Button
                  key="submit"
                  shape={"round"}
                  type="primary"
                  htmlType="submit"
                >
                  Gửi đi
                </Button>
              </div>
            </Form>
          </Modal>
        </div>
      </div>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        loading={isLoading}
        dataSource={[...listSuppliers]}
        pagination={
          totalElements !== 0
            ? {
                current: number,
                pageSize: size,
                total: totalElements,
                showSizeChanger: true,
                showQuickJumper: true,
                position: ["bottomCenter"],
                pageSizeOptions: ["10", "20", "50", "100"],
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
                onChange: (page, size) => onHandlePagination(page, size),
                locale: {
                  jump_to: "",
                  page: "trang",
                  items_per_page: "/ trang",
                },
              }
            : false
        }
      />
    </div>
  );
}
