import facultyData from "@/services/mockData/faculty.json";

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

const facultyService = {
  getAll: async () => {
    await delay();
    return [...facultyData];
  },

  getById: async (id) => {
    await delay();
    const faculty = facultyData.find(f => f.Id === parseInt(id));
    if (!faculty) throw new Error("Faculty not found");
    return { ...faculty };
  },

  create: async (faculty) => {
    await delay();
    const maxId = Math.max(...facultyData.map(f => f.Id), 0);
    const newFaculty = {
      ...faculty,
      Id: maxId + 1,
      employeeId: `FAC${String(maxId + 1).padStart(3, "0")}`,
      assignedCourses: []
    };
    facultyData.push(newFaculty);
    return { ...newFaculty };
  },

  update: async (id, data) => {
    await delay();
    const index = facultyData.findIndex(f => f.Id === parseInt(id));
    if (index === -1) throw new Error("Faculty not found");
    facultyData[index] = { ...facultyData[index], ...data };
    return { ...facultyData[index] };
  },

  delete: async (id) => {
    await delay();
    const index = facultyData.findIndex(f => f.Id === parseInt(id));
    if (index === -1) throw new Error("Faculty not found");
    facultyData.splice(index, 1);
    return true;
  }
};

export default facultyService;