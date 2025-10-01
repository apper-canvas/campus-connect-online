import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ className }) => {
  const navItems = [
    { path: "/dashboard", icon: "LayoutDashboard", label: "Dashboard" },
    { path: "/students", icon: "GraduationCap", label: "Students" },
    { path: "/courses", icon: "BookOpen", label: "Courses" },
    { path: "/faculty", icon: "Users", label: "Faculty" },
    { path: "/attendance", icon: "ClipboardCheck", label: "Attendance" },
  ];

  return (
    <aside className={cn("bg-gradient-to-b from-primary-900 to-primary-800 text-white", className)}>
      <div className="p-6 border-b border-primary-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-white to-primary-100 flex items-center justify-center shadow-lg">
            <ApperIcon name="GraduationCap" size={24} className="text-primary-800" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">
              Campus Connect
            </h1>
            <p className="text-xs text-primary-300">College Management</p>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                "hover:bg-primary-700 hover:shadow-md hover:translate-x-1",
                isActive
                  ? "bg-gradient-to-r from-primary-700 to-primary-600 shadow-lg border-l-4 border-white"
                  : "text-primary-100"
              )
            }
          >
            {({ isActive }) => (
              <>
                <ApperIcon name={item.icon} size={20} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <ApperIcon name="ChevronRight" size={16} className="ml-auto" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary-700">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-700 bg-opacity-50">
          <ApperIcon name="HelpCircle" size={20} />
          <div className="flex-1">
            <p className="text-sm font-medium">Need Help?</p>
            <p className="text-xs text-primary-300">Contact Support</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;