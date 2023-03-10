/*
 * @Description:
 * @Author: LCL
 * @Date: 2022-03-17
 * @LastEditors: LCL
 * @LastEditTime: 2022-03-17
 */

import { CrownOutlined } from '@ant-design/icons';
import styles from './index.less';

const ApiDoc = () => {
  const arr = ['swagger APi', '小程序', '开放平台', '企业微信'];
  return (
    <div className={styles.bg}>
      <div className={styles.pageInner}>
        <div className={styles.pageHd}>
          <img src="https://my-beta.chinasie.com:8643/ihr/sie_logo.svg" alt="" />
          <span>IT管理部文档</span>
        </div>
        <ul className={styles.docLinks}>
          {arr.map((item, index) => (
            <li key={index} className={styles.docLink}>
              <a href="/umi/plugin/openapi" target="_self">
                <h3 className={styles.docTitle}>
                  <CrownOutlined className={styles.docIcon} />
                  <span className={styles.docText}>{item}</span>
                </h3>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ApiDoc;
