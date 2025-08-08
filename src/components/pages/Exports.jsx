import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import StatusPill from "@/components/molecules/StatusPill";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import exportsService from "@/services/api/exportsService";

const Exports = () => {
  const [exports, setExports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedExport, setSelectedExport] = useState(null);

  useEffect(() => {
    fetchExports();
  }, []);

  const fetchExports = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await exportsService.getAll();
      setExports(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async (exportId) => {
    try {
      await exportsService.retry(exportId);
      toast.success("Export retry initiated");
      fetchExports();
    } catch (err) {
      toast.error("Failed to retry export");
    }
  };

  const handleDelete = async (exportId) => {
    if (window.confirm("Are you sure you want to delete this export?")) {
      try {
        await exportsService.delete(exportId);
        toast.success("Export deleted");
        fetchExports();
      } catch (err) {
        toast.error("Failed to delete export");
      }
    }
  };

  const getDestinationIcon = (destination) => {
    const icons = {
      CSV: "FileText",
      HubSpot: "Database",
      Salesforce: "Cloud", 
      Pipedrive: "TrendingUp",
      Zapier: "Zap"
    };
    return icons[destination] || "Download";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={fetchExports} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Exports
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            View and manage your lead exports
          </p>
        </div>
      </div>

      {exports.length === 0 ? (
        <Empty
          icon="Download"
          title="No exports yet"
          description="Exports will appear here when you export leads to CRM systems or CSV files"
          action={() => {}}
          actionLabel=""
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Export History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Destination
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Records
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Mapping
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {exports.map((exportItem) => (
                    <tr
                      key={exportItem.Id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {format(new Date(exportItem.created_at), "MMM d, yyyy")}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {format(new Date(exportItem.created_at), "h:mm a")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <ApperIcon 
                            name={getDestinationIcon(exportItem.destination)} 
                            className="h-4 w-4 text-gray-400" 
                          />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {exportItem.destination}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {exportItem.record_count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {exportItem.mapping_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusPill status={exportItem.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedExport(exportItem)}
                          >
                            <ApperIcon name="Eye" className="h-4 w-4" />
                          </Button>
                          {exportItem.status === "Error" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRetry(exportItem.Id)}
                            >
                              <ApperIcon name="RotateCcw" className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(exportItem.Id)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <ApperIcon name="Trash2" className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Detail Modal */}
      {selectedExport && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedExport(null)} />
            
            <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Export Details
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {selectedExport.destination} export from {format(new Date(selectedExport.created_at), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedExport(null)}
                >
                  <ApperIcon name="X" className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </label>
                    <div className="mt-1">
                      <StatusPill status={selectedExport.status} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Records
                    </label>
                    <div className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedExport.record_count}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Field Mapping
                  </label>
                  <div className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedExport.mapping_name}
                  </div>
                </div>

                {selectedExport.status === "Error" && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="AlertCircle" className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <span className="text-sm font-medium text-red-800 dark:text-red-200">
                        Export Failed (Demo)
                      </span>
                    </div>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      This is a simulated error for demonstration purposes.
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Sample Records (5 of {selectedExport.record_count})
                  </h4>
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <div>• Jordan Blake - SDR Manager at CloudNova</div>
                    <div>• Priya Shah - Head of Sales Development at FinPilot</div>
                    <div>• Leo Martínez - RevOps Lead at GrowthForge</div>
                    <div>• Sarah Chen - VP of Sales at TechFlow</div>
                    <div>• Marcus Johnson - Sales Development Representative at DataSync</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-2">
                {selectedExport.status === "Error" && (
                  <Button
                    variant="outline"
                    onClick={() => handleRetry(selectedExport.Id)}
                  >
                    <ApperIcon name="RotateCcw" className="mr-2 h-4 w-4" />
                    Retry Export
                  </Button>
                )}
                <Button onClick={() => setSelectedExport(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exports;