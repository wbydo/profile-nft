import * as React from 'react';

import { styles } from './Top.css';

export const Top = () => {
  return <p {...{ className: styles.container }}>Hello World</p>;
};
