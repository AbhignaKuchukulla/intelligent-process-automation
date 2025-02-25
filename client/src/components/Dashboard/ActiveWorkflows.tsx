import React from 'react';
import Link from 'next/link';

interface Workflow {
  id: string;
  name: string;
  type: string;
  lastRun: string;
  nextRun: string;
}

interface ActiveWorkflowsProps {
  workflows: Workflow[];
}

const ActiveWorkflows: React.FC<ActiveWorkflowsProps> = ({ workflows }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Active Workflows</h2>
        <Link href="/workflows">
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
                Last Run
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Next Run
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {workflows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No active workflows
                </td>
              </tr>
            ) : (
              workflows.map((workflow) => (
                <tr key={workflow.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{workflow.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{workflow.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {workflow.lastRun}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {workflow.nextRun}
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

export default ActiveWorkflows;