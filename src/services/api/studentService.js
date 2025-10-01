import studentsData from "@/services/mockData/students.json";
import { toast } from "react-toastify";

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
    const webhookStartTime = Date.now();
    try {
      const requestPayload = {
        body: JSON.stringify(newStudent),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      console.info(`apper_info: Invoking webhook function: ${import.meta.env.VITE_WEBHOOK} with payload:`, {
        studentId: newStudent.studentId,
        payloadSize: requestPayload.body.length,
        timestamp: new Date().toISOString()
      });
      
      const result = await apperClient.functions.invoke(import.meta.env.VITE_WEBHOOK, requestPayload);
      const duration = Date.now() - webhookStartTime;
      
      if (result && !result.ok) {
        const responseData = await result.json().catch(() => ({}));
        console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_WEBHOOK}. Status: ${result.status}, Duration: ${duration}ms, Response body: ${JSON.stringify(responseData)}.`);
        toast.warning("Student created but webhook notification failed", {
          position: "top-right",
          autoClose: 5000
        });
      } else {
        console.info(`apper_info: Webhook function ${import.meta.env.VITE_WEBHOOK} invoked successfully in ${duration}ms`);
      }
    } catch (error) {
      const duration = Date.now() - webhookStartTime;
      const errorDetails = {
        function: import.meta.env.VITE_WEBHOOK,
        error: error.message,
        errorType: error.name,
        duration: `${duration}ms`,
        studentId: newStudent.studentId,
        timestamp: new Date().toISOString(),
        stack: error.stack?.split('\n').slice(0, 3).join('\n')
      };
      
      console.info(`apper_info: Network error invoking function: ${import.meta.env.VITE_WEBHOOK}. Details:`, errorDetails);
      
      toast.error("Student created but notification system is unavailable", {
        position: "top-right",
        autoClose: 5000
      });
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