import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import StatusPill from "@/components/molecules/StatusPill";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import runsService from "@/services/api/runsService";

const Runs = () => {
  const navigate = useNavigate();
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRuns();
  }, []);

  const fetchRuns = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await runsService.getAll();
      setRuns(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRun = (runId) => {
    navigate(`/runs/${runId}`);
  };

  const handleDuplicate = async (runId) => {
    try {
      await runsService.duplicate(runId);
      toast.success("Run duplicated successfully!");
      fetchRuns();
    } catch (err) {
      toast.error("Failed to duplicate run");
    }
  };

  const handleDelete = async (runId) => {
    if (window.confirm("Are you sure you want to delete this run?")) {
      try {
        await runsService.delete(runId);
        toast.success("Run deleted successfully!");
        fetchRuns();
      } catch (err) {
        toast.error("Failed to delete run");
      }
    }
  };

  const truncateUrl = (url, maxLength = 50) => {
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={fetchRuns} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Runs
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            View and manage your LinkedIn capture runs
          </p>
        </div>
        <Button onClick={() => navigate("/new-capture")}>
          <ApperIcon name="Plus" className="mr-2 h-4 w-4" />
          New Capture
        </Button>
      </div>

      {runs.length === 0 ? (
        <Empty
          icon="Play"
          title="No runs yet"
          description="Create your first LinkedIn capture run to get started with lead generation"
          action={() => navigate("/new-capture")}
          actionLabel="Create First Run"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Runs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Label
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Source URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Found/Selected
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {runs.map((run) => (
                    <tr
                      key={run.Id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                      onClick={() => handleViewRun(run.Id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {run.label}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 max-w-md truncate">
                          {run.criteria_text}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {format(new Date(run.created_at), "MMM d, yyyy")}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {format(new Date(run.created_at), "h:mm a")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate" title={run.source_url}>
                          {truncateUrl(run.source_url)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusPill status={run.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {run.found_count} / {run.selected_count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewRun(run.Id);
                            }}
                          >
                            <ApperIcon name="Eye" className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicate(run.Id);
                            }}
                          >
                            <ApperIcon name="Copy" className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(run.Id);
                            }}
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
    </div>
  );
};

export default Runs;