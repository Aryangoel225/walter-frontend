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
      {/* Sections Header */}
      <div className="cursor-pointer flex items-center text-white hover:bg-green-600 px-2 py-1 rounded">
        <span className="mr-2">▼</span>
        <span>Sections</span>
      </div>

      {/* View All Button with Toggle */}
      <button
        onClick={() => onViewAllToggle(!viewAllMode)} // ← Call parent callback
        className={`w-full text-left px-3 py-2 text-sm text-white rounded transition-colors duration-200 flex items-center justify-between ${
          viewAllMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'
        }`}
      >
        <span>View All Sections</span>
        <span>{viewAllMode ? '✓' : ''}</span>
      </button>

      {/* Individual Section Buttons */}
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onSectionSelect(section.id, viewAllMode)} // ← Call parent callback
          className={`w-full text-left px-3 py-2 text-sm text-white rounded transition-colors duration-200 ${
            !viewAllMode && selectedSectionId === section.id 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'hover:bg-green-600'
          }`}
        >
          {section.title}
          {!viewAllMode && selectedSectionId === section.id && (
            <span className="float-right">✓</span>
          )}
        </button>
      ))}

      {/* Helper Text */}
      <div className="text-xs opacity-75 px-3 py-2">
        {viewAllMode 
          ? "Click on sections above to scroll to them in the full report" 
          : "Click on a section to view it individually, or toggle 'View All' for the complete report"
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

  
