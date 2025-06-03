import { useState } from "react";

export default function QueryInput({onSubmit}) {
  // State to manage the query input and loading state
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    function handleInputChange(event) {
        setQuery(event.target.value);
    }

    async function handleSubmit() {
        // Validation 
        if (!query.trim()) {
            alert("Please enter a query.");
            return;
        }
        setIsLoading(true);

        try{
            // call parents onSubmit function
            if (onSubmit) {
                await onSubmit(query);
            }
        } catch (error) {
             console.error('Error submitting query:', error);
        } finally{
            setIsLoading(false);
        }
    }

  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
            <textarea
                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={query}
                onChange={handleInputChange}
                placeholder="Enter your query here..."
                disabled={isLoading}
                />    
            <button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="mt-4 bg-green-600 text-white font-bold py-2 px-6 rounded hover:bg-green-700 text-left">
               {isLoading ? 'Generating Intelligence...' : 'Generate Intelligence'}
            </button>
    </div>
  );
}