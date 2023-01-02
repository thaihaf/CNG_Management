import React from "react";
import { motion } from "framer-motion/dist/framer-motion";
import { Statistic, Table, Tag, Typography, notification } from "antd";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSupplierDebts } from "features/supplier-debt/supplierDebt";
import { unwrapResult } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useState } from "react";
import dayjs from "dayjs";
import {
  statusProductExport,
  statusProductReExport,
} from "features/export-product/constants/export-product.constants";
import { getStatusString } from "helpers/util.helper";
import {
  ProductExportManagerPaths,
  getAllProductExport,
} from "features/export-product/exportProduct";
import rightArrowImg from "assets/icons/rightArrow.png";

import "./ListTable.css";

const { Title, Text } = Typography;

export default function ListTable() {
  const { listAllProductExport } = useSelector((state) => state.productExport);
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "right",
      render: (a, b, index) => <Text>{index + 1}</Text>,
    },
    {
      title: "Loại đơn",
      dataIndex: "type",
      key: "type",
      align: "left",
      render: (_, { type }) => (
        <Tag
          color={type === "EXPORT" ? "green" : "red"}
          key={type === "EXPORT" ? "XUẤT HÀNG" : "TRẢ HÀNG"}
        >
          {type}
        </Tag>
      ),
    },
    {
      title: "Mã đơn xuất",
      dataIndex: "id",
      key: "id",
      align: "right",
      render: (value) => (
        <Tag
          color="darksalmon"
          key={value}
          style={{ cursor: "pointer" }}
          onClick={() =>
            history.push(
              ProductExportManagerPaths.DETAILS_PRODUCT_EXPORT.replace(
                ":exportId",
                value
              )
            )
          }
        >
          {value}
        </Tag>
      ),
    },
    {
      title: "Ngày xuất",
      dataIndex: "createAt",
      key: "createAt",
      align: "center",
      render: (_, { createDate }) => {
        let newDate = dayjs(new Date(createDate)).format("DD-MM-YYYY");
        return <Text>{newDate}</Text>;
      },
    },
    {
      title: "Số lượng nhập (m2)",
      dataIndex: "totalSquareMeterExport",
      key: "totalSquareMeterExport",
      align: "right",
      render: (a, { totalSquareMeterExport }) => {
        return <Statistic precision={2} value={totalSquareMeterExport} />;
      },
    },
    {
      title: "Giá bán (VND)",
      dataIndex: "totalExportOrderPrice",
      key: "totalExportOrderPrice",
      align: "right",
      render: (a, { totalExportOrderPrice }) => {
        return <Statistic precision={0} value={totalExportOrderPrice} />;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "left",
      render: (s, record) => {
        let color = "";
        switch (s) {
          case 1:
            color = "blue";
            break;
          case 2:
            color = "hotpink";
            break;
          case 3:
            color = "darkgoldenrod";
            break;
          case 4:
            color = "green";
            break;
        }
        return (
          <Tag color={color} key={s}>
            {getStatusString(
              s,
              record.type !== "RE-EXPORT"
                ? statusProductExport
                : statusProductReExport
            )}
          </Tag>
        );
      },
    },
  ];

  useEffect(() => {
    setIsLoading(true);

    let query = {
      size: 5,
      sort: "createDate,desc",
    };

    dispatch(getAllProductExport(query))
      .then(unwrapResult)
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response.status === 400) {
          notification.error({
            message: "Danh sách sản phẩm xuất",
            description: "Tham số không đúng, vui lòng kiểm tra lại",
          });
        }
      });
  }, [dispatch, location]);

  return (
    <motion.div
      animate={{ opacity: [0, 1], y: [50, 0] }}
      exit={{ opacity: [1, 0] }}
      transition={{ duration: 1 }}
      className="supplier-debt-list"
    >
      <div className="top">
        <Title className="title" level={5}>
          5 Đơn xuất mới nhất
        </Title>
      </div>

      <Table
        rowKey={(record) => record.id}
        columns={columns}
        loading={isLoading}
        scroll={{ x: "maxContent" }}
        rowClassName={(record, index) =>
          index % 2 === 0
            ? "table-row table-row-even"
            : "table-row table-row-odd"
        }
        dataSource={[...listAllProductExport]}
        pagination={{
          position: ["bottomRight"],
          showTotal: (total, range) => (
            <a
              href={ProductExportManagerPaths.LIST_PRODUCT_EXPORT}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              Xem tất cả
              <img
                src={rightArrowImg}
                alt=""
                style={{ width: "1rem", height: "1rem" }}
              />
            </a>
          ),
        }}
      />
    </motion.div>
  );
}
