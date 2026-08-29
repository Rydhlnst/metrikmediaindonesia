import { type ImageProps } from "next/image";
import { MediaImage } from "@/components/shared/media-image";

type ArticleImageProps = Pick<ImageProps, "alt" | "fill" | "sizes" | "priority" | "className"> & {
  src: unknown;
};

export function ArticleImage({ src, alt, fill = true, sizes, priority, className }: ArticleImageProps) {
  return <MediaImage src={src} alt={alt} fill={fill} sizes={sizes} priority={priority} className={className} />;
}
