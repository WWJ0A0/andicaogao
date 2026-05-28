import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.frame4}>
      <div className={styles.frame}>
        <p className={styles.text}>查看日记需要消耗积分</p>
        <p className={styles.text2}>
          300 积分可查看这条日记，
          <br />
          当前剩余积分 2000。
        </p>
      </div>
      <div className={styles.frame2090054421}>
        <div className={styles.frame2}>
          <p className={styles.text3}>确定消耗</p>
        </div>
        <div className={styles.frame3}>
          <p className={styles.text4}>取消</p>
        </div>
      </div>
    </div>
  );
}

export default Component;
