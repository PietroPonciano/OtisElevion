function Tooltip({ label, children }) {
  return (
    <span className="ui-tooltip" tabIndex="0">
      {children}
      <span role="tooltip">{label}</span>
    </span>
  )
}
export default Tooltip
