import studentsData from "@/services/mockData/students.json";

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

const studentService = {
  getAll: async () => {
    await delay();
    return [...studentsData];
  },

  getById: async (id) => {
    await delay();
    const student = studentsData.find(s => s.Id === parseInt(id));
    if (!student) throw new Error("Student not found");
    return { ...student };
  },

  create: async (student) => {
    await delay();
    const maxId = Math.max(...studentsData.map(s => s.Id), 0);
    const newStudent = {
      ...student,
      Id: maxId + 1,
      studentId: `ST${new Date().getFullYear()}${String(maxId + 1).padStart(3, "0")}`
    };
    studentsData.push(newStudent);
    return { ...newStudent };
  },

  update: async (id, data) => {
    await delay();
    const index = studentsData.findIndex(s => s.Id === parseInt(id));
    if (index === -1) throw new Error("Student not found");
    studentsData[index] = { ...studentsData[index], ...data };
    return { ...studentsData[index] };
  },

  delete: async (id) => {
    await delay();
    const index = studentsData.findIndex(s => s.Id === parseInt(id));
    if (index === -1) throw new Error("Student not found");
    studentsData.splice(index, 1);
    return true;
  }
};

export default studentService;