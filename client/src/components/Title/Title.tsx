import React, { memo, ReactElement } from 'react';
import { Text } from 'native-base';

import { COMPACTA_FONT } from '@constants';

import { TitleProps } from './Title.interface';

const Title = ({ text, ...rest }: TitleProps): ReactElement => {
  return (
    /*
     * should use `Heading` component here, but `fontFamily` does not work with it
     * */
    <Text
      fontSize={{
        base: '4xl',
        sm: '5xl',
        md: '5xl',
      }}
      lineHeight="sm"
      color="white"
      {...COMPACTA_FONT}
      {...rest}
    >
      {text}
    </Text>
  );
};

export default memo(Title);
