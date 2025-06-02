import Header from "./components/Header";
import { useState } from "react";


function App() {
  const [currentQueryId, setCurrentQueryId] = useState(null);
  const [activeTab, setActiveTab] = useState('report');

  return (
    <div className="flex h-screen">
      {/* SideBar */}
        <div className="w-1/4 bg-green-700 p-4 text-white">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Report Sections</h3>
          </div>
          <div className="text-sm italic opacity-75">
            Sections will appear here when a report is generated.
          </div>
        </div>

         {/* Main Content */}
          <div className="w-3/4 bg-gray-50 p-6">

            <div className="flex justify-center mb-4">
              <h1 className="text-4xl font-bold text-green-700 mb-2">
                  Continuous Intelligence Generator
              </h1>
               <p className="text-gray-600">
                Enter your intelligence query below
              </p>
            </div>
            {/* Rest of main content will go here */}
              <div className="text-center text-gray-400">
                Main content components will go here
              </div>
          </div>
        </div>
  );
}

export default App;