import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ className, alt, ...props }, ref) => {
    return (
      <img
        ref={ref}
        className={cn('aspect-square h-auto w-full object-cover', className)}
        alt={alt}
        {...props}
      />
    );
  }
);
Image.displayName = 'Image';

export { Image };
