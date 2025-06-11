import Header from "./components/Header";
import QueryInput from "./components/QueryInput";
import TabNavigation from "./components/TabNavigation";
import ReportContent from "./components/ReportContent";
import SidebarSections from "./components/SidebarSections";
import QueryHistory from "./components/QueryHistory";
import { useState, useEffect } from "react";
import { submitQuery, fetchReport } from "./utils/api";

function App() {
  const [currentQueryId, setCurrentQueryId] = useState(null);
  const [activeTab, setActiveTab] = useState("report");
  const [isLoading, setIsLoading] = useState(false);
  const [sections, setSections] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [viewAllMode, setViewAllMode] = useState(true);
  const [queryHistory, setQueryHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Fetch report when currentQueryId changes
  useEffect(() => {
    if (!currentQueryId) return;

    setIsLoading(true);
    setSections([]); // Clear previous sections

    fetchReport(currentQueryId)
      .then((data) => {
        // data.sections is an object, convert to array with id prop
        const sectionsArray = Object.entries(data.sections).map(([id, section]) => ({
          id,
          title: section.title,
          content: section.content,
        }));

        setSections(sectionsArray);
        setSelectedSectionId(sectionsArray.length > 0 ? sectionsArray[0].id : null);
      })
      .catch((error) => {
        console.error("Failed to fetch report:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentQueryId]);

  // Handle section selection from sidebar
  const handleSectionSelect = (sectionId, isViewAllMode) => {
    if (isViewAllMode) {
      // View All Mode: Just scroll to section in full report
      setSelectedSectionId(null); // Clear any individual selection
      setViewAllMode(true);
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

    try {
      // Submit query to backend and get query ID
      const { query_id } = await submitQuery(query);

      // Create query history entry
      const newQuery = {
        id: query_id,
        title: query,
        date: new Date().toISOString(),
      };

      // Update UI state
      setQueryHistory((prev) => [newQuery, ...prev]);
      setCurrentQueryId(query_id);
      setActiveTab("report");

      // Fetch the initial report
      const reportData = await fetchReport(query_id);

      // Parse sections from the report data
      const reportSections = Object.entries(reportData.sections || {}).map(
        ([id, section]) => ({
          id,
          title: section.title || id,
          content: section.content || ''
        })
      );
      setSections(reportSections);

       // Add success notification
      const newNotification = {
        id: `notification_${Date.now()}`,
        title: "Query Complete",
        message: `Analysis complete for: ${query}`,
        priority: "needed",
        isRead: false,
        timestamp: Date.now(),
        source: "Query Engine",
        queryId: query_id,
      };
      setNotifications((prev) => [newNotification, ...prev]);
    } catch (error) {
      console.error("Error processing query:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSectionChange = (newSectionId) => {
    setSelectedSectionId(newSectionId);
    setViewAllMode(false);
  };

  function handleTabChange(newTab) {
    setActiveTab(newTab);
  }

  function handleQuerySelect(queryId) {
    setCurrentQueryId(queryId);
    setActiveTab("report");
    setSelectedSectionId(null);
    setViewAllMode(true);
  }

  function handleQueryDelete(queryId) {
    setQueryHistory((prev) => prev.filter((q) => q.id !== queryId));
    // If user deletes the currently active query, reset it
    if (queryId === currentQueryId) {
      setCurrentQueryId(null);
      setSections([]);
      setSelectedSectionId(null);
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
            sections={sections}
            selectedSectionId={selectedSectionId}
            viewAllMode={viewAllMode}
            onSectionChange={handleSectionChange}
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