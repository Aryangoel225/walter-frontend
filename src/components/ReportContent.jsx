
export default function ReportContent({ currentQueryId, isLoading }) {
  // No query submitted yet
  if (!currentQueryId) {
    return (
      <div className="text-center text-gray-500 mt-12">
        <p className="text-lg">Enter a query above to generate an intelligence report</p>
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

  // Report content state
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Intelligence Report</h2>
        <div className="prose max-w-none">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Executive Summary</h3>
          <p className="text-gray-600 mb-4">
            This is a mock intelligence report generated for query ID: {currentQueryId}
          </p>
          
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Key Findings</h3>
          <ul className="list-disc list-inside text-gray-600 mb-4">
            <li>Sample finding 1</li>
            <li>Sample finding 2</li>
            <li>Sample finding 3</li>
          </ul>
          
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Analysis</h3>
          <p className="text-gray-600">
            Detailed analysis content would appear here in a real implementation.
          </p>
        </div>
      </div>

<div className="space-y-4">
  {Array.from({length: 20}, (_, i) => (
    <div key={i} className="bg-white p-4 rounded border">
      <h4 className="font-semibold">Section {i + 1}</h4>
      <p className="text-gray-600">This is test content to make the page scroll...</p>
    </div>
  ))}
</div>
    </div>
  );
}