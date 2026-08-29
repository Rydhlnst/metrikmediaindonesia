"use client";

import NextImage, { type ImageProps } from "next/image";
import { useState } from "react";
import { IMAGE_PLACEHOLDER, cn, getImageUrl } from "@/lib/utils";

type MediaImageProps = Pick<
  ImageProps,
  "alt" | "fill" | "sizes" | "priority" | "className" | "width" | "height"
> & {
  src: unknown;
};

export function MediaImage({ src, alt, fill = true, sizes, priority, className, width, height }: MediaImageProps) {
  const imageUrl = getImageUrl(src);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const resolvedUrl = failedUrl === imageUrl ? IMAGE_PLACEHOLDER : imageUrl;

  return (
    <NextImage
      src={resolvedUrl}
      alt={alt}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      sizes={sizes}
      priority={priority}
      unoptimized={resolvedUrl.endsWith(".svg")}
      className={cn("max-w-full", className)}
      onError={() => {
        if (imageUrl !== IMAGE_PLACEHOLDER) setFailedUrl(imageUrl);
      }}
    />
  );
}
