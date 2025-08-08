import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";

const Integrations = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedConnector, setSelectedConnector] = useState(null);

  const connectors = [
    {
      name: "HubSpot",
      icon: "Database",
      description: "Sync leads directly to your HubSpot CRM with custom field mapping",
      status: "Not Connected",
      color: "orange"
    },
    {
      name: "Salesforce",
      icon: "Cloud",
      description: "Export leads to Salesforce with automated lead assignment rules",
      status: "Not Connected", 
      color: "blue"
    },
    {
      name: "Pipedrive",
      icon: "TrendingUp",
      description: "Create deals and contacts in Pipedrive with custom stages",
      status: "Not Connected",
      color: "green"
    },
    {
      name: "Zapier",
      icon: "Zap",
      description: "Connect to 3000+ apps through Zapier automation workflows",
      status: "Not Connected",
      color: "orange"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Connected":
        return "success";
      case "Error":
        return "error";
      default:
        return "secondary";
    }
  };

  const handleConnect = (connector) => {
    setSelectedConnector(connector);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Integrations
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Connect Siftin to your favorite CRM and automation tools
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {connectors.map((connector) => (
          <Card key={connector.name} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`h-12 w-12 rounded-lg bg-${connector.color}-100 dark:bg-${connector.color}-900/20 flex items-center justify-center`}>
                    <ApperIcon 
                      name={connector.icon} 
                      className={`h-6 w-6 text-${connector.color}-600 dark:text-${connector.color}-400`} 
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{connector.name}</CardTitle>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        connector.status === "Connected" 
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                      }`}>
                        {connector.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {connector.description}
              </p>
              <Button 
                onClick={() => handleConnect(connector)}
                className="w-full"
                variant={connector.status === "Connected" ? "outline" : "default"}
              >
                {connector.status === "Connected" ? "Manage Connection" : "Connect"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Connection Modal */}
      {showModal && selectedConnector && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)} />
            
            <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`h-10 w-10 rounded-lg bg-${selectedConnector.color}-100 dark:bg-${selectedConnector.color}-900/20 flex items-center justify-center`}>
                    <ApperIcon 
                      name={selectedConnector.icon} 
                      className={`h-5 w-5 text-${selectedConnector.color}-600 dark:text-${selectedConnector.color}-400`} 
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Connect {selectedConnector.name}
                    </h3>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowModal(false)}
                >
                  <ApperIcon name="X" className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Info" className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Demo Mode Only
                    </span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    This is a UI prototype. Real authentication and API connections are not functional.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      API Key / Connection Method
                    </label>
                    <input
                      type="password"
                      disabled
                      placeholder="Enter your API key..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    />
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      What you can do with {selectedConnector.name}:
                    </h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Auto-sync captured leads</li>
                      <li>• Custom field mapping</li>
                      <li>• Real-time status updates</li>
                      <li>• Automated workflows</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button disabled>
                  Connect (Demo Only)
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Integrations;