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
  TrendingUp,
  X,
  FileBarChart
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale
} from 'chart.js';
import { Bar, Line, Pie, Radar } from 'react-chartjs-2';
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

interface NewReportForm {
  name: string;
  type: 'financial' | 'inventory' | 'performance' | 'security';
  schedule: 'Daily' | 'Weekly' | 'Monthly';
  format: 'excel' | 'csv' | 'json';
}

interface MasterReportData {
  summary: {
    totalUsers: number;
    totalWarehouses: number;
    totalRevenue: number;
    totalInventory: number;
  };
  users: any[];
  warehouses: any[];
  financial: any[];
  inventory: any[];
  performance: any[];
}

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale
);

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [reports, setReports] = useState<Report[]>([]);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isNewReportOpen, setIsNewReportOpen] = useState(false);
  const [newReport, setNewReport] = useState<NewReportForm>({
    name: '',
    type: 'inventory',
    schedule: 'Daily',
    format: 'excel'
  });
  const [isMasterReportOpen, setIsMasterReportOpen] = useState(false);
  const [masterReportFormat, setMasterReportFormat] = useState<'excel' | 'csv' | 'json'>('excel');
  
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

  const handleCreateReport = () => {
    if (!newReport.name.trim()) {
      setError('Report name is required');
      return;
    }

    const newReportData: Report = {
      id: Date.now().toString(),
      name: newReport.name,
      type: newReport.type,
      lastRun: new Date().toISOString(),
      schedule: newReport.schedule,
      format: newReport.format,
      data: generateReportData(newReport.type)
    };

    setReports([...reports, newReportData]);
    setIsNewReportOpen(false);
    setNewReport({
      name: '',
      type: 'inventory',
      schedule: 'Daily',
      format: 'excel'
    });
  };

  const generateReportData = (type: string) => {
    switch (type) {
      case 'financial':
        return Array.from({ length: 5 }, (_, i) => ({
          month: `Month ${i + 1}`,
          revenue: Math.floor(Math.random() * 100000),
          expenses: Math.floor(Math.random() * 50000),
          profit: Math.floor(Math.random() * 50000)
        }));
      case 'inventory':
        return mockInventory;
      case 'performance':
        return warehouses.map(wh => ({
          name: wh.name,
          location: wh.location,
          utilization: Math.floor(Math.random() * 100),
          efficiency: Math.floor(Math.random() * 100),
          accuracy: Math.floor(Math.random() * 100)
        }));
      case 'security':
        return users.map(user => ({
          name: user.username,
          role: user.role,
          lastLogin: new Date().toISOString(),
          status: 'Active'
        }));
      default:
        return [];
    }
  };

  const generateMasterReport = () => {
    const masterReport: MasterReportData = {
      summary: {
        totalUsers: users.length,
        totalWarehouses: warehouses.length,
        totalRevenue: warehouses.reduce((sum, wh) => sum + (Math.random() * 100000), 0),
        totalInventory: mockInventory.reduce((sum, item) => sum + item.quantity, 0)
      },
      users: users.map(user => ({
        username: user.username,
        role: user.role,
        lastLogin: new Date().toISOString(),
        status: 'Active'
      })),
      warehouses: warehouses.map(wh => ({
        name: wh.name,
        location: wh.location,
        capacity: Math.floor(Math.random() * 1000),
        currentUtilization: Math.floor(Math.random() * 100)
      })),
      financial: Array.from({ length: 12 }, (_, i) => ({
        month: `Month ${i + 1}`,
        revenue: Math.floor(Math.random() * 100000),
        expenses: Math.floor(Math.random() * 50000),
        profit: Math.floor(Math.random() * 50000)
      })),
      inventory: mockInventory,
      performance: warehouses.map(wh => ({
        name: wh.name,
        location: wh.location,
        utilization: Math.floor(Math.random() * 100),
        efficiency: Math.floor(Math.random() * 100),
        accuracy: Math.floor(Math.random() * 100)
      }))
    };

    return masterReport;
  };

  const handleMasterReportDownload = () => {
    const masterReport = generateMasterReport();
    let content: string;
    let mimeType: string;
    let filename: string;

    switch (masterReportFormat) {
      case 'excel':
      case 'csv':
        // For Excel/CSV, we'll create a structured format
        const summaryHeaders = Object.keys(masterReport.summary).join(',');
        const summaryRow = Object.values(masterReport.summary).join(',');
        
        const usersHeaders = Object.keys(masterReport.users[0]).join(',');
        const usersRows = masterReport.users.map(user => 
          Object.values(user).map(value => 
            typeof value === 'string' && value.includes(',') ? `"${value}"` : value
          ).join(',')
        );

        const warehousesHeaders = Object.keys(masterReport.warehouses[0]).join(',');
        const warehousesRows = masterReport.warehouses.map(wh => 
          Object.values(wh).map(value => 
            typeof value === 'string' && value.includes(',') ? `"${value}"` : value
          ).join(',')
        );

        content = [
          'SUMMARY',
          summaryHeaders,
          summaryRow,
          '\nUSERS',
          usersHeaders,
          ...usersRows,
          '\nWAREHOUSES',
          warehousesHeaders,
          ...warehousesRows,
          '\nFINANCIAL',
          'month,revenue,expenses,profit',
          ...masterReport.financial.map(f => `${f.month},${f.revenue},${f.expenses},${f.profit}`),
          '\nINVENTORY',
          'name,category,quantity,min_quantity',
          ...masterReport.inventory.map(i => `${i.name},${i.category},${i.quantity},${i.min_quantity}`),
          '\nPERFORMANCE',
          'name,location,utilization,efficiency,accuracy',
          ...masterReport.performance.map(p => `${p.name},${p.location},${p.utilization},${p.efficiency},${p.accuracy}`)
        ].join('\n');

        mimeType = 'text/csv';
        filename = 'master_report.csv';
        break;

      case 'json':
        content = JSON.stringify(masterReport, null, 2);
        mimeType = 'application/json';
        filename = 'master_report.json';
        break;
    }

    // Create and trigger download
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    setIsMasterReportOpen(false);
  };

  // Chart data preparation
  const financialChartData = {
    labels: Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`),
    datasets: [
      {
        label: 'Revenue',
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100000)),
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 50000)),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      }
    ],
  };

  const inventoryChartData = {
    labels: mockInventory.map(item => item.name),
    datasets: [
      {
        label: 'Current Quantity',
        data: mockInventory.map(item => item.quantity),
        backgroundColor: [
          'rgba(99, 102, 241, 0.5)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(245, 158, 11, 0.5)',
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
        ],
        borderWidth: 1,
      }
    ],
  };

  const performanceChartData = {
    labels: ['Utilization', 'Efficiency', 'Accuracy'],
    datasets: warehouses.map((wh, index) => ({
      label: wh.name,
      data: [
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100)
      ],
      backgroundColor: `rgba(${index * 50}, ${index * 100}, ${index * 150}, 0.2)`,
      borderColor: `rgb(${index * 50}, ${index * 100}, ${index * 150})`,
      borderWidth: 1,
    })),
  };

  const userActivityChartData = {
    labels: users.map(user => user.username),
    datasets: [
      {
        label: 'Activity Score',
        data: users.map(() => Math.floor(Math.random() * 100)),
        backgroundColor: 'rgba(139, 92, 246, 0.5)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 1,
      }
    ],
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
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Button 
              variant="primary"
              leftIcon={<FileBarChart size={18} />}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              onClick={() => setIsMasterReportOpen(true)}
            >
              Master Report
            </Button>
            <Button 
              variant="primary"
              leftIcon={<Plus size={18} />}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
              onClick={() => setIsNewReportOpen(true)}
            >
              New Report
            </Button>
          </div>
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
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Financial Performance Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Financial Performance</h3>
              <BarChart2 className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="h-80">
              <Line
                data={financialChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Inventory Status Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Inventory Status</h3>
              <PieChart className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="h-80">
              <Pie
                data={inventoryChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right' as const,
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Warehouse Performance Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Warehouse Performance</h3>
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="h-80">
              <Radar
                data={performanceChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right' as const,
                    },
                  },
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 100,
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* User Activity Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">User Activity</h3>
              <LineChart className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="h-80">
              <Bar
                data={userActivityChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                  },
                }}
              />
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

        {/* New Report Dialog */}
        <Dialog 
          isOpen={isNewReportOpen} 
          onClose={() => setIsNewReportOpen(false)}
          title="Create New Report"
        >
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Report Name
                </label>
                <input
                  type="text"
                  value={newReport.name}
                  onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter report name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Report Type
                </label>
                <select
                  value={newReport.type}
                  onChange={(e) => setNewReport({ ...newReport, type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="financial">Financial</option>
                  <option value="inventory">Inventory</option>
                  <option value="performance">Performance</option>
                  <option value="security">Security</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Schedule
                </label>
                <select
                  value={newReport.schedule}
                  onChange={(e) => setNewReport({ ...newReport, schedule: e.target.value as any })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Format
                </label>
                <select
                  value={newReport.format}
                  onChange={(e) => setNewReport({ ...newReport, format: e.target.value as any })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsNewReportOpen(false)}
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateReport}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
              >
                Create Report
              </Button>
            </div>
          </div>
        </Dialog>

        {/* Master Report Dialog */}
        <Dialog 
          isOpen={isMasterReportOpen} 
          onClose={() => setIsMasterReportOpen(false)}
          title="Generate Master Report"
        >
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Report Format
                </label>
                <select
                  value={masterReportFormat}
                  onChange={(e) => setMasterReportFormat(e.target.value as any)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </select>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-slate-700 mb-2">Report Contents:</h3>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>• Summary Statistics</li>
                  <li>• User Information</li>
                  <li>• Warehouse Details</li>
                  <li>• Financial Data</li>
                  <li>• Inventory Status</li>
                  <li>• Performance Metrics</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsMasterReportOpen(false)}
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleMasterReportDownload}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              >
                Generate Report
              </Button>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default Reports;