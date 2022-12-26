import React, { useEffect } from "react";
import Chart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Spin, Typography } from "antd";

import dayjs from "dayjs";
import { getDashboardTotal } from "features/dashboard/dashboard";

import rightArrowImg from "assets/icons/rightArrow.png";
import avtImg from "assets/images/avt.jpg";

import "./TotalDashboard.css";
import { useState } from "react";

const { Title } = Typography;
const { Meta } = Card;

export default function TotalDashboard() {
  const { total } = useSelector((state) => state.dashboard.dashboard);

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(getDashboardTotal())
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch]);

  return (
    <Spin spinning={isLoading}>
      <div className="total">
        <div className="top">
          <Title className="title" level={5}>
            Overview
          </Title>
        </div>

        <div className="cards">
          {total?.map((c) => (
            <Card className="card" key={c.key}>
              <Meta
                avatar={<Avatar src={avtImg} />}
                title={c.key}
                description={c.value}
              />
            </Card>
          ))}
        </div>
      </div>
    </Spin>
  );
}
