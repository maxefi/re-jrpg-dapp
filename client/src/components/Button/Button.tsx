import React, { memo, PropsWithChildren, ReactElement } from 'react';
import { Button as NativeButton, Text } from 'native-base';

import { COMPACTA_FONT } from '@constants';
import { getIsMobile } from '@utils';

import { ButtonProps } from './Button.interface';

const Button = (props: PropsWithChildren<ButtonProps>): ReactElement => {
  const { children, text, isDisabled, onPress, ...rest } = props;

  return (
    <NativeButton
      justifyContent="center"
      alignItems="center"
      h={12}
      colorScheme={isDisabled ? 'muted' : 'red'}
      borderRadius={0}
      onPress={onPress}
      disabled={isDisabled}
      {...rest}
    >
      {children}

      {text && (
        <Text fontSize="xl" lineHeight="xs" {...COMPACTA_FONT} color="white" mt={getIsMobile() ? 1 : 0}>
          {text}
        </Text>
      )}
    </NativeButton>
  );
};

export default memo(Button);
