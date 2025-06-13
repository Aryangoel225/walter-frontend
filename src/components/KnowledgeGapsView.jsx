import React, { useEffect, useRef } from "react";

// Simple content report of the gaps of knowledge and follow_up_queries
function KnowledgeGapsView({ gaps, follow_up_queries }) {

  useEffect(() => {
    if (gaps && follow_up_queries) {
      console.log("Knowledge Gaps Data:", { gaps, follow_up_queries });
    }
  }, [gaps, follow_up_queries]);

  // Zip gaps and follow-up queries and handle different lengths
  const maxLength = Math.max(gaps.length, follow_up_queries.length);
  const combined = Array.from({ length: maxLength }, (_, i) => ({
    gap: gaps[i] || "(no gap)",
    query: follow_up_queries[i] || "(no query)"
  }));
  
   return (
    <div style={{
      maxWidth: "800px",
      margin: "2rem auto",
      padding: "2rem",
      backgroundColor: "#f9f9f9",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      fontFamily: "Arial, sans-serif"
    }}>
      <h2 style={{
        borderBottom: "2px solid #333",
        paddingBottom: "0.5rem",
        marginBottom: "1.5rem"
      }}>Knowledge Gaps Report</h2>

      {combined.map((item, index) => (
        <div key={index} style={{
          marginBottom: "1.5rem",
          padding: "1rem",
          backgroundColor: "#ffffff",
          border: "1px solid #ddd",
          borderRadius: "8px"
        }}>
          <p><strong>Gap:</strong> {item.gap}</p>
          <p><strong>Follow-up Query:</strong> {item.query}</p>
        </div>
      ))}
    </div>
  );
}

export default KnowledgeGapsView;
