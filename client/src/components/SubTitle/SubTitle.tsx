import React, { memo, ReactElement } from 'react';
import { Text } from 'native-base';

import { COMPACTA_FONT } from '@constants';

import { SubTitleProps } from './SubTitle.interface';

const SubTitle = ({ text, ...rest }: SubTitleProps): ReactElement => {
  return (
    <Text
      fontSize={{
        base: '5xl',
        sm: '6xl',
        md: '6xl',
      }}
      lineHeight="2xs"
      color="white"
      {...COMPACTA_FONT}
      {...rest}
    >
      {text}
    </Text>
  );
};

export default memo(SubTitle);
