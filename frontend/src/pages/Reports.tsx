import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  LineChart, 
  PieChart, 
  FileText, 
  Calendar, 
  Download, 
  Play, 
  Plus,
  FileSpreadsheet,
  Files,
  Filter,
  Search,
  ChevronDown,
  AlertCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Table, TableRow } from '../components/ui/Table';
import {
  TableHead,
  TableBody,
  TableCell,
  TableHeaderCell,
} from '../components/ui/Table';
import { warehouses, users } from '../data/data';
import { format } from 'date-fns';
import Badge from '../components/ui/Badge';
import Dialog from '../components/ui/Dialog';

interface Report {
  id: string;
  name: string;
  type: 'financial' | 'inventory' | 'performance' | 'security';
  lastRun: string;
  schedule: 'Daily' | 'Weekly' | 'Monthly';
  data: any[];
  format: 'excel' | 'csv' | 'json';
}

interface InventoryItem {
  name: string;
  category: string;
  quantity: number;
  min_quantity: number;
}

const mockInventory: InventoryItem[] = [
  { name: 'Product A', category: 'Electronics', quantity: 100, min_quantity: 50 },
  { name: 'Product B', category: 'Furniture', quantity: 30, min_quantity: 20 },
  { name: 'Product C', category: 'Office Supplies', quantity: 200, min_quantity: 100 },
];

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [reports, setReports] = useState<Report[]>([]);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Generate dynamic reports based on data
    const generatedReports: Report[] = [
      {
        id: '1',
        name: 'Warehouse Performance',
        type: 'performance',
        lastRun: new Date().toISOString(),
        schedule: 'Weekly',
        data: warehouses.map(wh => ({
          name: wh.name,
          location: wh.location,
          utilization: Math.floor(Math.random() * 100),
          efficiency: Math.floor(Math.random() * 100),
          accuracy: Math.floor(Math.random() * 100)
        })),
        format: 'excel'
      },
      {
        id: '2',
        name: 'Inventory Status',
        type: 'inventory',
        lastRun: new Date().toISOString(),
        schedule: 'Daily',
        data: mockInventory.map(item => ({
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          status: item.quantity < item.min_quantity ? 'Low Stock' : 'In Stock'
        })),
        format: 'csv'
      },
      {
        id: '3',
        name: 'User Activity',
        type: 'security',
        lastRun: new Date().toISOString(),
        schedule: 'Monthly',
        data: users.map(user => ({
          name: user.username,
          role: user.role,
          lastLogin: new Date().toISOString(),
          status: 'Active'
        })),
        format: 'json'
      }
    ];
    setReports(generatedReports);
  }, []);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || report.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDownload = async (report: Report) => {
    try {
      setIsDownloading(report.id);
      setError(null);

      // Create a blob from the report data
      let content: string;
      let mimeType: string;
      let filename: string;

      switch (report.format) {
        case 'excel':
          // For Excel, we'll create a CSV format that Excel can open
          const excelHeaders = Object.keys(report.data[0]).join(',');
          const excelRows = report.data.map(row => 
            Object.values(row).map(value => 
              typeof value === 'string' && value.includes(',') ? `"${value}"` : value
            ).join(',')
          );
          content = [excelHeaders, ...excelRows].join('\n');
          mimeType = 'text/csv';
          filename = `${report.name}.csv`;
          break;
        case 'csv':
          const headers = Object.keys(report.data[0]).join(',');
          const rows = report.data.map(row => 
            Object.values(row).map(value => 
              typeof value === 'string' && value.includes(',') ? `"${value}"` : value
            ).join(',')
          );
          content = [headers, ...rows].join('\n');
          mimeType = 'text/csv';
          filename = `${report.name}.csv`;
          break;
        case 'json':
          content = JSON.stringify(report.data, null, 2);
          mimeType = 'application/json';
          filename = `${report.name}.json`;
          break;
        default:
          throw new Error('Unsupported format');
      }

      // Create a blob and download link
      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Update last run time
      setReports(reports.map(r => 
        r.id === report.id ? { ...r, lastRun: new Date().toISOString() } : r
      ));
    } catch (err) {
      console.error('Error downloading report:', err);
      setError('Failed to download report. Please try again.');
    } finally {
      setIsDownloading(null);
    }
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'financial':
        return 'bg-green-100 text-green-800';
      case 'inventory':
        return 'bg-blue-100 text-blue-800';
      case 'performance':
        return 'bg-purple-100 text-purple-800';
      case 'security':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'excel':
        return <FileSpreadsheet size={16} />;
      case 'csv':
        return <Files size={16} />;
      case 'json':
        return <FileText size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Reports & Analytics</h1>
            <p className="text-slate-500 mt-2">Generate and manage reports for your organization</p>
          </div>
          
          <Button 
            variant="primary" 
            leftIcon={<Plus size={18} />}
            className="w-full lg:w-auto bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
          >
            New Report
          </Button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Reports</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">{reports.length}</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl">
                <FileText className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Daily Reports</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">
                  {reports.filter(r => r.schedule === 'Daily').length}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Weekly Reports</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">
                  {reports.filter(r => r.schedule === 'Weekly').length}
                </p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl">
                <AlertCircle className="w-8 h-8 text-amber-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Monthly Reports</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">
                  {reports.filter(r => r.schedule === 'Monthly').length}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <Clock className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Search and Filter Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search reports..."
                  className="pl-12 pr-4 py-3 w-full border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
              >
                <option value="all">All Types</option>
                <option value="financial">Financial</option>
                <option value="inventory">Inventory</option>
                <option value="performance">Performance</option>
                <option value="security">Security</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Report Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Run</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Schedule</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Format</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-800">{report.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={report.type as any} className="capitalize">
                        {report.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {format(new Date(report.lastRun), 'MMM d, yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {report.schedule}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-slate-600">
                        {getFormatIcon(report.format)}
                        <span className="ml-2 text-sm font-medium">{report.format.toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownload(report)}
                          disabled={isDownloading === report.id}
                          className={`p-2 rounded-lg transition-colors ${
                            isDownloading === report.id
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50'
                          }`}
                          title="Download report"
                        >
                          {isDownloading === report.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-600"></div>
                          ) : (
                            <Download size={18} />
                          )}
                        </button>
                        
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Error Dialog */}
        {error && (
          <Dialog isOpen={!!error} onClose={() => setError(null)} title="Error">
            <div className="space-y-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <div className="text-center">
                <p className="text-slate-600">{error}</p>
              </div>
              <div className="flex justify-end">
                <Button 
                  variant="primary" 
                  onClick={() => setError(null)}
                  className="px-6 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
                >
                  Close
                </Button>
              </div>
            </div>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default Reports;