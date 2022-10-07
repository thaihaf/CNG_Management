import React from "react";

import "antd/dist/antd.css";
import styles from "./Dashboard.module.scss";
import { LogoFacebook, LogoTwitter, LogoInstagram } from "react-ionicons";

import bg from "assets/images/bg-dashboard.png";
import logo from "assets/images/logo3.png";
import { Button } from "@mui/material";

export default function Dashboard() {
     return (
          <div
               className={styles.dashboard}
               style={{ backgroundImage: "url(" + bg + ")" }}
          >
               <div className={styles.header}>
                    <a href="/" className={styles.header_logo}>
                         <img src={logo} alt="logo" />
                    </a>

                    <div className={styles.header_links}>
                         <a href="/" className={styles.header_link}>
                              Home
                         </a>
                         <a href="/product" className={styles.header_link}>
                              Product
                         </a>
                         <a href="/support" className={styles.header_link}>
                              Support
                         </a>
                    </div>

                    <a className={styles.header_btns} href="/login">
                         <Button
                              className={styles.btn_signUp}
                              variant="outlined"
                              size="large"
                         >
                              Sign in
                         </Button>
                    </a>
               </div>

               <div className={styles.slogan}>
                    <div className={styles.slogan_title}>otter express</div>
                    <div className={styles.slogan_captions}>
                         <div className={styles.caption}>
                              One hour courier service in the same city.
                         </div>
                         <div className={styles.caption}>
                              Your satisfaction is our task.
                         </div>
                    </div>
                    <Button
                         className={styles.slogan_btn}
                         variant="outlined"
                         size="large"
                    >
                         Get started
                    </Button>
               </div>

               <div className={styles.contact_links}>
                    <a href="/fb">
                         <LogoFacebook
                              color={"#fff"}
                              height="30px"
                              width="30px"
                         />
                    </a>
                    <a href="/ins">
                         <LogoInstagram
                              color={"#fff"}
                              height="30px"
                              width="30px"
                         />
                    </a>
                    <a href="/tw">
                         <LogoTwitter
                              color={"#fff"}
                              height="30px"
                              width="30px"
                         />
                    </a>
               </div>
          </div>
     );
}
