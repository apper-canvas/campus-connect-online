import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import courseService from "@/services/api/courseService";
import enrollmentService from "@/services/api/enrollmentService";
import studentService from "@/services/api/studentService";
import attendanceService from "@/services/api/attendanceService";
import { format } from "date-fns";

const Attendance = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse && selectedDate) {
      loadStudentsAndAttendance();
    }
  }, [selectedCourse, selectedDate]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await courseService.getAll();
      const activeCourses = data.filter(c => c.status === "active");
      setCourses(activeCourses);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const loadStudentsAndAttendance = async () => {
    try {
      setLoading(true);
      const enrollments = await enrollmentService.getByCourseId(selectedCourse);
      const allStudents = await studentService.getAll();
      
      const enrolledStudents = allStudents.filter(student =>
        enrollments.some(e => e.studentId === String(student.Id))
      );
      setStudents(enrolledStudents);

      const existingAttendance = await attendanceService.getByCourseAndDate(
        selectedCourse,
        selectedDate
      );

      const attendanceMap = {};
      existingAttendance.forEach(record => {
        attendanceMap[record.studentId] = record.status;
      });
      setAttendance(attendanceMap);

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleMarkAll = (status) => {
    const newAttendance = {};
    students.forEach(student => {
      newAttendance[student.Id] = status;
    });
    setAttendance(newAttendance);
  };

  const handleSubmit = async () => {
    if (!selectedCourse || !selectedDate) {
      toast.error("Please select a course and date");
      return;
    }

    try {
      setSaving(true);
      const records = Object.entries(attendance).map(([studentId, status]) => ({
        studentId: String(studentId),
        courseId: String(selectedCourse),
        date: selectedDate,
        status,
        markedBy: "Admin",
        remarks: ""
      }));

      await attendanceService.bulkCreate(records);
      toast.success("Attendance marked successfully!");
      setSaving(false);
    } catch (err) {
      toast.error(err.message);
      setSaving(false);
    }
  };

  if (loading && courses.length === 0) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCourses} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent">
          Attendance Management
        </h1>
        <p className="text-gray-600 mt-1">Mark and track student attendance</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <FormField label="Select Course" id="course">
              <Select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="">Choose a course...</option>
                {courses.map((course) => (
                  <option key={course.Id} value={course.Id}>
                    {course.courseCode} - {course.courseName}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Select Date" id="date">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </FormField>
          </div>

          {selectedCourse && (
            <div className="flex gap-2">
              <Button
                variant="success"
                size="sm"
                onClick={() => handleMarkAll("present")}
              >
                <ApperIcon name="CheckCircle" size={16} className="mr-2" />
                Mark All Present
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleMarkAll("absent")}
              >
                <ApperIcon name="XCircle" size={16} className="mr-2" />
                Mark All Absent
              </Button>
            </div>
          )}
        </Card>
      </motion.div>

      {selectedCourse && students.length === 0 && !loading && (
        <Empty
          title="No students enrolled"
          message="This course doesn't have any enrolled students yet"
          icon="Users"
        />
      )}

      {selectedCourse && students.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Student List ({students.length})
              </h2>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Attendance"}
              </Button>
            </div>

            <div className="space-y-3">
              {students.map((student, index) => (
                <motion.div
                  key={student.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
                      {student.firstName[0]}{student.lastName[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{student.studentId}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant={attendance[student.Id] === "present" ? "success" : "outline"}
                      size="sm"
                      onClick={() => handleAttendanceChange(student.Id, "present")}
                    >
                      <ApperIcon name="Check" size={16} className="mr-1" />
                      Present
                    </Button>
                    <Button
                      variant={attendance[student.Id] === "late" ? "warning" : "outline"}
                      size="sm"
                      onClick={() => handleAttendanceChange(student.Id, "late")}
                    >
                      <ApperIcon name="Clock" size={16} className="mr-1" />
                      Late
                    </Button>
                    <Button
                      variant={attendance[student.Id] === "absent" ? "danger" : "outline"}
                      size="sm"
                      onClick={() => handleAttendanceChange(student.Id, "absent")}
                    >
                      <ApperIcon name="X" size={16} className="mr-1" />
                      Absent
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Attendance;