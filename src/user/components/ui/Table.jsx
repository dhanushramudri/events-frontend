// components/ui/Table.jsx
import React from "react";

export const Table = ({ headers, children }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-4 py-2 border-b font-medium text-gray-700"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export const TableRow = ({ children }) => (
  <tr className="hover:bg-gray-50 border-b">{children}</tr>
);

export const TableCell = ({ children }) => (
  <td className="px-4 py-2 text-gray-800">{children}</td>
);
