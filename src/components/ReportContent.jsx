import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ReportContent({
  currentQueryId,
  isLoading,
  sections = [],
  selectedSectionId = null,
  viewAllMode = true,
  onSectionChange = () => {},
}) {
  // Calculate which sections to render based on view mode - moved before conditionals
  const sectionsToRender = useMemo(() => {
    if (viewAllMode || !selectedSectionId) {
      return sections;
    }
    return sections.filter((section) => section.id === selectedSectionId);
  }, [sections, selectedSectionId, viewAllMode]);

  // No query submitted yet
  if (!currentQueryId) {
    return (
      <div className="text-center text-gray-500 mt-12">
        <p className="text-lg">
          Enter a query above to generate an intelligence report
        </p>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="text-center mt-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700 mx-auto mb-4"></div>
        <p className="text-gray-600">Generating intelligence report...</p>
      </div>
    );
  }

  // Individual section view header
  const renderSectionHeader = () => {
    if (viewAllMode) return null;

    const selectedSection = sections.find((s) => s.id === selectedSectionId);
    if (!selectedSection) return null;

    return (
      <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
        <h1 className="text-xl font-bold text-blue-900 mb-2">
          Individual Section View
        </h1>
        <p className="text-blue-700">
          Viewing: <strong>{selectedSection.title}</strong>
        </p>
        <p className="text-sm text-blue-600 mt-1">
          Switch to "View All Sections" to see the complete report
        </p>
      </div>
    );
  };

  // Report content state
  return (
    <div className="max-w-4xl mx-auto">
      {renderSectionHeader()}

      {/* Report Title - only show in View All mode */}
      {viewAllMode && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Intelligence Report
          </h1>
          <p className="text-gray-600">
            Query ID: {currentQueryId} | Generated:{" "}
            {new Date().toLocaleString()}
          </p>
        </div>
      )}

      {/* Handle case when no sections exist yet */}
      {(!sections || sections.length === 0) && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Intelligence Report
          </h2>
          <div className="text-center text-gray-500 py-8">
            <p>Report sections are being generated...</p>
          </div>
        </div>
      )}

      {/* Render sections */}
      {sectionsToRender.length > 0 && (
        <div className="space-y-8">
          {sectionsToRender.map((section, index) => (
            <div
              key={section.id}
              id={section.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
            >
              {/* Section Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                    {viewAllMode ? index + 1 : "1"}
                  </span>
                  {section.title}
                </h2>
              </div>

              {/* Section Content */}
              <div className="p-6">
                <div className="prose max-w-none">
                  <ReactMarkdown
                    className="text-gray-700 leading-relaxed"
                    remarkPlugins={[remarkGfm]}
                  >
                    {section.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation Footer for Individual Section View */}
      {!viewAllMode && selectedSectionId && sections.length > 1 && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                const currentIndex = sections.findIndex(
                  (s) => s.id === selectedSectionId
                );
                if (currentIndex > 0) {
                  const prevSection = sections[currentIndex - 1];
                  onSectionChange(prevSection.id);
                }
              }}
              disabled={
                sections.findIndex((s) => s.id === selectedSectionId) === 0
              }
              className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
            >
              ← Previous Section
            </button>

            <span className="text-gray-600 font-medium">
              Section{" "}
              {sections.findIndex((s) => s.id === selectedSectionId) + 1} of{" "}
              {sections.length}
            </span>

            <button
              onClick={() => {
                const currentIndex = sections.findIndex(
                  (s) => s.id === selectedSectionId
                );
                if (currentIndex < sections.length - 1) {
                  const nextSection = sections[currentIndex + 1];
                  onSectionChange(nextSection.id);
                }
              }}
              disabled={
                sections.findIndex((s) => s.id === selectedSectionId) ===
                sections.length - 1
              }
              className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
            >
              Next Section →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
