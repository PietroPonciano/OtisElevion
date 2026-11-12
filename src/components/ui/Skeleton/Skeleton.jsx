function Skeleton({ width, height = '1rem', className }) {
  return (
    <span
      className={`ui-skeleton ${className || ''}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  )
}
export default Skeleton
