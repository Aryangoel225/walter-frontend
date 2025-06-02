import Header from "./components/Header";
import QueryInput from "./components/QueryInput";
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
          <div className="w-3/4 bg-gray-50 p-6 flex flex-col items-center">
            <Header/>
            {/* Rest of main content will go here */}
              <div className="text-gray-400">
                <QueryInput/>
                Main content components will go here
              </div>
          </div>
        </div>
  );
}

export default App;