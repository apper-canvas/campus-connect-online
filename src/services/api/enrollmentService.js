import enrollmentsData from "@/services/mockData/enrollments.json";

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

const enrollmentService = {
  getAll: async () => {
    await delay();
    return [...enrollmentsData];
  },

  getByStudentId: async (studentId) => {
    await delay();
    return enrollmentsData.filter(e => e.studentId === String(studentId));
  },

  getByCourseId: async (courseId) => {
    await delay();
    return enrollmentsData.filter(e => e.courseId === String(courseId));
  },

  create: async (enrollment) => {
    await delay();
    const maxId = Math.max(...enrollmentsData.map(e => e.Id), 0);
    const newEnrollment = {
      ...enrollment,
      Id: maxId + 1,
      enrollmentDate: new Date().toISOString().split("T")[0],
      status: "enrolled"
    };
    enrollmentsData.push(newEnrollment);
    return { ...newEnrollment };
  },

  delete: async (id) => {
    await delay();
    const index = enrollmentsData.findIndex(e => e.Id === parseInt(id));
    if (index === -1) throw new Error("Enrollment not found");
    enrollmentsData.splice(index, 1);
    return true;
  }
};

export default enrollmentService;