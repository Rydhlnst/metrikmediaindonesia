import NextImage, { type ImageProps } from "next/image";
import { ImageBroken } from "@phosphor-icons/react/dist/ssr";
import { getImageUrl } from "@/lib/utils";

type ArticleImageProps = Pick<ImageProps, "alt" | "fill" | "sizes" | "priority" | "className"> & {
  src: unknown;
};

export function ArticleImage({ src, alt, fill = true, sizes, priority, className }: ArticleImageProps) {
  const imageUrl = getImageUrl(src);

  if (imageUrl === "/placeholder.png") {
    return (
      <div
        role="img"
        aria-label={`${alt} — No image available`}
        className="absolute inset-0 flex items-center justify-center bg-surface-container text-muted-foreground"
      >
        <ImageBroken className="size-10" weight="thin" aria-hidden="true" />
      </div>
    );
  }

  return <NextImage src={imageUrl} alt={alt} fill={fill} sizes={sizes} priority={priority} className={className} />;
}
