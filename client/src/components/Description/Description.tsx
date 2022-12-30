import React, { memo, ReactElement } from 'react';
import { Text } from 'native-base';

import { CAMBRIA_FONT } from '@constants';

import { DescriptionProps } from './Description.interface';

const Description = ({ text, ...rest }: DescriptionProps): ReactElement => {
  return (
    <Text
      fontSize={{
        base: '2xl',
        sm: '3xl',
        md: '4xl',
      }}
      color="white"
      {...CAMBRIA_FONT}
      {...rest}
    >
      {text}
    </Text>
  );
};

export default memo(Description);
