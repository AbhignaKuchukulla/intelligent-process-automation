import { useState } from 'react';
import { FaFileUpload, FaChartPie, FaCog } from 'react-icons/fa';
import DocumentUploader from '../components/DocumentUploader';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-5 flex flex-col">
        <h2 className="text-2xl font-bold mb-5">Dashboard</h2>
        <nav>
          <button className={`w-full py-2 px-4 my-2 rounded ${activeTab === 'overview' ? 'bg-gray-700' : ''}`} onClick={() => setActiveTab('overview')}>
            <FaChartPie className="inline mr-2" /> Overview
          </button>
          <button className={`w-full py-2 px-4 my-2 rounded ${activeTab === 'upload' ? 'bg-gray-700' : ''}`} onClick={() => setActiveTab('upload')}>
            <FaFileUpload className="inline mr-2" /> Upload Documents
          </button>
          <button className={`w-full py-2 px-4 my-2 rounded ${activeTab === 'settings' ? 'bg-gray-700' : ''}`} onClick={() => setActiveTab('settings')}>
            <FaCog className="inline mr-2" /> Settings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 bg-gray-100">
        {activeTab === 'overview' && (
          <div>
            <h1 className="text-3xl font-bold mb-5">Overview</h1>
            <p>Welcome to your Intelligent Process Automation Dashboard. Here you can track recent activities, upload documents, and configure settings.</p>
          </div>
        )}
        {activeTab === 'upload' && (
          <div>
            <h1 className="text-3xl font-bold mb-5">Upload Documents</h1>
            <DocumentUploader />
          </div>
        )}
        {activeTab === 'settings' && (
          <div>
            <h1 className="text-3xl font-bold mb-5">Settings</h1>
            <p>Customize your workflow automation preferences here.</p>
          </div>
        )}
      </main>
    </div>
  );
}
