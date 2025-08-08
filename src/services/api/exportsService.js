import exportsData from "@/services/mockData/exports.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let exports = [...exportsData];

const exportsService = {
  async getAll() {
    await delay(300);
    return [...exports];
  },

  async getById(id) {
    await delay(200);
    const exportItem = exports.find(e => e.Id === parseInt(id));
    if (!exportItem) {
      throw new Error("Export not found");
    }
    return { ...exportItem };
  },

  async create(exportData) {
    await delay(500); // Longer delay to simulate export processing
    const newId = Math.max(...exports.map(e => e.Id)) + 1;
    const newExport = {
      Id: newId,
      ...exportData,
      created_at: new Date().toISOString(),
      status: "Queued"
    };
    
    exports.push(newExport);
    
    // Simulate processing status change
    setTimeout(async () => {
      const index = exports.findIndex(e => e.Id === newId);
      if (index !== -1) {
        exports[index].status = Math.random() > 0.2 ? "Sent" : "Error";
      }
    }, 3000);
    
    return { ...newExport };
  },

  async retry(id) {
    await delay(400);
    const index = exports.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Export not found");
    }
    
    exports[index].status = "Queued";
    exports[index].created_at = new Date().toISOString();
    
    // Simulate retry processing
    setTimeout(() => {
      exports[index].status = Math.random() > 0.3 ? "Sent" : "Error";
    }, 2000);
    
    return { ...exports[index] };
  },

  async delete(id) {
    await delay(250);
    const index = exports.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Export not found");
    }
    const deleted = exports.splice(index, 1)[0];
    return { ...deleted };
  }
};

export default exportsService;