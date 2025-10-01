import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import courseService from "@/services/api/courseService";
import facultyService from "@/services/api/facultyService";

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    courseCode: "",
    courseName: "",
    department: "",
    credits: "",
    semester: "",
    capacity: "",
    facultyId: "",
    schedule: "",
    status: "active"
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [coursesData, facultyData] = await Promise.all([
        courseService.getAll(),
        facultyService.getAll()
      ]);
      setCourses(coursesData);
      setFilteredCourses(coursesData);
      setFaculty(facultyData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    const filtered = courses.filter(course =>
      course.courseName.toLowerCase().includes(value.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(value.toLowerCase()) ||
      course.department.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await courseService.create(formData);
      toast.success("Course created successfully!");
      setShowModal(false);
      setFormData({
        courseCode: "",
        courseName: "",
        department: "",
        credits: "",
        semester: "",
        capacity: "",
        facultyId: "",
        schedule: "",
        status: "active"
      });
      loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await courseService.delete(id);
        toast.success("Course deleted successfully!");
        loadData();
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const getCapacityColor = (enrolled, capacity) => {
    const percentage = (enrolled / capacity) * 100;
    if (percentage >= 90) return "danger";
    if (percentage >= 70) return "warning";
    return "success";
  };

  if (loading) return <Loading type="card" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent">
            Courses
          </h1>
          <p className="text-gray-600 mt-1">Manage course catalog and schedules</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <ApperIcon name="BookPlus" size={18} className="mr-2" />
          Add Course
        </Button>
      </div>

      <div className="mb-6">
        <SearchBar
          placeholder="Search courses by name, code, or department..."
          onSearch={handleSearch}
        />
      </div>

      {filteredCourses.length === 0 ? (
        <Empty
          title="No courses found"
          message="Create your first course to get started"
          icon="BookOpen"
          action={() => setShowModal(true)}
          actionLabel="Add Course"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCourses.map((course, index) => {
            const facultyMember = faculty.find(f => f.Id === parseInt(course.facultyId));
            return (
              <motion.div
                key={course.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="p-6 cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                  onClick={() => navigate(`/courses/${course.Id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow-lg">
                        <ApperIcon name="BookOpen" size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{course.courseCode}</h3>
                        <p className="text-xs text-gray-500">{course.department}</p>
                      </div>
                    </div>
                    <Badge variant={course.status === "active" ? "success" : "danger"}>
                      {course.status}
                    </Badge>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-3 line-clamp-2">
                    {course.courseName}
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Credits</span>
                      <span className="font-semibold text-gray-900">{course.credits}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Semester</span>
                      <span className="font-semibold text-gray-900">{course.semester}</span>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Enrollment</span>
                        <Badge variant={getCapacityColor(course.enrolledCount, course.capacity)}>
                          {course.enrolledCount}/{course.capacity}
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(course.enrolledCount / course.capacity) * 100}%` }}
                        />
                      </div>
                    </div>

                    {facultyMember && (
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                        <ApperIcon name="User" size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {facultyMember.firstName} {facultyMember.lastName}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/courses/${course.Id}`);
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(course.Id);
                      }}
                    >
                      <ApperIcon name="Trash2" size={16} className="text-red-600" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Course"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Create Course
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Course Code"
              id="courseCode"
              required
              placeholder="e.g., CS301"
              value={formData.courseCode}
              onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
            />
            <FormField label="Department" id="department" required>
              <Select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              >
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
              </Select>
            </FormField>
          </div>

          <FormField
            label="Course Name"
            id="courseName"
            required
            placeholder="e.g., Data Structures and Algorithms"
            value={formData.courseName}
            onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Credits"
              id="credits"
              type="number"
              min="1"
              max="6"
              required
              value={formData.credits}
              onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
            />
            <FormField
              label="Semester"
              id="semester"
              type="number"
              min="1"
              max="8"
              required
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
            />
            <FormField
              label="Capacity"
              id="capacity"
              type="number"
              min="10"
              required
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            />
          </div>

          <FormField label="Faculty" id="facultyId" required>
            <Select
              value={formData.facultyId}
              onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
              required
            >
              <option value="">Select Faculty</option>
              {faculty.map((f) => (
                <option key={f.Id} value={f.Id}>
                  {f.firstName} {f.lastName} - {f.designation}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Schedule"
            id="schedule"
            required
            placeholder="e.g., Mon, Wed, Fri 10:00-11:00 AM"
            value={formData.schedule}
            onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
          />
        </form>
      </Modal>
    </div>
  );
};

export default Courses;