import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Checkbox from "@/components/atoms/Checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import SearchBar from "@/components/molecules/SearchBar";
import StatusPill from "@/components/molecules/StatusPill";
import MatchScore from "@/components/molecules/MatchScore";
import LeadDetailDrawer from "@/components/organisms/LeadDetailDrawer";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import leadsService from "@/services/api/leadsService";

const Leads = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    industry: "all",
    company_size: "all", 
    location: "all",
    email_status: "all",
    connection_level: "all",
    min_score: 0,
    tags: []
  });

  // Saved views
  const savedViews = [
    { name: "All Leads", filters: {} },
    { name: "High Match ≥80", filters: { min_score: 80 } },
    { name: "US SDR Managers", filters: { tags: ["SDR", "Manager"] } },
    { name: "Email Found", filters: { email_status: "Found" } },
    { name: "1st Connections", filters: { connection_level: "1st" } }
  ];

  const [activeView, setActiveView] = useState("All Leads");

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [leads, searchQuery, filters]);

  const fetchLeads = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await leadsService.getAll();
      setLeads(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...leads];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(lead =>
        lead.full_name.toLowerCase().includes(query) ||
        lead.headline.toLowerCase().includes(query) ||
        lead.company.toLowerCase().includes(query) ||
        lead.industry.toLowerCase().includes(query) ||
        lead.location.toLowerCase().includes(query)
      );
    }

    // Other filters
    if (filters.industry && filters.industry !== "all") {
      filtered = filtered.filter(lead =>
        lead.industry.toLowerCase().includes(filters.industry.toLowerCase())
      );
    }

    if (filters.company_size && filters.company_size !== "all") {
      filtered = filtered.filter(lead => lead.company_size === filters.company_size);
    }

    if (filters.location && filters.location !== "all") {
      filtered = filtered.filter(lead =>
        lead.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.email_status && filters.email_status !== "all") {
      filtered = filtered.filter(lead => lead.email_status === filters.email_status);
    }

    if (filters.connection_level && filters.connection_level !== "all") {
      filtered = filtered.filter(lead => lead.connection_level === filters.connection_level);
    }

    if (filters.min_score > 0) {
      filtered = filtered.filter(lead => lead.match_score >= filters.min_score);
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(lead =>
        filters.tags.some(tag => lead.tags.includes(tag))
      );
    }

    setFilteredLeads(filtered);
  };

  const handleViewChange = (viewName, viewFilters) => {
    setActiveView(viewName);
    setFilters({ ...filters, ...viewFilters });
  };

  const handleLeadSelect = (leadId) => {
    setSelectedLeads(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    setSelectedLeads(
      selectedLeads.length === filteredLeads.length
        ? []
        : filteredLeads.map(lead => lead.Id)
    );
  };

  const handleBulkTag = async () => {
    const tag = prompt("Enter tag to add:");
    if (!tag || selectedLeads.length === 0) return;

    try {
      await leadsService.bulkUpdate(selectedLeads, {
        tags: [...new Set([...leads.find(l => selectedLeads.includes(l.Id))?.tags || [], tag])]
      });
      toast.success(`Tagged ${selectedLeads.length} leads`);
      fetchLeads();
      setSelectedLeads([]);
    } catch (err) {
      toast.error("Failed to tag leads");
    }
  };

  const handleBulkExport = () => {
    if (selectedLeads.length === 0) {
      toast.error("Please select leads to export");
      return;
    }
    // Simulate export
    toast.success(`Exported ${selectedLeads.length} leads to CSV`);
    setSelectedLeads([]);
  };

  const handleLeadClick = (lead) => {
    setSelectedLead(lead.Id);
    setDrawerOpen(true);
  };

  const getUniqueValues = (key) => {
    const values = leads.map(lead => lead[key]).filter(Boolean);
    return [...new Set(values)].sort();
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={fetchLeads} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Leads Library
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage and filter your saved leads
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <ApperIcon name="Filter" className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button onClick={() => navigate("/new-capture")}>
            <ApperIcon name="Plus" className="mr-2 h-4 w-4" />
            New Capture
          </Button>
        </div>
      </div>

      <div className="flex space-x-6">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-80 space-y-6">
            {/* Saved Views */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Saved Views</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {savedViews.map((view) => (
                  <button
                    key={view.name}
                    onClick={() => handleViewChange(view.name, view.filters)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      activeView === view.name
                        ? "bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-400"
                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`}
                  >
                    {view.name}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Search</CardTitle>
              </CardHeader>
              <CardContent>
                <SearchBar
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClear={() => setSearchQuery("")}
                />
              </CardContent>
            </Card>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Industry
                  </label>
                  <Select
                    value={filters.industry}
                    onChange={(e) => setFilters({...filters, industry: e.target.value})}
                  >
                    <option value="all">All Industries</option>
                    {getUniqueValues("industry").map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Company Size
                  </label>
                  <Select
                    value={filters.company_size}
                    onChange={(e) => setFilters({...filters, company_size: e.target.value})}
                  >
                    <option value="all">All Sizes</option>
                    {getUniqueValues("company_size").map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Location
                  </label>
                  <Select
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                  >
                    <option value="all">All Locations</option>
                    {getUniqueValues("location").slice(0, 10).map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Email Status
                  </label>
                  <Select
                    value={filters.email_status}
                    onChange={(e) => setFilters({...filters, email_status: e.target.value})}
                  >
                    <option value="all">All Statuses</option>
                    <option value="Found">Found</option>
                    <option value="NotFound">Not Found</option>
                    <option value="Unknown">Unknown</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Connection Level
                  </label>
                  <Select
                    value={filters.connection_level}
                    onChange={(e) => setFilters({...filters, connection_level: e.target.value})}
                  >
                    <option value="all">All Levels</option>
                    <option value="1st">1st</option>
                    <option value="2nd">2nd</option>
                    <option value="3rd">3rd</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Match Score: {filters.min_score}%+
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.min_score}
                    onChange={(e) => setFilters({...filters, min_score: parseInt(e.target.value)})}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 space-y-4">
          {/* Bulk Actions */}
          {selectedLeads.length > 0 && (
            <Card>
              <CardContent className="py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedLeads.length} leads selected
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" onClick={handleBulkTag}>
                      <ApperIcon name="Tag" className="mr-1 h-4 w-4" />
                      Tag
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleBulkExport}>
                      <ApperIcon name="Download" className="mr-1 h-4 w-4" />
                      Export
                    </Button>
                    <Button size="sm" variant="outline">
                      <ApperIcon name="Send" className="mr-1 h-4 w-4" />
                      Send to CRM
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {filteredLeads.length === 0 ? (
            <Empty
              icon="Users"
              title="No leads found"
              description="Adjust your filters or create a new capture run to find leads"
              action={() => navigate("/new-capture")}
              actionLabel="Create New Capture"
            />
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {filteredLeads.length} Leads
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center space-x-2 text-sm">
                      <Checkbox
                        checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                        onChange={handleSelectAll}
                      />
                      <span className="text-gray-600 dark:text-gray-400">Select All</span>
                    </label>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="w-8 px-4 py-3">
                          <Checkbox
                            checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                            onChange={handleSelectAll}
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Lead
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Match
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Connection
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredLeads.map((lead) => (
                        <tr
                          key={lead.Id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                          onClick={() => handleLeadClick(lead)}
                        >
                          <td className="px-4 py-4">
                            <Checkbox
                              checked={selectedLeads.includes(lead.Id)}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleLeadSelect(lead.Id);
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <img
                                src={lead.profile_img}
                                alt={lead.full_name}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {lead.full_name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                  {lead.headline}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {lead.company}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {lead.company_size} • {lead.industry}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {lead.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <MatchScore score={lead.match_score} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusPill status={lead.email_status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {lead.connection_level}
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
      </div>

      {/* Lead Detail Drawer */}
      <LeadDetailDrawer
        leadId={selectedLead}
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedLead(null);
        }}
      />
    </div>
  );
};

export default Leads;