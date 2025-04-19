import React from 'react';

interface TableProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isHighlighted?: boolean;
}

const Table: React.FC<TableProps> = ({ children, className = '', onClick }) => {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-neutral-200 ${className}`} onClick={onClick}>
        {children}
      </table>
    </div>
  );
};

export const TableHead: React.FC<TableProps> = ({ children, className = '' }) => {
  return (
    <thead className={`bg-neutral-50 ${className}`}>
      {children}
    </thead>
  );
};

export const TableBody: React.FC<TableProps> = ({ children, className = '' }) => {
  return (
    <tbody className={`bg-white divide-y divide-neutral-200 ${className}`}>
      {children}
    </tbody>
  );
};

const TableRow: React.FC<TableRowProps> = ({ children, className = '', onClick, isHighlighted }) => {
  return (
    <tr 
      className={`${className} ${isHighlighted ? 'bg-indigo-50' : ''} hover:bg-neutral-50 cursor-pointer`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

export const TableCell: React.FC<TableProps> = ({ children, className = '' }) => {
  return (
    <td className={`px-6 py-4 whitespace-nowrap ${className}`}>
      {children}
    </td>
  );
};

export const TableHeaderCell: React.FC<TableProps> = ({ children, className = '' }) => {
  return (
    <th className={`px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider ${className}`}>
      {children}
    </th>
  );
};

export { Table, TableRow };