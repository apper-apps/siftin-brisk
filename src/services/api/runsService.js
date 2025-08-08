import runsData from "@/services/mockData/runs.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let runs = [...runsData];

const runsService = {
  async getAll() {
    await delay(300);
    return [...runs];
  },

  async getById(id) {
    await delay(200);
    const run = runs.find(r => r.Id === parseInt(id));
    if (!run) {
      throw new Error("Run not found");
    }
    return { ...run };
  },

  async create(runData) {
    await delay(400);
    const newId = Math.max(...runs.map(r => r.Id)) + 1;
    const newRun = {
      Id: newId,
      ...runData,
      created_at: new Date().toISOString(),
      status: "Draft",
      found_count: 0,
      selected_count: 0
    };
    runs.push(newRun);
    return { ...newRun };
  },

  async update(id, updateData) {
    await delay(350);
    const index = runs.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Run not found");
    }
    runs[index] = { ...runs[index], ...updateData };
    return { ...runs[index] };
  },

  async delete(id) {
    await delay(250);
    const index = runs.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Run not found");
    }
    const deleted = runs.splice(index, 1)[0];
    return { ...deleted };
  },

  async duplicate(id) {
    await delay(300);
    const original = runs.find(r => r.Id === parseInt(id));
    if (!original) {
      throw new Error("Run not found");
    }
    
    const newId = Math.max(...runs.map(r => r.Id)) + 1;
    const duplicated = {
      ...original,
      Id: newId,
      label: `${original.label} (Copy)`,
      created_at: new Date().toISOString(),
      status: "Draft",
      found_count: 0,
      selected_count: 0
    };
    
    runs.push(duplicated);
    return { ...duplicated };
  },

  async runPreview(criteria) {
    await delay(2000); // Simulate AI processing time
    
    // Mock generating match scores and reasons
    const mockResults = [
      { match_score: 87, match_reason: "Strong match for SDR management criteria" },
      { match_score: 92, match_reason: "Excellent fit for leadership requirements" },
      { match_score: 78, match_reason: "Good match for industry and role" },
      { match_score: 85, match_reason: "Matches location and experience criteria" },
      { match_score: 74, match_reason: "Partial match for company size requirements" }
    ];
    
    return {
      found_count: Math.floor(Math.random() * 100) + 50,
      preview_results: mockResults.slice(0, Math.floor(Math.random() * 5) + 3)
    };
  }
};

export default runsService;