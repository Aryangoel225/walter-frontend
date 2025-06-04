import { useState } from "react";

// Utility: truncate long query titles
const truncate = (text, max = 20) =>
  text.length > max ? text.slice(0, max) + "..." : text;

// Utility: format timestamp
const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });

export default function QueryHistory({
  queryArray = [],
  onQuerySelect,
  currentQueryId,
  onQueryDelete,
}) {
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

  const renderEmptyState = () => (
    <div className="space-y-1">
      <div
        onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
        className="cursor-pointer flex items-center text-white hover:bg-green-600 px-2 py-1 rounded"
      >
        <span className="mr-2">{isHistoryExpanded ? "▼" : "▶"}</span>
        <span>Query History</span>
      </div>
      {isHistoryExpanded && (
        <div className="text-sm italic opacity-75 ml-6">
          No Query History yet
        </div>
      )}
    </div>
  );

  const renderWithData = () => (
    <div className="space-y-1">
      {/* Header */}
      <div
        onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
        className="cursor-pointer flex items-center text-white hover:bg-green-600 px-2 py-1 rounded"
      >
        <span className="mr-2">{isHistoryExpanded ? "▼" : "▶"}</span>
        <span>Query History</span>
      </div>

      {/* Query List */}
      {isHistoryExpanded && (
        <div className="ml-4 mt-2 space-y-1">
          {queryArray.map((query) => {
            const isActive = currentQueryId === query.id;
            return (
              <div
                key={query.id}
                className={`flex items-center justify-between rounded px-2 py-1 ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-green-600 text-white"
                }`}
              >
                <button
                  onClick={() => onQuerySelect(query.id)}
                  className="text-left flex-1 text-sm truncate"
                  title={query.title}
                >
                  <div className="font-medium">
                    {isActive ? "🟢 " : ""}
                    {truncate(query.title)}
                  </div>
                  <div className="text-xs opacity-75">
                    {formatDate(query.date)}
                  </div>
                </button>

                {onQueryDelete && (
                  <button
                    onClick={() => onQueryDelete(query.id)}
                    className="ml-2 text-xs text-red-300 hover:text-red-500"
                    title="Delete query"
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // Render based on data
  return (
    <div className="flex-1">
      {queryArray.length === 0 ? renderEmptyState() : renderWithData()}
    </div>
  );
}
