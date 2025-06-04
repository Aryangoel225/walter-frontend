import Header from "./components/Header";
import QueryInput from "./components/QueryInput";
import TabNavigation from "./components/TabNavigation";
import ReportContent from "./components/ReportContent";
import SidebarSections from "./components/SidebarSections";
import { useState } from "react";

function App() {
  const [currentQueryId, setCurrentQueryId] = useState(null);
  const [activeTab, setActiveTab] = useState("report");
  const [isLoading, setIsLoading] = useState(false);
  const [sections, setSections] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [viewAllMode, setViewAllMode] = useState(true);

  // Handle section selection from sidebar
  const handleSectionSelect = (sectionId, isViewAllMode) => {
    if (isViewAllMode) {
      // View All Mode: Just scroll to section in full report
      setSelectedSectionId(null); // Clear any individual selection
      // Scroll will happen after render
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Individual Mode: Show only that section
      setSelectedSectionId(sectionId);
      setViewAllMode(false);
    }
  };

  // Handle View All toggle from sidebar
  const handleViewAllToggle = (isViewAll) => {
    setViewAllMode(isViewAll);
    if (isViewAll) {
      setSelectedSectionId(null); // Clear individual selection
    }
  };

  async function handleQuerySubmit(query) {
    console.log("Submitting query:", query);
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCurrentQueryId(`query_${Date.now()}`);
    setActiveTab("report");

    // Simulate getting sections from API
    setSections([
      { id: "section1", title: "Executive Summary" },
      { id: "section2", title: "Key Findings" },
      { id: "section3", title: "Analysis" },
    ]);

    console.log("Query submitted successfully");
    setIsLoading(false);
  }

  function handleTabChange(newTab) {
    setActiveTab(newTab);
  }

  return (
    <div className="flex min-h-screen">
      {/* SideBar */}
      <div className="w-1/4 bg-green-700 p-4 text-white flex flex-col">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Report Sections</h3>
        </div>
        <SidebarSections
          sections={sections}
          currentQueryId={currentQueryId}
          onSectionSelect={handleSectionSelect}
          onViewAllToggle={handleViewAllToggle}
          viewAllMode={viewAllMode}
          selectedSectionId={selectedSectionId}
        />
      </div>

      {/* Main Content */}
      <div className="w-3/4 bg-gray-50 p-6 flex flex-col items-center">
        <Header />
        <QueryInput onSubmit={handleQuerySubmit} />
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Conditional Tab Content */}
        {activeTab === "report" && (
          <ReportContent
            currentQueryId={currentQueryId}
            isLoading={isLoading}
            sections={sections}              // ← Now passed!
            selectedSectionId={selectedSectionId}  // ← Now passed!
            viewAllMode={viewAllMode}        // ← Now passed!
          />
        )}
        {activeTab === "knowledge-graph" && (
          <div className="text-center text-gray-400 mt-8">
            Knowledge Graph content coming soon...
          </div>
        )}
        {activeTab === "knowledge-gaps" && (
          <div className="text-center text-gray-400 mt-8">
            Knowledge Gaps content coming soon...
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
