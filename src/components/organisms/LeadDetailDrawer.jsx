import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import MatchScore from "@/components/molecules/MatchScore";
import StatusPill from "@/components/molecules/StatusPill";
import leadsService from "@/services/api/leadsService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const LeadDetailDrawer = ({ leadId, isOpen, onClose }) => {
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [notes, setNotes] = useState("");
  const [newTag, setNewTag] = useState("");

  const tabs = [
    { id: "overview", label: "Overview", icon: "User" },
    { id: "enrichment", label: "Enrichment", icon: "Search" },
    { id: "activity", label: "Activity", icon: "Clock" },
    { id: "fields", label: "Fields", icon: "Settings" },
  ];

  useEffect(() => {
    if (isOpen && leadId) {
      fetchLead();
    }
  }, [isOpen, leadId]);

  const fetchLead = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await leadsService.getById(leadId);
      setLead(data);
      setNotes(data.notes || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!notes.trim()) return;
    
    try {
      await leadsService.update(leadId, { notes });
      setLead(prev => ({ ...prev, notes }));
    } catch (err) {
      console.error("Failed to save note:", err);
    }
  };

  const handleAddTag = async () => {
    if (!newTag.trim() || lead.tags.includes(newTag)) return;
    
    try {
      const updatedTags = [...lead.tags, newTag];
      await leadsService.update(leadId, { tags: updatedTags });
      setLead(prev => ({ ...prev, tags: updatedTags }));
      setNewTag("");
    } catch (err) {
      console.error("Failed to add tag:", err);
    }
  };

  const handleRemoveTag = async (tagToRemove) => {
    try {
      const updatedTags = lead.tags.filter(tag => tag !== tagToRemove);
      await leadsService.update(leadId, { tags: updatedTags });
      setLead(prev => ({ ...prev, tags: updatedTags }));
    } catch (err) {
      console.error("Failed to remove tag:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        
        {/* Drawer */}
        <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-gray-900 shadow-xl">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Lead Details
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <ApperIcon name="X" className="h-5 w-5" />
              </Button>
            </div>

            {loading && (
              <div className="p-6">
                <Loading rows={3} />
              </div>
            )}

            {error && (
              <div className="p-6">
                <Error message={error} onRetry={fetchLead} />
              </div>
            )}

            {lead && (
              <>
                {/* Lead Header */}
                <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={lead.profile_img}
                      alt={lead.full_name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {lead.full_name}
                        </h3>
                        <MatchScore score={lead.match_score} size="lg" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {lead.headline}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        {lead.company} • {lead.location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-800">
                  <nav className="-mb-px flex space-x-8 px-6">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          "group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium",
                          activeTab === tab.id
                            ? "border-primary-500 text-primary-600 dark:text-primary-400"
                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        )}
                      >
                        <ApperIcon
                          name={tab.icon}
                          className={cn(
                            "-ml-0.5 mr-2 h-4 w-4",
                            activeTab === tab.id
                              ? "text-primary-500 dark:text-primary-400"
                              : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                          )}
                        />
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <div className="p-6">
                    {activeTab === "overview" && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Company Size
                            </label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-white">
                              {lead.company_size} employees
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Industry
                            </label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-white">
                              {lead.industry}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Email Status
                            </label>
                            <div className="mt-1">
                              <StatusPill status={lead.email_status} />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Connection
                            </label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-white">
                              {lead.connection_level} connection
                            </p>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Match Reason
                          </label>
                          <p className="mt-1 text-sm text-gray-900 dark:text-white">
                            {lead.match_reason}
                          </p>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Tags
                          </label>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {lead.tags.map((tag, index) => (
                              <Badge 
                                key={index} 
                                variant="secondary" 
                                className="group cursor-pointer"
                                onClick={() => handleRemoveTag(tag)}
                              >
                                {tag}
                                <ApperIcon name="X" className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Badge>
                            ))}
                          </div>
                          <div className="mt-2 flex space-x-2">
                            <Input
                              placeholder="Add tag..."
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                              className="flex-1"
                            />
                            <Button size="sm" onClick={handleAddTag}>
                              Add
                            </Button>
                          </div>
                        </div>

                        <div>
                          <a
                            href={lead.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                          >
                            <ApperIcon name="ExternalLink" className="h-4 w-4" />
                            <span>View LinkedIn Profile</span>
                          </a>
                        </div>
                      </div>
                    )}

                    {activeTab === "enrichment" && (
                      <div className="space-y-6">
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <ApperIcon name="AlertTriangle" className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                              Demo Mode
                            </span>
                          </div>
                          <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                            Enrichment features are disabled in this UI prototype
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Email
                            </label>
                            <div className="mt-1 flex items-center space-x-2">
                              <StatusPill status={lead.email_status} />
                              <Button size="sm" variant="outline" disabled>
                                Attempt Find
                              </Button>
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Phone
                            </label>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              Not available
                            </p>
                          </div>
                          
                          <div>
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Company Website
                            </label>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              Not available
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "activity" && (
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                              <ApperIcon name="Plus" className="h-3 w-3 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900 dark:text-white">
                                Added via Run #{Math.floor(Math.random() * 100) + 1}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                2 days ago
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                              <ApperIcon name="Tag" className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900 dark:text-white">
                                Tagged "{lead.tags[0] || "SDR"}"
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                2 days ago
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                              <ApperIcon name="Download" className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900 dark:text-white">
                                Exported to CSV
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                1 day ago
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "fields" && (
                      <div className="space-y-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <ApperIcon name="Info" className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                              Custom Fields
                            </span>
                          </div>
                          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                            Field editing is non-functional in this prototype
                          </p>
                        </div>

                        <div className="space-y-4">
                          {Object.entries(lead).map(([key, value]) => {
                            if (key === "Id" || key === "profile_img") return null;
                            return (
                              <div key={key}>
                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  {key.replace("_", " ")}
                                </label>
                                <Input
                                  value={Array.isArray(value) ? value.join(", ") : String(value)}
                                  disabled
                                  className="mt-1"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-4">
                  <div className="flex justify-between">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Notes
                      </label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add notes about this lead..."
                        rows={2}
                        className="w-80"
                      />
                    </div>
                    <div className="flex items-end space-x-2">
                      <Button size="sm" variant="outline" onClick={handleAddNote}>
                        <ApperIcon name="FileText" className="mr-1 h-4 w-4" />
                        Add Note
                      </Button>
                      <Button size="sm">
                        <ApperIcon name="Send" className="mr-1 h-4 w-4" />
                        Send to CRM
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadDetailDrawer;