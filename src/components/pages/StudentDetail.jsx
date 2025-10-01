import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Courses from "@/components/pages/Courses";
import Attendance from "@/components/pages/Attendance";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import courseService from "@/services/api/courseService";
import studentService from "@/services/api/studentService";
import enrollmentService from "@/services/api/enrollmentService";
import attendanceService from "@/services/api/attendanceService";
const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStudentData();
  }, [id]);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      setError("");

      const studentData = await studentService.getById(id);
      setStudent(studentData);

      const enrollmentData = await enrollmentService.getByStudentId(id);
      setEnrollments(enrollmentData);

      const allCourses = await courseService.getAll();
      const enrolledCourses = allCourses.filter(course =>
        enrollmentData.some(e => e.courseId === String(course.Id))
      );
      setCourses(enrolledCourses);

      const attendanceData = await attendanceService.getByStudentId(id);
      setAttendance(attendanceData);

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const calculateAttendancePercentage = () => {
    if (attendance.length === 0) return 0;
    const present = attendance.filter(a => a.status === "present").length;
    return Math.round((present / attendance.length) * 100);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadStudentData} />;
  if (!student) return <Error message="Student not found" />;

const tabs = [
    { id: "info", label: "Personal Info", icon: "User" },
    { id: "courses", label: "Enrolled Courses", icon: "BookOpen" },
    { id: "attendance", label: "Attendance", icon: "ClipboardCheck" },
    { id: "documents", label: "Documents", icon: "FileText" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/students")}>
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
            <Avatar size="xl" />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {student.firstName} {student.lastName}
                  </h1>
                  <p className="text-gray-600 mt-1">{student.studentId}</p>
                </div>
                <Badge variant={
                  student.status === "active" ? "success" :
                  student.status === "inactive" ? "warning" :
                  student.status === "graduated" ? "info" : "danger"
                }>
                  {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <ApperIcon name="GraduationCap" size={24} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-semibold text-gray-900">{student.department}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <ApperIcon name="BookOpen" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Semester</p>
                    <p className="font-semibold text-gray-900">Semester {student.semester}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-accent-50 to-accent-100 rounded-lg">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <ApperIcon name="ClipboardCheck" size={24} className="text-accent-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Attendance</p>
                    <p className="font-semibold text-gray-900">{calculateAttendancePercentage()}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "text-primary-700 border-b-2 border-primary-700"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <ApperIcon name={tab.icon} size={20} />
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {activeTab === "info" && (
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900 mt-1">{student.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-gray-900 mt-1">{student.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                <p className="text-gray-900 mt-1">{format(new Date(student.dateOfBirth), "MMMM d, yyyy")}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Enrollment Date</label>
                <p className="text-gray-900 mt-1">{format(new Date(student.enrollmentDate), "MMMM d, yyyy")}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Address</label>
                <p className="text-gray-900 mt-1">{student.address}</p>
              </div>
            </div>
          </Card>
)}

        {activeTab === "documents" && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Student Documents
            </h3>
            {student.aadharCardPdf ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <ApperIcon name="FileText" size={24} className="text-primary-700" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {student.aadharCardFileName || "Aadhaar Card"}
                      </p>
                      <p className="text-sm text-gray-500">PDF Document</p>
                    </div>
                  </div>
                  <a
                    href={student.aadharCardPdf}
                    download={student.aadharCardFileName || "aadhaar-card.pdf"}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <ApperIcon name="Download" size={16} />
                    Download
                  </a>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    src={student.aadharCardPdf}
                    className="w-full h-[600px]"
                    title="Aadhaar Card PDF"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <ApperIcon name="FileText" size={32} className="text-gray-400" />
                </div>
                <p className="text-gray-500">No documents uploaded</p>
              </div>
            )}
          </Card>
        )}
        {activeTab === "courses" && (
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Enrolled Courses</h2>
            {courses.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No courses enrolled yet
              </div>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => (
                  <div
                    key={course.Id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                    onClick={() => navigate(`/courses/${course.Id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
                        <ApperIcon name="BookOpen" size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{course.courseName}</h3>
                        <p className="text-sm text-gray-600">{course.courseCode} • {course.credits} Credits</p>
                      </div>
                    </div>
                    <ApperIcon name="ChevronRight" size={20} className="text-gray-400" />
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {activeTab === "attendance" && (
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Attendance Records</h2>
            {attendance.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No attendance records found
              </div>
            ) : (
              <div className="space-y-3">
                {attendance.slice(0, 10).map((record) => {
                  const course = courses.find(c => c.Id === parseInt(record.courseId));
                  return (
                    <div
                      key={record.Id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          record.status === "present" ? "bg-accent-100" :
                          record.status === "late" ? "bg-yellow-100" : "bg-red-100"
                        }`}>
                          <ApperIcon
                            name={record.status === "present" ? "Check" : record.status === "late" ? "Clock" : "X"}
                            size={20}
                            className={
                              record.status === "present" ? "text-accent-600" :
                              record.status === "late" ? "text-yellow-600" : "text-red-600"
                            }
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{course?.courseName || "Unknown Course"}</p>
                          <p className="text-sm text-gray-600">{format(new Date(record.date), "MMMM d, yyyy")}</p>
                        </div>
                      </div>
                      <Badge variant={
                        record.status === "present" ? "success" :
                        record.status === "late" ? "warning" : "danger"
                      }>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        )}
      </motion.div>
</div>
    </div>
  );
};

export default StudentDetail;