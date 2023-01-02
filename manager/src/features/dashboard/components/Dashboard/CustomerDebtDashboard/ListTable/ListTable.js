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
import { ImportProductManagerPaths, getAllProductImport } from "features/import-product/importProduct";
import { statusProductImport } from "features/import-product/constants/import-product.constants";
import rightArrowImg from "assets/icons/rightArrow.png";

import "./ListTable.css";
const { Title, Text } = Typography;
export default function ListTable() {
  const { listAllProductImport } = useSelector((state) => state.productImport);

  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "right",
      render: (a, b, index) => <Text>{index + 1}</Text>,
    },
    {
      title: "Mã đơn nhập",
      dataIndex: "id",
      key: "id",
      align: "right",
      render: (value) => (
        <Tag
          color="seagreen"
          key={value}
          style={{ cursor: "pointer" }}
          onClick={() =>
            history.push(
              ImportProductManagerPaths.DETAILS_PRODUCT_IMPORT.replace(
                ":importId",
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
      title: "Ngày nhập",
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
      dataIndex: "totalSquareMeterImport",
      key: "totalSquareMeterImport",
      align: "right",
      render: (a, { totalSquareMeterImport }) => {
        return <Statistic precision={2} value={totalSquareMeterImport} />;
      },
    },
    {
      title: "Chi phí nhập (VND)",
      dataIndex: "totalCostImport",
      key: "totalCostImport",
      align: "right",
      render: (a, { totalCostImport }) => {
        return <Statistic precision={0} value={totalCostImport} />;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "left",
      render: (s) => {
        let color = s == 2 ? "green" : "volcano";

        return (
          <Tag color={color} key={s}>
            {getStatusString(s, statusProductImport)}
          </Tag>
        );
      },
    },
  ];

  useEffect(() => {
    let query = {
      size: 5,
      sort: "createDate,desc",
    };
    setIsLoading(true);

    dispatch(getAllProductImport(query))
      .then(unwrapResult)
      .then((res) => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        // message.error(err.response.data.Error.message);
        setIsLoading(false);
      });

    // dispatch(getActiveCategories());
  }, [dispatch, location]);

  return (
    <motion.div
      className="customer-debt-list"
      animate={{ opacity: [0, 1], y: [50, 0] }}
      exit={{ opacity: [1, 0] }}
      transition={{ duration: 1 }}
    >
      <div className="top">
        <Title className="title" level={5}>
          5 Đơn nhập mới nhất
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
        dataSource={[...listAllProductImport]}
        pagination={{
          position: ["bottomRight"],
          showTotal: (total, range) => (
            <a
              href={ImportProductManagerPaths.LIST_PRODUCT_IMPORT}
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
