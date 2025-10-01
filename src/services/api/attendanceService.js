import attendanceData from "@/services/mockData/attendance.json";

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

const attendanceService = {
  getAll: async () => {
    await delay();
    return [...attendanceData];
  },

  getByStudentId: async (studentId) => {
    await delay();
    return attendanceData.filter(a => a.studentId === String(studentId));
  },

  getByCourseId: async (courseId) => {
    await delay();
    return attendanceData.filter(a => a.courseId === String(courseId));
  },

  getByCourseAndDate: async (courseId, date) => {
    await delay();
    return attendanceData.filter(
      a => a.courseId === String(courseId) && a.date === date
    );
  },

  create: async (attendance) => {
    await delay();
    const maxId = Math.max(...attendanceData.map(a => a.Id), 0);
    const newAttendance = {
      ...attendance,
      Id: maxId + 1
    };
    attendanceData.push(newAttendance);
    return { ...newAttendance };
  },

  update: async (id, data) => {
    await delay();
    const index = attendanceData.findIndex(a => a.Id === parseInt(id));
    if (index === -1) throw new Error("Attendance record not found");
    attendanceData[index] = { ...attendanceData[index], ...data };
    return { ...attendanceData[index] };
  },

  bulkCreate: async (records) => {
    await delay();
    const maxId = Math.max(...attendanceData.map(a => a.Id), 0);
    const newRecords = records.map((record, index) => ({
      ...record,
      Id: maxId + index + 1
    }));
    attendanceData.push(...newRecords);
    return newRecords;
  }
};

export default attendanceService;