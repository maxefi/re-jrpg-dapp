import React, { memo, ReactElement } from 'react';
import { AspectRatio, Image } from 'native-base';

import { RatioImageProps } from './RatioImage.interface';

const RatioImage = ({ uri, alt, ...rest }: RatioImageProps): ReactElement => {
  return (
    <AspectRatio {...rest}>
      <Image source={{ uri }} alt={alt} />
    </AspectRatio>
  );
};

export default memo(RatioImage);
