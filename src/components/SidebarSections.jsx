import { useState } from "react";

export default function SidebarSections({
  sections = [],
  currentQueryId = null,
  viewAllMode = true,       
  selectedSectionId = null,
  onSectionSelect,          
  onViewAllToggle,        
}) {
  const [isSectionsExpanded, setIsSectionsExpanded] = useState(false);

  const renderEmptyState = () => (
    <div className="space-y-1">
      <div 
        onClick={() => setIsSectionsExpanded(!isSectionsExpanded)}
        className="cursor-pointer flex items-center text-white hover:bg-green-600 px-2 py-1 rounded"
      >
        <span className="mr-2">{isSectionsExpanded ? "▼" : "▶"}</span>
        <span>Sections</span>
      </div>
      {isSectionsExpanded && (
        <div className="text-sm italic opacity-75 ml-6">
          Sections will appear here when a report is generated.
        </div>
      )}
    </div>
  );

  const renderWithData = () => (
    <div className="space-y-1">
      {/* Sections Header - Always expanded when data exists */}
      <div className="flex items-center text-white px-2 py-1">
        <span className="mr-2">▼</span>
        <span>Sections</span>
      </div>

      {/* View Mode Toggle Buttons */}
      <div className="space-y-1">
        <button
          onClick={() => onViewAllToggle(true)}
          className={`w-full text-left px-3 py-2 text-sm text-white rounded transition-colors duration-200 flex items-center justify-between ${
            viewAllMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'
          }`}
        >
          <span>View All Sections</span>
          <span>{viewAllMode ? '✓' : ''}</span>
        </button>

        <button
          onClick={() => onViewAllToggle(false)}
          className={`w-full text-left px-3 py-2 text-sm text-white rounded transition-colors duration-200 flex items-center justify-between ${
            !viewAllMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'
          }`}
        >
          <span>View Individual Sections</span>
          <span>{!viewAllMode ? '✓' : ''}</span>
        </button>
      </div>

      {/* Individual Section Buttons */}
      <div className="mt-2 space-y-1">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => onSectionSelect(section.id, false)} // Always pass false for individual mode
            className={`w-full text-left px-3 py-2 text-sm text-white rounded transition-colors duration-200 ${
              !viewAllMode && selectedSectionId === section.id 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'hover:bg-green-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{section.title}</span>
              <div className="flex items-center">
                <span className="text-xs opacity-75 mr-2">{index + 1}</span>
                {!viewAllMode && selectedSectionId === section.id && (
                  <span>✓</span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Current Mode Indicator */}
      <div className="mt-3 px-3 py-2 bg-green-800 rounded text-xs">
        <div className="font-medium mb-1">Current Mode:</div>
        <div>
          {viewAllMode 
            ? "Viewing all sections together" 
            : `Individual: ${sections.find(s => s.id === selectedSectionId)?.title || 'None selected'}`
          }
        </div>
      </div>

      {/* Helper Text */}
      <div className="text-xs opacity-75 px-3 py-2">
        {viewAllMode 
          ? "Click sections above to scroll to them in the full report" 
          : "Click a different section to view it individually"
        }
      </div>
    </div>
  );

  // Render based on state
  if (!currentQueryId || !sections || sections.length === 0) {
    return <div className="flex-1">{renderEmptyState()}</div>;
  }

  return <div className="flex-1">{renderWithData()}</div>;
}

  
