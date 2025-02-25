import React from 'react';
import Link from 'next/link';

interface Document {
  id: string;
  name: string;
  type: string;
  status: string;
  date: string;
}

interface RecentDocumentsProps {
  documents: Document[];
}

const RecentDocuments: React.FC<RecentDocumentsProps> = ({ documents }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Recent Documents</h2>
        <Link href="/documents">
          <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
            View All →
          </span>
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No documents found
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{doc.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      doc.status === 'Processed' 
                        ? 'bg-green-100 text-green-800' 
                        : doc.status === 'Processing' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.date}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentDocuments;