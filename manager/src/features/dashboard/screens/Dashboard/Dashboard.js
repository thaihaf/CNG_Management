import React from "react";

import "antd/dist/antd.css";

import bg from "assets/images/bg-dashboard.png";
import logo from "assets/images/logo3.png";
import { Button } from "@mui/material";
import { FacebookFilled, InstagramFilled, TwitterCircleFilled } from "@ant-design/icons";

export default function Dashboard() {
     return (
          <div
               className="dashboard"
               style={{ backgroundImage: "url(" + bg + ")" }}
          >
               <div className="header">
                    <a href="/" className="header_logo">
                         <img src={logo} alt="logo" />
                    </a>

                    <div className="header_links">
                         <a href="/" className="header_link">
                              Home
                         </a>
                         <a href="/product" className="header_link">
                              Product
                         </a>
                         <a href="/support" className="header_link">
                              Support
                         </a>
                    </div>

                    <a className="header_btns" href="/login">
                         <Button
                              className="btn_signUp"
                              variant="outlined"
                              size="large"
                         >
                              Sign in
                         </Button>
                    </a>
               </div>

               <div className="slogan">
                    <div className="slogan_title">otter express</div>
                    <div className="slogan_captions">
                         <div className="caption">
                              One hour courier service in the same city.
                         </div>
                         <div className="caption">
                              Your satisfaction is our task.
                         </div>
                    </div>
                    <Button
                         className="slogan_btn"
                         variant="outlined"
                         size="large"
                    >
                         Get started
                    </Button>
               </div>

               <div className="contact_links">
                    <a href="/fb">
                         <FacebookFilled
                              color={"#fff"}
                              height="30px"
                              width="30px"
                         />
                    </a>
                    <a href="/ins">
                         <InstagramFilled
                              color={"#fff"}
                              height="30px"
                              width="30px"
                         />
                    </a>
                    <a href="/tw">
                         <TwitterCircleFilled
                              color={"#fff"}
                              height="30px"
                              width="30px"
                         />
                    </a>
               </div>
          </div>
     );
}
