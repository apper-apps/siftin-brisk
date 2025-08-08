import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Checkbox from '@/components/atoms/Checkbox';
import StatusPill from '@/components/molecules/StatusPill';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import resultsService from '@/services/api/resultsService';
import { cn } from '@/utils/cn';

const Results = () => {
  const { runId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [runData, setRunData] = useState(null);
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLeads, setSelectedLeads] = useState(new Set());
  const [viewMode, setViewMode] = useState('table');
  const [sortBy, setSortBy] = useState('match_score_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [heroVisible, setHeroVisible] = useState(true);
  const [showColumns, setShowColumns] = useState(false);
  const [selectedDrawerLead, setSelectedDrawerLead] = useState(null);
  
  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    companySizes: [],
    industries: [],
    location: '',
    matchScore: 0,
    emailStatuses: [],
    connectionLevels: [],
    tags: []
  });

  const itemsPerPage = 25;

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const runInfo = resultsService.getRunData(runId);
        const allLeads = resultsService.getAll();
        
        setRunData(runInfo);
        setLeads(allLeads);
        setFilteredLeads(allLeads);
        setError(null);
      } catch (err) {
        setError(err.message);
        toast.error('Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [runId]);

  // Apply filters
  useEffect(() => {
    const filtered = resultsService.getFiltered(filters);
    setFilteredLeads(filtered);
    setCurrentPage(1);
    setSelectedLeads(new Set());
  }, [filters]);

  // Sort leads
  useEffect(() => {
    const sorted = [...filteredLeads].sort((a, b) => {
      switch (sortBy) {
        case 'match_score_desc':
          return b.match_score - a.match_score;
        case 'match_score_asc':
          return a.match_score - b.match_score;
        case 'company_size':
          return a.company_size.localeCompare(b.company_size);
        case 'title_az':
          return a.headline.localeCompare(b.headline);
        case 'recently_added':
          return b.Id - a.Id;
        default:
          return 0;
      }
    });
    setFilteredLeads(sorted);
  }, [sortBy]);

  // Filter options
  const companySizeOptions = ['1–10', '11–50', '51–200', '201–500', '501–1,000', '1,001–5,000', '5,001+'];
  const industryOptions = ['SaaS', 'Fintech SaaS', 'Enterprise Software', 'Data Analytics', 'Cloud Infrastructure', 
    'Marketing Tech', 'Sales Enablement', 'Data Management', 'Lead Generation', 'IT Services', 'Customer Success',
    'File Sync', 'AI/ML', 'CRM Software', 'Sales Tech', 'Analytics', 'Sales Automation', 'Demand Gen',
    'Conversion Rate Optimization'];
  const emailStatusOptions = ['Unknown', 'Found', 'NotFound'];
  const connectionLevelOptions = ['1st', '2nd', '3rd'];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleMultiSelectFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value) 
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      companySizes: [],
      industries: [],
      location: '',
      matchScore: 0,
      emailStatuses: [],
      connectionLevels: [],
      tags: []
    });
  };

  const handleQuickFilter = (type) => {
    switch (type) {
      case 'goodFit':
        setFilters(prev => ({ ...prev, matchScore: 80 }));
        break;
      case 'usOnly':
        setFilters(prev => ({ ...prev, location: 'US' }));
        break;
      case 'smb':
        setFilters(prev => ({ ...prev, companySizes: ['11–50', '51–200'] }));
        break;
      case 'enterprise':
        setFilters(prev => ({ ...prev, companySizes: ['1,001–5,000', '5,001+'] }));
        break;
    }
  };

  const handleSelectLead = (leadId) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(leadId)) {
      newSelected.delete(leadId);
    } else {
      newSelected.add(leadId);
    }
    setSelectedLeads(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedLeads.size === paginatedLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(paginatedLeads.map(lead => lead.Id)));
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Title Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Results</h1>
              <StatusPill status={runData?.status || 'Completed'} className="text-sm">
                {runData?.runLabel || 'Run Label'}
              </StatusPill>
            </div>
            
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <Button variant="outline" size="sm">
                <ApperIcon name="Save" size={14} />
                Save View
              </Button>
              <Button variant="outline" size="sm">
                <ApperIcon name="Download" size={14} />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <ApperIcon name="Send" size={14} />
                Send to CRM
              </Button>
              <Button variant="outline" size="sm">
                <ApperIcon name="MoreHorizontal" size={14} />
              </Button>
            </div>
          </div>
          
          {/* Meta Row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400 pb-4">
            <div className="flex items-center space-x-1">
              <span className="font-medium">Source:</span>
              <span className="truncate max-w-xs">{runData?.sourceUrl || ''}</span>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <ApperIcon name="Copy" size={14} />
              </button>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-medium">Created:</span>
              <span>{runData?.createdAt ? format(new Date(runData.createdAt), 'MMM d, yyyy h:mm a') : ''}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-medium">Criteria:</span>
              <span 
                className="truncate max-w-xs cursor-help" 
                title={runData?.criteriaText || ''}
              >
                {runData?.criteriaText || ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Panel */}
      {heroVisible && (
        <div className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border-b border-gray-200 dark:border-gray-800">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Instantly know if a lead is a good fit without researching them
                </h2>
                
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p>
                    SIFTIN automatically finds and adds key data points to every prospect, like their company size, 
                    industry, and location. This allows you to stop manually researching leads and instead use that 
                    time to craft the perfect outreach message.
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="flex items-start space-x-2">
                      <ApperIcon name="CheckCircle" size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <strong>Crucial company data, added automatically.</strong> As we find new leads for you, 
                        we also find and add their industry, employee count, business category, and more.
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <ApperIcon name="CheckCircle" size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <strong>Filter your leads with laser precision.</strong> Now you can instantly sort your 
                        prospect list by company size or location, ensuring you only spend time on the leads that 
                        are a perfect match for your business.
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <ApperIcon name="CheckCircle" size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <strong>Personalize your messages with real data.</strong> Start your conversations with 
                        more than just a name. Mentioning their specific industry or company size shows you've 
                        done your homework and makes your outreach far more effective.
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <ApperIcon name="CheckCircle" size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <strong>See everything in one place.</strong> All the key data you need is organized right 
                        next to the prospect's name, with a direct link back to their LinkedIn profile for a final check.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setHeroVisible(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Filters Sidebar */}
        <div className="w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
          <div className="p-6 h-full overflow-y-auto custom-scrollbar">
            <div className="space-y-6">
              {/* Search */}
              <div>
                <Input
                  type="text"
                  placeholder="Search name, title, company…"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Quick Filters */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Quick Filters</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleQuickFilter('goodFit')}
                    className={cn(
                      "px-3 py-1 text-xs rounded-full border transition-colors",
                      filters.matchScore >= 80
                        ? "bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/50 dark:text-primary-300"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                    )}
                  >
                    Good Fit (≥80)
                  </button>
                  <button
                    onClick={() => handleQuickFilter('usOnly')}
                    className={cn(
                      "px-3 py-1 text-xs rounded-full border transition-colors",
                      filters.location.includes('US')
                        ? "bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/50 dark:text-primary-300"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                    )}
                  >
                    US Only
                  </button>
                  <button
                    onClick={() => handleQuickFilter('smb')}
                    className={cn(
                      "px-3 py-1 text-xs rounded-full border transition-colors",
                      filters.companySizes.some(size => ['11–50', '51–200'].includes(size))
                        ? "bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/50 dark:text-primary-300"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                    )}
                  >
                    SMB (11–200)
                  </button>
                  <button
                    onClick={() => handleQuickFilter('enterprise')}
                    className={cn(
                      "px-3 py-1 text-xs rounded-full border transition-colors",
                      filters.companySizes.some(size => ['1,001–5,000', '5,001+'].includes(size))
                        ? "bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/50 dark:text-primary-300"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                    )}
                  >
                    Enterprise (1,001+)
                  </button>
                </div>
              </div>

              {/* Company Size */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Company Size</h3>
                <div className="flex flex-wrap gap-2">
                  {companySizeOptions.map(size => (
                    <button
                      key={size}
                      onClick={() => handleMultiSelectFilter('companySizes', size)}
                      className={cn(
                        "px-3 py-1 text-xs rounded-full border transition-colors",
                        filters.companySizes.includes(size)
                          ? "bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/50 dark:text-primary-300"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Match Score */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Match Score ≥ 
                  <Badge variant="secondary" className="ml-2 bg-accent-400 text-gray-900">
                    {filters.matchScore}
                  </Badge>
                </h3>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.matchScore}
                  onChange={(e) => handleFilterChange('matchScore', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
                />
              </div>

              {/* Industry */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Industry</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {industryOptions.map(industry => (
                    <label key={industry} className="flex items-center space-x-2">
                      <Checkbox
                        checked={filters.industries.includes(industry)}
                        onChange={() => handleMultiSelectFilter('industries', industry)}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{industry}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Location</h3>
                <Input
                  type="text"
                  placeholder="Country, state, city"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Reset Filters */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={resetFilters}
                  className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
                >
                  Reset all filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Toolbar */}
          <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredLeads.length} results • {selectedLeads.size} selected
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">View:</span>
                  <div className="flex rounded-lg border border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setViewMode('table')}
                      className={cn(
                        "px-3 py-1 text-sm rounded-l-lg",
                        viewMode === 'table'
                          ? "bg-primary-500 text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      )}
                    >
                      Table
                    </button>
                    <button
                      onClick={() => setViewMode('cards')}
                      className={cn(
                        "px-3 py-1 text-sm rounded-r-lg border-l border-gray-200 dark:border-gray-700",
                        viewMode === 'cards'
                          ? "bg-primary-500 text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      )}
                    >
                      Cards
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-48"
                >
                  <option value="match_score_desc">Match score (high to low)</option>
                  <option value="match_score_asc">Match score (low to high)</option>
                  <option value="company_size">Company size</option>
                  <option value="title_az">Title A→Z</option>
                  <option value="recently_added">Recently added</option>
                </Select>
                
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  Select All
                </Button>
                
                <Button variant="outline" size="sm">
                  <ApperIcon name="Tag" size={14} />
                  Tag
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-auto">
            {viewMode === 'table' ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                  <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                    <tr>
                      <th className="w-12 px-6 py-3 text-left">
                        <Checkbox
                          checked={selectedLeads.size === paginatedLeads.length && paginatedLeads.length > 0}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Industry
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Match
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        LinkedIn
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                    {paginatedLeads.map((lead, index) => (
                      <tr 
                        key={lead.Id} 
                        className={cn(
                          "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                          index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50/30 dark:bg-gray-800/30"
                        )}
                      >
                        <td className="px-6 py-4">
                          <Checkbox
                            checked={selectedLeads.has(lead.Id)}
                            onChange={() => handleSelectLead(lead.Id)}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedDrawerLead(lead)}
                            className="flex items-center space-x-3 text-left hover:text-primary-600 dark:hover:text-primary-400"
                          >
                            <img
                              src={lead.profile_img}
                              alt=""
                              className="h-8 w-8 rounded-full object-cover"
                            />
                            <span className="font-medium text-gray-900 dark:text-white">
                              {lead.full_name}
                            </span>
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {lead.headline}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                          {lead.company}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="secondary" className="text-xs">
                            {lead.company_size}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {lead.industry}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {lead.location}
                        </td>
                        <td className="px-6 py-4">
                          <Badge 
                            className="bg-accent-400 text-gray-900 hover:bg-accent-500"
                            title={lead.match_reason}
                          >
                            {lead.match_score}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={lead.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-500 dark:text-primary-400"
                          >
                            <ApperIcon name="ExternalLink" size={16} />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedLeads.map((lead) => (
                    <Card key={lead.Id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <img
                              src={lead.profile_img}
                              alt=""
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <div>
                              <CardTitle className="text-base">{lead.full_name}</CardTitle>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{lead.headline}</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{lead.company}</p>
                            </div>
                          </div>
                          <Checkbox
                            checked={selectedLeads.has(lead.Id)}
                            onChange={() => handleSelectLead(lead.Id)}
                          />
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {lead.company_size}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {lead.industry}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {lead.location}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Badge className="bg-accent-400 text-gray-900">
                            Score: {lead.match_score}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                          {lead.match_reason}
                        </p>
                        
                        <div className="flex justify-between pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedDrawerLead(lead)}
                          >
                            View Details
                          </Button>
                          <a
                            href={lead.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline" size="sm">
                              <ApperIcon name="ExternalLink" size={14} />
                            </Button>
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredLeads.length)} of {filteredLeads.length} results
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ApperIcon name="ChevronLeft" size={14} />
                  </Button>
                  
                  <span className="text-sm text-gray-900 dark:text-white">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ApperIcon name="ChevronRight" size={14} />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lead Detail Drawer */}
      {selectedDrawerLead && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-25" onClick={() => setSelectedDrawerLead(null)} />
          <div className="absolute right-0 top-0 h-full w-96 bg-white dark:bg-gray-900 shadow-xl">
            <div className="flex h-full flex-col">
              <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Lead Details</h3>
                  <button
                    onClick={() => setSelectedDrawerLead(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <img
                      src={selectedDrawerLead.profile_img}
                      alt=""
                      className="h-16 w-16 rounded-full object-cover mx-auto"
                    />
                    <h4 className="mt-2 text-lg font-medium">{selectedDrawerLead.full_name}</h4>
                    <p className="text-gray-600 dark:text-gray-400">{selectedDrawerLead.headline}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Company</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">{selectedDrawerLead.company}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Size</dt>
                      <dd className="mt-1">
                        <Badge variant="secondary" className="text-xs">{selectedDrawerLead.company_size}</Badge>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Industry</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">{selectedDrawerLead.industry}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">{selectedDrawerLead.location}</dd>
                    </div>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Match Score</dt>
                    <dd className="mt-1">
                      <Badge className="bg-accent-400 text-gray-900">{selectedDrawerLead.match_score}</Badge>
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Match Reason</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{selectedDrawerLead.match_reason}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Tags</dt>
                    <dd className="mt-1 flex flex-wrap gap-1">
                      {selectedDrawerLead.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </dd>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-4">
                <div className="flex space-x-3">
                  <Button className="flex-1">
                    <ApperIcon name="Mail" size={14} />
                    Send Email
                  </Button>
                  <a
                    href={selectedDrawerLead.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full">
                      <ApperIcon name="ExternalLink" size={14} />
                      LinkedIn
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;