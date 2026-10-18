import type { CSSProperties, ImgHTMLAttributes } from 'react'

/**
 * Static editorial images reserve intrinsic dimensions. Skeletons belong to
 * genuine asynchronous data loading, not ordinary photography.
 * Use eager loading only for a measured above-the-fold/LCP image.
 */
export type ResponsiveImageProps = {
  src: string
  alt: string
  width: number
  height: number
  sizes: string
  srcSet?: string
  loading?: 'lazy' | 'eager'
  fetchPriority?: ImgHTMLAttributes<HTMLImageElement>['fetchPriority']
  decoding?: 'async' | 'sync' | 'auto'
  className?: string
  objectPosition?: CSSProperties['objectPosition']
}

export function ResponsiveImage({
  src, alt, width, height, sizes, srcSet, loading = 'lazy',
  fetchPriority, decoding = 'async', className, objectPosition,
}: ResponsiveImageProps) {
  return <img
    src={src}
    alt={alt}
    width={width}
    height={height}
    sizes={sizes}
    srcSet={srcSet}
    loading={loading}
    decoding={decoding}
    fetchPriority={fetchPriority}
    className={className}
    style={objectPosition ? { objectPosition } : undefined}
  />
}
