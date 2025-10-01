import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ title, value, icon, trend, trendValue, color = "primary" }) => {
  const colorClasses = {
    primary: "from-primary-500 to-primary-600 text-primary-700",
    success: "from-accent-500 to-accent-600 text-accent-700",
    warning: "from-yellow-500 to-yellow-600 text-yellow-700",
    danger: "from-red-500 to-red-600 text-red-700",
    info: "from-blue-500 to-blue-600 text-blue-700",
  };

  return (
    <Card className="p-6 hover:scale-[1.02] transition-transform duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {value}
            </h3>
            {trend && (
              <span className={cn(
                "flex items-center text-sm font-medium",
                trend === "up" ? "text-accent-600" : "text-red-600"
              )}>
                <ApperIcon
                  name={trend === "up" ? "TrendingUp" : "TrendingDown"}
                  size={16}
                  className="mr-1"
                />
                {trendValue}
              </span>
            )}
          </div>
        </div>
        <div className={cn(
          "p-3 rounded-lg bg-gradient-to-br shadow-md",
          colorClasses[color]
        )}>
          <ApperIcon name={icon} size={24} className="text-white" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;