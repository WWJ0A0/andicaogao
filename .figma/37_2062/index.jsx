import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.group1}>
      <div className={styles.rectangle2}>
        <p className={styles.text}>定制提醒</p>
      </div>
      <div className={styles.rectangle3}>
        <p className={styles.text2}>每日提醒</p>
      </div>
      <div className={styles.rectangle4}>
        <p className={styles.text2}>每日提醒</p>
      </div>
    </div>
  );
}

export default Component;
