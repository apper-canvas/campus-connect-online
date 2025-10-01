import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const DataTable = ({
  columns,
  data,
  onRowClick,
  actions,
  className,
}) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className={cn("overflow-x-auto rounded-lg border border-gray-200", className)}>
      <table className="w-full">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <tr>
            {columns.map((column) => (
              <th
                key={column.field}
                className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                <div
                  className={cn(
                    "flex items-center gap-2",
                    column.sortable && "cursor-pointer hover:text-primary-600 transition-colors duration-200"
                  )}
                  onClick={() => column.sortable && handleSort(column.field)}
                >
                  {column.label}
                  {column.sortable && (
                    <ApperIcon
                      name={
                        sortField === column.field
                          ? sortDirection === "asc"
                            ? "ChevronUp"
                            : "ChevronDown"
                          : "ChevronsUpDown"
                      }
                      size={16}
                      className="text-gray-400"
                    />
                  )}
                </div>
              </th>
            ))}
            {actions && (
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {sortedData.map((row, rowIndex) => (
            <tr
              key={row.Id || rowIndex}
              className={cn(
                "transition-colors duration-150",
                onRowClick && "cursor-pointer hover:bg-primary-50"
              )}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <td
                  key={column.field}
                  className="px-6 py-4 text-sm text-gray-900"
                >
                  {column.render ? column.render(row[column.field], row) : row[column.field]}
                </td>
              ))}
              {actions && (
                <td className="px-6 py-4 text-right text-sm" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2">
                    {actions(row)}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;