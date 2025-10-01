import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry, type = "general" }) => {
  const isNetworkError = message?.toLowerCase().includes("network") || type === "network";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] text-center px-4"
    >
      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${
        isNetworkError 
          ? "from-orange-100 to-orange-200" 
          : "from-red-100 to-red-200"
      } flex items-center justify-center mb-6 shadow-lg`}>
        <ApperIcon 
          name={isNetworkError ? "WifiOff" : "AlertCircle"} 
          size={40} 
          className={isNetworkError ? "text-orange-600" : "text-red-600"} 
        />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        {isNetworkError ? "Connection Issue" : "Oops!"}
      </h3>
      <p className="text-gray-600 mb-2 max-w-md">{message}</p>
      {isNetworkError && (
        <p className="text-sm text-gray-500 mb-6 max-w-md">
          Please check your internet connection or try again in a moment.
        </p>
      )}
      {onRetry && (
        <Button onClick={onRetry} variant="primary" size="lg">
          <ApperIcon name="RefreshCw" size={18} className="mr-2" />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default Error;