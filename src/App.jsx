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
    console.log({ currentQueryId });
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
        <SidebarSections sections={sections} currentQueryId={currentQueryId} />
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
