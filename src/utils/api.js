// Base configuration for API calls
const API_BASE_URL = 'http://localhost:8005'; // matches the FastAPI server port

/**
 * Submit a new query to the backend
 * @param {string} queryText - The user's query text
 * @returns {Promise<{query_id: string}>} - The query ID from the backend
 */
export async function submitQuery(queryText) {
    try {
        const response = await fetch(`${API_BASE_URL}/query`, { // adjusted endpoint for query submission
            method: 'POST', // use POST for submitting queries
            headers: {
                'Content-Type': 'application/json', // specify JSON content type
            },
            body: JSON.stringify({ text: queryText }) // send the query text in the request body
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error submitting query:', error);
        throw error;
    }
}

/**
 * Fetch the report for a specific query
 * @param {string} queryId - The ID of the query
 * @returns {Promise<Object>} - The report data
 */
export async function fetchReport(queryId) {
    try {
        const response = await fetch(`${API_BASE_URL}/query/${queryId}/report`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType?.includes('text/markdown')) {
            // For markdown, parse into sections
            const markdown = await response.text();
            return {
                sections: parseMarkdownIntoSections(markdown)
            };
        }

        // Handle JSON response with sections
        const data = await response.json();
        return {
            sections: data.sections || {}
        };
    } catch (error) {
        console.error('Error fetching report:', error);
        throw error;
    }
}

/**
 * Parse markdown text into sections
 * @param {string} markdown - The markdown text
 * @returns {Object} - Object with sections
 */
function parseMarkdownIntoSections(markdown) {
    const sections = {};
    const lines = markdown.split('\n');
    let currentSection = null;
    let currentContent = [];

    for (const line of lines) {
        // Check for header (# or ##)
        if (line.startsWith('# ') || line.startsWith('## ')) {
            // Save previous section if it exists
            if (currentSection) {
                sections[currentSection.id] = {
                    title: currentSection.title,
                    content: currentContent.join('\n')
                };
            }

            // Start new section
            const title = line.replace(/^#+ /, '').trim();
            const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            currentSection = { id, title };
            currentContent = [];
        } else if (currentSection) {
            currentContent.push(line);
        }
    }

    // Save the last section
    if (currentSection) {
        sections[currentSection.id] = {
            title: currentSection.title,
            content: currentContent.join('\n')
        };
    }

    return sections;
}

/**
 * Fetch knowledge graph data for a specific query
 * @param {string} queryId - The ID of the query
 * @returns {Promise<{nodes: Array, edges: Array}>}
 */
export async function fetchKnowledgeGraphData(queryId) {
    try {
        const response = await fetch(`${API_BASE_URL}/query/${queryId}/graph-data`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json(); // Should be { nodes: [...], edges: [...] }
    } catch (error) {
        console.error('Error fetching knowledge graph data:', error);
        throw error;
    }
}
