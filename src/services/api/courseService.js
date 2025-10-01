import coursesData from "@/services/mockData/courses.json";

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

const courseService = {
  getAll: async () => {
    await delay();
    return [...coursesData];
  },

  getById: async (id) => {
    await delay();
    const course = coursesData.find(c => c.Id === parseInt(id));
    if (!course) throw new Error("Course not found");
    return { ...course };
  },

  create: async (course) => {
    await delay();
    const maxId = Math.max(...coursesData.map(c => c.Id), 0);
    const newCourse = {
      ...course,
      Id: maxId + 1,
      enrolledCount: 0
    };
    coursesData.push(newCourse);
    return { ...newCourse };
  },

  update: async (id, data) => {
    await delay();
    const index = coursesData.findIndex(c => c.Id === parseInt(id));
    if (index === -1) throw new Error("Course not found");
    coursesData[index] = { ...coursesData[index], ...data };
    return { ...coursesData[index] };
  },

  delete: async (id) => {
    await delay();
    const index = coursesData.findIndex(c => c.Id === parseInt(id));
    if (index === -1) throw new Error("Course not found");
    coursesData.splice(index, 1);
    return true;
  }
};

export default courseService;