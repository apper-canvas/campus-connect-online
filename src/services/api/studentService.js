import studentsData from "@/services/mockData/students.json";

const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

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
    
    // Call webhook Edge Function with complete student data
    try {
      const result = await apperClient.functions.invoke(import.meta.env.VITE_WEBHOOK, {
        body: JSON.stringify(newStudent),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (result && !result.ok) {
        const responseData = await result.json().catch(() => ({}));
        console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_WEBHOOK}. The response body is: ${JSON.stringify(responseData)}.`);
      }
    } catch (error) {
      console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_WEBHOOK}. The error is: ${error.message}`);
    }
    
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