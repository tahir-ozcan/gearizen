import Image, { ImageProps } from "next/image";

export interface PreviewImageProps
  extends Omit<ImageProps, "src" | "width" | "height"> {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export default function PreviewImage({
  src,
  alt,
  width,
  height,
  className = "",
  ...props
}: PreviewImageProps) {
  const loader = ({ src }: { src: string }) => src;
  return (
    <Image
      loader={loader}
      src={src}
      alt={alt}
      width={width}
      height={height}
      unoptimized
      className={`w-full h-auto object-contain rounded-lg border border-gray-200 shadow-sm ${className}`}
      {...props}
    />
  );
}
