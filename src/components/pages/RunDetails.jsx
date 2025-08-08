import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import StatusPill from "@/components/molecules/StatusPill";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import runsService from "@/services/api/runsService";
import leadsService from "@/services/api/leadsService";

const RunDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [run, setRun] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchRunDetails();
    }
  }, [id]);

  const fetchRunDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const runData = await runsService.getById(id);
      setRun(runData);
      
      // Fetch sample leads for display
      const allLeads = await leadsService.getAll();
      const sampleLeads = allLeads.slice(0, runData.found_count || 5);
      setLeads(sampleLeads);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReOpenAsDraft = async () => {
    try {
      const duplicated = await runsService.duplicate(id);
      navigate(`/runs/${duplicated.Id}`);
    } catch (err) {
      console.error("Failed to duplicate run:", err);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={fetchRunDetails} />;
  if (!run) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/runs")}
          >
            <ApperIcon name="ArrowLeft" className="mr-2 h-4 w-4" />
            Back to Runs
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {run.label}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Created {format(new Date(run.created_at), "MMM d, yyyy 'at' h:mm a")} by {run.created_by}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <StatusPill status={run.status} />
          <Button onClick={handleReOpenAsDraft}>
            Re-open as Draft
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {run.found_count}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Selected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {run.selected_count}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Selection Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {run.found_count > 0 ? Math.round((run.selected_count / run.found_count) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Run Details */}
      <Card>
        <CardHeader>
          <CardTitle>Run Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Source URL
            </label>
            <div className="mt-1">
              <a
                href={run.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 break-all"
              >
                {run.source_url}
              </a>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              AI Criteria
            </label>
            <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-900 dark:text-white">
                {run.criteria_text}
              </p>
            </div>
          </div>

          {run.status === "Failed" && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <ApperIcon name="AlertCircle" className="h-5 w-5 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-red-800 dark:text-red-200">
                  Run Failed (Demo)
                </span>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                This is a simulated failure for demonstration purposes. In the actual app, this would show real error details.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sample Results */}
      {run.status === "Completed" && leads.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Preview Results</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {leads.length} of {run.found_count} found leads
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leads.map((lead, index) => (
                <div
                  key={lead.Id}
                  className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <img
                    src={lead.profile_img}
                    alt={lead.full_name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900 dark:text-white truncate">
                        {lead.full_name}
                      </h4>
                      <div className="text-xs bg-accent-400 text-gray-900 px-2 py-0.5 rounded-full font-medium">
                        {lead.match_score}%
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {lead.headline}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {lead.location}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RunDetails;