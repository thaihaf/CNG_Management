import React from "react";
import styles from "./AuthLayout.module.scss";

export default function AuthLayout({ children }) {
     return <div className={styles.layout}>{children}</div>;
}
