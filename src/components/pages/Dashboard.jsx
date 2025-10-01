import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import studentService from "@/services/api/studentService";
import courseService from "@/services/api/courseService";
import attendanceService from "@/services/api/attendanceService";
import { format } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [students, courses, attendance] = await Promise.all([
        studentService.getAll(),
        courseService.getAll(),
        attendanceService.getAll()
      ]);

      const activeStudents = students.filter(s => s.status === "active").length;
      const activeCourses = courses.filter(c => c.status === "active").length;
      const totalEnrollments = courses.reduce((sum, c) => sum + c.enrolledCount, 0);
      
      const presentToday = attendance.filter(a => 
        a.date === new Date().toISOString().split("T")[0] && a.status === "present"
      ).length;
      const attendanceRate = attendance.length > 0
        ? Math.round((attendance.filter(a => a.status === "present").length / attendance.length) * 100)
        : 0;

      setStats({
        students: activeStudents,
        courses: activeCourses,
        enrollments: totalEnrollments,
        attendance: attendanceRate
      });

      const activity = [
        { id: 1, type: "enrollment", message: "New student enrolled in CS301", time: "2 hours ago", icon: "UserPlus" },
        { id: 2, type: "course", message: "Database Management course updated", time: "3 hours ago", icon: "BookOpen" },
        { id: 3, type: "attendance", message: "Attendance marked for ME301", time: "5 hours ago", icon: "ClipboardCheck" },
        { id: 4, type: "faculty", message: "New faculty member added", time: "1 day ago", icon: "Users" },
        { id: 5, type: "student", message: "Student profile updated", time: "1 day ago", icon: "User" }
      ];
      setRecentActivity(activity);

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <Loading type="stats" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="md">
            <ApperIcon name="Download" size={18} className="mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Total Students"
          value={stats?.students || 0}
          icon="GraduationCap"
          trend="up"
          trendValue="12%"
          color="primary"
        />
        <StatCard
          title="Active Courses"
          value={stats?.courses || 0}
          icon="BookOpen"
          trend="up"
          trendValue="8%"
          color="info"
        />
        <StatCard
          title="Total Enrollments"
          value={stats?.enrollments || 0}
          icon="UserPlus"
          color="success"
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats?.attendance || 0}%`}
          icon="ClipboardCheck"
          trend={stats?.attendance >= 85 ? "up" : "down"}
          trendValue={stats?.attendance >= 85 ? "Good" : "Low"}
          color={stats?.attendance >= 85 ? "success" : "warning"}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              <Button variant="ghost" size="sm">
                View All
                <ApperIcon name="ArrowRight" size={16} className="ml-2" />
              </Button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200">
                    <ApperIcon name={activity.icon} size={20} className="text-primary-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full justify-start"
                onClick={() => navigate("/students")}
              >
                <ApperIcon name="UserPlus" size={18} className="mr-3" />
                Add New Student
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-start"
                onClick={() => navigate("/courses")}
              >
                <ApperIcon name="BookPlus" size={18} className="mr-3" />
                Create Course
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/attendance")}
              >
                <ApperIcon name="ClipboardCheck" size={18} className="mr-3" />
                Mark Attendance
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/faculty")}
              >
                <ApperIcon name="Users" size={18} className="mr-3" />
                Add Faculty
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-primary-50 to-primary-100">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 rounded-lg bg-white shadow-sm">
                <ApperIcon name="Calendar" size={24} className="text-primary-600" />
              </div>
<div>
                <h3 className="font-bold text-gray-900">Today's Schedule</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {(() => {
                    try {
                      const today = new Date();
                      return today.toString() !== 'Invalid Date' 
                        ? format(today, "EEEE, MMMM d, yyyy")
                        : "Date unavailable";
                    } catch (err) {
                      return "Date unavailable";
                    }
                  })()}
                </p>
              </div>
            </div>
            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">CS301 - Data Structures</p>
                  <p className="text-xs text-gray-500">10:00 AM - 11:00 AM</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">ME301 - Thermodynamics</p>
                  <p className="text-xs text-gray-500">2:00 PM - 3:30 PM</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;