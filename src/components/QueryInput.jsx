import { useState } from "react";

export default function QuerySelector() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);

    function handleInputChange(event) {
        setQuery(event.target.value);
    }
    function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        // Simulate an API call will connect later
    }
  return (
    <div className="flex flex-col items-center w-full px-8 mt-6">
        <div className="w-full max-w-4xl">
            <textarea
                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={query}
                onChange={handleInputChange}
                placeholder="Enter your query here...">    
            </textarea>
            <button 
            onClick={() => handleSubmit()}
            className="mt-4 bg-green-600 text-white font-bold py-2 px-6 rounded hover:bg-green-700 text-left">
                Submit Query
            </button>
        </div>
    </div>
  );
}