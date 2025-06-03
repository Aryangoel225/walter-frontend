const TABS = [
  { id: "report", label: "Report" },
  { id: "knowledge-graph", label: "Knowledge Graph" },
  { id: "knowledge-gaps", label: "Knowledge Gaps" },
];

export default function TabNavigation({ activeTab, onTabChange }) {
  return (
    <div className="flex border-b border-gray-300 mb-6">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors duration-200 ${
            activeTab === tab.id
              ? "border-green-700 text-green-700 bg-green-50"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
