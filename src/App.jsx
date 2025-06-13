import Header from "./components/Header";
import QueryInput from "./components/QueryInput";
import TabNavigation from "./components/TabNavigation";
import ReportContent from "./components/ReportContent";
import SidebarSections from "./components/SidebarSections";
import QueryHistory from "./components/QueryHistory";
import KnowledgeGraphView from "./components/KnowledgeGraphView";
import KnowledgeGapsView from "./components/KnowledgeGapsView";
import { useState, useEffect } from "react";
import { submitQuery, fetchReport, fetchKnowledgeGraphData, fetchKnowledgeGaps } from "./utils/api";

function App() {
  const [currentQueryId, setCurrentQueryId] = useState(null);
  const [activeTab, setActiveTab] = useState("report");
  const [isLoading, setIsLoading] = useState(false);
  const [sections, setSections] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [viewAllMode, setViewAllMode] = useState(true);
  const [queryHistory, setQueryHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Knowledge graph state
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [isGraphLoading, setIsGraphLoading] = useState(false);
  const [graphError, setGraphError] = useState(null);
  // knowledge gaps state
  const [knowledgeGaps, setKnowledgeGaps] = useState({gaps: [], follow_up_queries: [] });
  const [isGapsLoading, setIsGapsLoading] = useState(false);
  const [gapsError, setGapsError] = useState(null);

  // Fetch report when currentQueryId changes

  useEffect(() => {
    if (!currentQueryId) return;

    setIsLoading(true);
    setSections([]); // Clear previous sections

    fetchReport(currentQueryId)
      .then((data) => {
        // data.sections is an object, convert to array with id prop
        const sectionsArray = Object.entries(data.sections).map(
          ([id, section]) => ({
            id,
            title: section.title,
            content: section.content,
          })
        );

        setSections(sectionsArray);
        setSelectedSectionId(
          sectionsArray.length > 0 ? sectionsArray[0].id : null
        );
      })
      .catch((error) => {
        console.error("Failed to fetch report:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentQueryId]);

  // Fetch knowledge graph data when tab or query changes
  useEffect(() => {
    if (activeTab === "knowledge-graph" && currentQueryId) {
      setIsGraphLoading(true);
      setGraphError(null);
      setGraphData({ nodes: [], edges: [] });
      fetchKnowledgeGraphData(currentQueryId)
        .then((data) => {
          // Defensive: handle both {nodes, edges} and {nodes, relationships}
          setGraphData({
            nodes: data.nodes || [],
            edges: data.edges || data.relationships || [],
          });
        })
        .catch((err) => {
          setGraphError(err.message || "Failed to load graph data");
        })
        .finally(() => setIsGraphLoading(false));
    }
  }, [activeTab, currentQueryId]);


  // Fetch knowledge graph data when tab or query changes
  useEffect(() => {
  if (activeTab === "knowledge-gaps" && currentQueryId) {
    setIsGapsLoading(true);
    setGapsError(null);
    setKnowledgeGaps({ gaps: [], follow_up_queries: [] });
    fetchKnowledgeGaps(currentQueryId)
      .then((data) => {
        // Defensive: handle both {gaps, follow_up_queries}
        setKnowledgeGaps({
          gaps: data.gaps || [],
          follow_up_queries: data.follow_up_queries || [],
        });
      })
      .catch((err) => {
        setGapsError(err.message || "Failed to load knowledge gaps data");
      })
      .finally(() => setIsGapsLoading(false));
  }
}, [activeTab, currentQueryId]);

  // Fetch knowledge gaps data when tab or query changes
  useEffect(() => {
    if (activeTab === "knowledge-gaps" && currentQueryId) {
      setIsGapsLoading(true);
      setGapsError(null);
      setKnowledgeGaps({ gaps: [], follow_up_queries: [] });
      fetchKnowledgeGaps(currentQueryId)
        .then((data) => {
          // Defensive: handle both {gaps, follow_up_queries}
          setKnowledgeGaps({
            knowledgeGaps: data.gaps || [],
            follow_up_queries: data.follow_up_queries || [],
          });
        })
        .catch((err) => {
          setGapsError(err.message || "Failed to load gapsError data");
        })
        .finally(() => setIsGraphLoading(false));
    }
  }, [activeTab, currentQueryId]);

  // Handle section selection from sidebar
  const handleSectionSelect = (sectionId, isViewAllMode) => {
    if (isViewAllMode) {
      setViewAllMode(true);
      setSelectedSectionId(sectionId); // ← Keep track for scroll position
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      setSelectedSectionId(sectionId);
      setViewAllMode(false);
    }
  };

  const handleViewAllToggle = (isViewAll) => {
    setViewAllMode(isViewAll);
    if (!isViewAll && sections.length > 0 && !selectedSectionId) {
      // Auto-select first section when switching to individual mode
      setSelectedSectionId(sections[0].id);
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
          content: section.content || "",
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
          <div className="w-full max-w-3xl mx-auto mt-8">
            {isGraphLoading ? (
              <div className="text-center text-gray-400">
                Loading knowledge graph...
              </div>
            ) : graphError ? (
              <div className="text-center text-red-500">{graphError}</div>
            ) : graphData.nodes.length === 0 ? (
              <div className="text-center text-gray-400">
                No graph data available for this query yet.
              </div>
            ) : (
              <KnowledgeGraphView
                nodes={graphData.nodes}
                edges={graphData.edges}
              />
            )}
          </div>
        )}
        {activeTab === "knowledge-gaps" && (
          <div className="w-full max-w-3xl mx-auto mt-8">
            {isGapsLoading ? (
              <div className="text-center text-gray-400">
                Loading knowledge gaps...
              </div>
            ) : gapsError ? (
              <div className="text-center text-red-500">{gapsError}</div>
            ) : (
              <KnowledgeGapsView
                gaps={knowledgeGaps.gaps}
                follow_up_queries={knowledgeGaps.follow_up_queries}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;


