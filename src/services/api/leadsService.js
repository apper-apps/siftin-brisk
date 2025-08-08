import leadsData from "@/services/mockData/leads.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let leads = [...leadsData];

const leadsService = {
  async getAll() {
    await delay(300);
    return [...leads];
  },

  async getById(id) {
    await delay(200);
    const lead = leads.find(l => l.Id === parseInt(id));
    if (!lead) {
      throw new Error("Lead not found");
    }
    return { ...lead };
  },

  async create(leadData) {
    await delay(400);
    const newId = Math.max(...leads.map(l => l.Id)) + 1;
    const newLead = {
      Id: newId,
      ...leadData,
      created_at: new Date().toISOString()
    };
    leads.push(newLead);
    return { ...newLead };
  },

  async update(id, updateData) {
    await delay(350);
    const index = leads.findIndex(l => l.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Lead not found");
    }
    leads[index] = { ...leads[index], ...updateData };
    return { ...leads[index] };
  },

  async delete(id) {
    await delay(250);
    const index = leads.findIndex(l => l.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Lead not found");
    }
    const deleted = leads.splice(index, 1)[0];
    return { ...deleted };
  },

  async bulkUpdate(ids, updateData) {
    await delay(500);
    const updated = [];
    ids.forEach(id => {
      const index = leads.findIndex(l => l.Id === parseInt(id));
      if (index !== -1) {
        leads[index] = { ...leads[index], ...updateData };
        updated.push({ ...leads[index] });
      }
    });
    return updated;
  },

  async search(query, filters = {}) {
    await delay(400);
    let filtered = [...leads];

    if (query) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(lead => 
        lead.full_name.toLowerCase().includes(searchTerm) ||
        lead.headline.toLowerCase().includes(searchTerm) ||
        lead.company.toLowerCase().includes(searchTerm) ||
        lead.industry.toLowerCase().includes(searchTerm) ||
        lead.location.toLowerCase().includes(searchTerm)
      );
    }

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

    if (filters.min_score) {
      filtered = filtered.filter(lead => lead.match_score >= filters.min_score);
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(lead => 
        filters.tags.some(tag => lead.tags.includes(tag))
      );
    }

    return filtered;
  }
};

export default leadsService;