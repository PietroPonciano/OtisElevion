function Progress({ value, label }) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div
      className="ui-progress"
      aria-label={label}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={clamped}
      role="progressbar"
    >
      <div style={{ width: `${clamped}%` }} />
    </div>
  )
}
export default Progress
