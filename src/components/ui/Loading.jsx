import { motion } from "framer-motion";

const Loading = ({ rows = 5, type = "table" }) => {
  if (type === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-lg shadow-md p-6 space-y-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3 animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-5/6 animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "stats") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2 animate-pulse" />
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 animate-pulse" />
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4">
          <div className="flex gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded flex-1 animate-pulse"
              />
            ))}
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {[...Array(rows)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="p-4"
            >
              <div className="flex gap-4">
                {[...Array(4)].map((_, j) => (
                  <div
                    key={j}
                    className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded flex-1 animate-pulse"
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;