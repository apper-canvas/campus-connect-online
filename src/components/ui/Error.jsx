import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] text-center px-4"
    >
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center mb-6 shadow-lg">
        <ApperIcon name="AlertCircle" size={40} className="text-red-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h3>
      <p className="text-gray-600 mb-8 max-w-md">{message}</p>
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