import mockLeads from '@/services/mockData/resultLeads.json';

let nextId = Math.max(...mockLeads.map(l => l.Id)) + 1;

// Mock run metadata
const mockRunData = {
  1: {
    runLabel: "SaaS SDRs - Q4 2024",
    sourceUrl: "https://www.linkedin.com/search/results/people/?keywords=SDR%20manager%20saas&origin=CLUSTER_EXPANSION",
    criteriaText: "SDR managers at SaaS companies in the US with 50-500 employees, actively hiring, posted in last 30 days",
    createdAt: "2024-01-15T14:30:00Z",
    status: "Completed"
  },
  2: {
    runLabel: "Fintech Leaders",
    sourceUrl: "https://www.linkedin.com/search/results/people/?keywords=head%20of%20sales%20fintech",
    criteriaText: "VP/Head of Sales at fintech startups, 100-1000 employees, Series A-C funding",
    createdAt: "2024-01-10T09:15:00Z", 
    status: "Draft"
  }
};

const resultsService = {
  // Get run metadata
  getRunData(runId) {
    const id = parseInt(runId);
    return mockRunData[id] || mockRunData[1]; // Default to first run
  },

  // Get all leads for a run
  getAll() {
    return [...mockLeads];
  },

  // Get filtered leads
  getFiltered(filters) {
    let filtered = [...mockLeads];

    // Search filter
    if (filters.search?.trim()) {
      const search = filters.search.toLowerCase().trim();
      filtered = filtered.filter(lead => 
        lead.full_name.toLowerCase().includes(search) ||
        lead.headline.toLowerCase().includes(search) ||
        lead.company.toLowerCase().includes(search)
      );
    }

    // Company size filter
    if (filters.companySizes?.length > 0) {
      filtered = filtered.filter(lead => 
        filters.companySizes.includes(lead.company_size)
      );
    }

    // Industry filter
    if (filters.industries?.length > 0) {
      filtered = filtered.filter(lead => 
        filters.industries.includes(lead.industry)
      );
    }

    // Location filter
    if (filters.location?.trim()) {
      const location = filters.location.toLowerCase().trim();
      filtered = filtered.filter(lead => 
        lead.location.toLowerCase().includes(location)
      );
    }

    // Match score filter
    if (filters.matchScore) {
      filtered = filtered.filter(lead => 
        lead.match_score >= filters.matchScore
      );
    }

    // Email status filter
    if (filters.emailStatuses?.length > 0) {
      filtered = filtered.filter(lead => 
        filters.emailStatuses.includes(lead.email_status)
      );
    }

    // Connection level filter
    if (filters.connectionLevels?.length > 0) {
      filtered = filtered.filter(lead => 
        filters.connectionLevels.includes(lead.connection_level)
      );
    }

    // Tags filter
    if (filters.tags?.length > 0) {
      filtered = filtered.filter(lead => 
        filters.tags.some(tag => lead.tags.includes(tag))
      );
    }

    return filtered;
  },

  // Get lead by ID
  getById(id) {
    const leadId = parseInt(id);
    if (!leadId) throw new Error('Invalid lead ID');
    return mockLeads.find(lead => lead.Id === leadId) || null;
  },

  // Update lead tags
  updateTags(id, tags) {
    const leadId = parseInt(id);
    const leadIndex = mockLeads.findIndex(lead => lead.Id === leadId);
    if (leadIndex === -1) throw new Error('Lead not found');
    
    mockLeads[leadIndex] = { ...mockLeads[leadIndex], tags };
    return mockLeads[leadIndex];
  },

  // Delete lead
  delete(id) {
    const leadId = parseInt(id);
    const leadIndex = mockLeads.findIndex(lead => lead.Id === leadId);
    if (leadIndex === -1) throw new Error('Lead not found');
    
    mockLeads.splice(leadIndex, 1);
    return true;
  }
};

export default resultsService;