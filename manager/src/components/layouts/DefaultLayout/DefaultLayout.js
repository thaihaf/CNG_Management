import { useEffect } from "react";

import { Layout } from "antd";

// import Menu from "@app/components/molecules/Menu/Menu";
// import Navigation from "@app/components/molecules/Navigation/Navigation";

import styles from "./DefaultLayout.module.scss";

const { Content } = Layout;

const DefaultLayout = ({ children }) => {
     useEffect(() => {
          window.scrollTo(0, 0);
     });
     return (
          <Layout className={styles.defaultLayout}>
               {/* <Navigation /> */}
               <Content className={styles.container}>
                    {/* <Menu /> */}
                    <div className={styles.content}>{children}</div>
               </Content>
          </Layout>
     );
};

export default DefaultLayout;
