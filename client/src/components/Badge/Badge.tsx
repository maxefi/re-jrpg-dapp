import React, { memo, ReactElement } from 'react';
import { Badge as NativeBadge } from 'native-base';

import { COMPACTA_FONT } from '@constants';
import { getIsMobile } from '@utils';

import { BadgeProps } from './Badge.interface';

const Badge = ({ text, ...rest }: BadgeProps): ReactElement => {
  return (
    <NativeBadge
      colorScheme="red"
      variant="solid"
      _text={{
        fontSize: {
          base: '2xl',
          sm: '3xl',
          md: '4xl',
        },
        lineHeight: '2xs',
        mt: getIsMobile() ? 1 : -1,
        ...COMPACTA_FONT,
      }}
      py={getIsMobile() ? 1 : 2}
      borderRadius={0}
      {...rest}
    >
      {text}
    </NativeBadge>
  );
};

export default memo(Badge);
