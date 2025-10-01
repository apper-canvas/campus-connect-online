import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import DataTable from "@/components/molecules/DataTable";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import courseService from "@/services/api/courseService";
import enrollmentService from "@/services/api/enrollmentService";
import studentService from "@/services/api/studentService";
import facultyService from "@/services/api/facultyService";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [faculty, setFaculty] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCourseData();
  }, [id]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      setError("");

      const courseData = await courseService.getById(id);
      setCourse(courseData);

      const facultyData = await facultyService.getById(courseData.facultyId);
      setFaculty(facultyData);

      const enrollments = await enrollmentService.getByCourseId(id);
      const allStudents = await studentService.getAll();
      
      const students = allStudents.filter(student =>
        enrollments.some(e => e.studentId === String(student.Id))
      );
      setEnrolledStudents(students);

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCourseData} />;
  if (!course) return <Error message="Course not found" />;

  const columns = [
    {
      field: "studentId",
      label: "Student ID",
      sortable: true
    },
    {
      field: "firstName",
      label: "Name",
      sortable: true,
      render: (_, student) => `${student.firstName} ${student.lastName}`
    },
    {
      field: "email",
      label: "Email",
      sortable: true
    },
    {
      field: "semester",
      label: "Semester",
      sortable: true
    },
    {
      field: "status",
      label: "Status",
      render: (status) => (
        <Badge variant={status === "active" ? "success" : "danger"}>
          {status}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/courses")}>
          <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
          Back
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow-lg">
                <ApperIcon name="BookOpen" size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{course.courseName}</h1>
                <p className="text-gray-600 mt-1">{course.courseCode} • {course.department}</p>
              </div>
            </div>
            <Badge variant={course.status === "active" ? "success" : "danger"}>
              {course.status}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <ApperIcon name="Award" size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Credits</p>
                  <p className="font-bold text-gray-900">{course.credits}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <ApperIcon name="Calendar" size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Semester</p>
                  <p className="font-bold text-gray-900">{course.semester}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-accent-50 to-accent-100 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <ApperIcon name="Users" size={20} className="text-accent-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Enrolled</p>
                  <p className="font-bold text-gray-900">{course.enrolledCount}/{course.capacity}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <ApperIcon name="Clock" size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Schedule</p>
                  <p className="font-semibold text-gray-900 text-xs">{course.schedule}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {faculty && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Faculty Information</h2>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                {faculty.firstName[0]}{faculty.lastName[0]}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {faculty.firstName} {faculty.lastName}
                </h3>
                <p className="text-sm text-gray-600">{faculty.designation}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{faculty.email}</p>
                <p className="text-sm text-gray-600">{faculty.phone}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Enrolled Students ({enrolledStudents.length})
            </h2>
          </div>
          
          {enrolledStudents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No students enrolled yet
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={enrolledStudents}
              onRowClick={(student) => navigate(`/students/${student.Id}`)}
              actions={(student) => (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/students/${student.Id}`)}
                >
                  <ApperIcon name="Eye" size={16} />
                </Button>
              )}
            />
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default CourseDetail;