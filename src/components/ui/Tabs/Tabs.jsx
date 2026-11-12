function Tabs({ tabs, activeId, onChange }) {
  return (
    <div className="ui-tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          type="button"
          aria-selected={activeId === tab.id}
          className={activeId === tab.id ? 'active' : ''}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
export default Tabs
