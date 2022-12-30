import { IButtonProps } from 'native-base';

export interface ButtonProps extends IButtonProps {
  text?: Nullable<string>;
  isDisabled?: boolean;
  onPress: () => void;
}
