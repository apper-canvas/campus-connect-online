import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import facultyService from "@/services/api/facultyService";
import courseService from "@/services/api/courseService";
import { format } from "date-fns";

const FacultyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFacultyData();
  }, [id]);

  const loadFacultyData = async () => {
    try {
      setLoading(true);
      setError("");

      const facultyData = await facultyService.getById(id);
      setFaculty(facultyData);

      const allCourses = await courseService.getAll();
      const assignedCourses = allCourses.filter(course =>
        facultyData.assignedCourses.includes(String(course.Id))
      );
      setCourses(assignedCourses);

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadFacultyData} />;
  if (!faculty) return <Error message="Faculty member not found" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/faculty")}>
          <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
          Back
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {faculty.firstName[0]}{faculty.lastName[0]}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {faculty.firstName} {faculty.lastName}
              </h1>
              <p className="text-lg text-gray-600 mt-1">{faculty.designation}</p>
              <p className="text-sm text-gray-500 mt-1">{faculty.employeeId}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <ApperIcon name="Building2" size={24} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-semibold text-gray-900">{faculty.department}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <ApperIcon name="GraduationCap" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Qualification</p>
                    <p className="font-semibold text-gray-900 text-sm">{faculty.qualification}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-accent-50 to-accent-100 rounded-lg">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <ApperIcon name="BookOpen" size={24} className="text-accent-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Courses</p>
                    <p className="font-semibold text-gray-900">{courses.length} Assigned</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <ApperIcon name="Mail" size={20} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{faculty.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <ApperIcon name="Phone" size={20} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">{faculty.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <ApperIcon name="Calendar" size={20} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Joining Date</p>
                  <p className="font-medium text-gray-900">
{faculty.joiningDate && new Date(faculty.joiningDate).toString() !== 'Invalid Date'
                      ? format(new Date(faculty.joiningDate), "MMMM d, yyyy")
                      : "Date not available"}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Assigned Courses</h2>
            {courses.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No courses assigned yet
              </div>
            ) : (
              <div className="space-y-3">
                {courses.map((course) => (
                  <div
                    key={course.Id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                    onClick={() => navigate(`/courses/${course.Id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
                        <ApperIcon name="BookOpen" size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{course.courseName}</h3>
                        <p className="text-sm text-gray-600">
                          {course.courseCode} • Semester {course.semester}
                        </p>
                      </div>
                    </div>
                    <ApperIcon name="ChevronRight" size={20} className="text-gray-400" />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default FacultyDetail;