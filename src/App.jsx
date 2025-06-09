import Header from "./components/Header";
import QueryInput from "./components/QueryInput";
import TabNavigation from "./components/TabNavigation";
import ReportContent from "./components/ReportContent";
import SidebarSections from "./components/SidebarSections";
import QueryHistory from "./components/QueryHistory";
import { useState } from "react";

function App() {
  const [currentQueryId, setCurrentQueryId] = useState(null);
  const [activeTab, setActiveTab] = useState("report");
  const [isLoading, setIsLoading] = useState(false);
  const [sections, setSections] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [viewAllMode, setViewAllMode] = useState(true);
  const [queryHistory, setQueryHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Handle section selection from sidebar
  const handleSectionSelect = (sectionId, isViewAllMode) => {
    if (isViewAllMode) {
      // View All Mode: Just scroll to section in full report
      setSelectedSectionId(null); // Clear any individual selection
      // Scroll will happen after render
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
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

    const id = `query_${Date.now()}`; // Generate once
    const newQuery = {
      id,
      title: query,
      date: new Date().toISOString(),
    };

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setQueryHistory((prev) => [newQuery, ...prev]);
    setCurrentQueryId(id);
    setActiveTab("report");

    setSections([
      { id: "section1", title: "Executive Summary" },
      { id: "section2", title: "Key Findings" },
      { id: "section3", title: "Analysis" },
    ]);

    // Add a notification when query is complete
    const newNotification = {
      id: `notification_${Date.now()}`,
      title: "Query Complete",
      message: `Analysis complete for: ${query}`,
      priority: "needed", // or could be "urgent", "minor"
      isRead: false,
      timestamp: Date.now(),
      source: "Query Engine",
      queryId: id, // This is the queryId generated for the query
    };

    setNotifications((prev) => [newNotification, ...prev]);

    console.log("Query submitted successfully");
    setIsLoading(false);
  }

  function handleTabChange(newTab) {
    setActiveTab(newTab);
  }

  function handleQuerySelect(queryId) {
    setCurrentQueryId(queryId);
    setActiveTab("report");
    setSelectedSectionId(null);
  }

  function handleQueryDelete(queryId) {
    setQueryHistory((prev) => prev.filter((q) => q.id !== queryId));
    // If user deletes the currently active query, reset it
    if (queryId === currentQueryId) {
      setCurrentQueryId(null);
    }
  }
  // handle clicking a notification:
  const handleNotificationClick = (notification) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
  };
  // handle marking all notifications as read
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };
  // Handle rerunning a query from notification
  const handleQueryRerun = (queryId) => {
    // Find the query in history and rerun it
    const query = queryHistory.find((q) => q.id === queryId);
    if (query) {
      handleQuerySubmit(query.title);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* SideBar */}
      <div className="w-1/4 bg-green-700 p-4 text-white flex flex-col">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Report Sections</h3>
        </div>
        {/* Add margin bottom to create space between sections */}
        <div className="mb-6">
          <SidebarSections
            sections={sections}
            currentQueryId={currentQueryId}
            onSectionSelect={handleSectionSelect}
            onViewAllToggle={handleViewAllToggle}
            viewAllMode={viewAllMode}
            selectedSectionId={selectedSectionId}
          />
        </div>
        <QueryHistory
          queryArray={queryHistory}
          onQuerySelect={handleQuerySelect}
          currentQueryId={currentQueryId}
          onQueryDelete={handleQueryDelete}
        />
      </div>

      {/* Main Content */}
      <div className="w-3/4 bg-gray-50 p-6 flex flex-col items-center">
        <Header
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
          onMarkAllRead={handleMarkAllRead}
          onQueryRerun={handleQueryRerun}
        />
        <QueryInput onSubmit={handleQuerySubmit} />
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Conditional Tab Content */}
        {activeTab === "report" && (
          <ReportContent
            currentQueryId={currentQueryId}
            isLoading={isLoading}
            sections={sections} // ← Now passed!
            selectedSectionId={selectedSectionId} // ← Now passed!
            viewAllMode={viewAllMode} // ← Now passed!
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
