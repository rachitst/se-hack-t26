import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import Card, { CardHeader, CardContent } from '../ui/Card';
import { warehouses } from '../../data/mockWarehouses';

const PerformanceChart: React.FC = () => {
  const data = warehouses.map(warehouse => ({
    name: warehouse.name.split(' ')[0],
    utilization: warehouse.utilization,
    efficiency: warehouse.metrics.efficiency,
    inbound: warehouse.metrics.inboundOrders,
    outbound: warehouse.metrics.outboundOrders,
  }));

  const pieData = [
    { name: 'In Stock', value: 75 },
    { name: 'Low Stock', value: 15 },
    { name: 'Out of Stock', value: 10 },
  ];

  const COLORS = ['#4f46e5', '#818cf8', '#c7d2fe'];

  return (
    <Card className="h-full">
      <CardHeader className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Warehouse Performance</h2>
          <p className="text-sm text-neutral-500">Stock utilization across warehouses</p>
        </div>
        <select className="text-sm bg-white border border-neutral-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
                <Bar dataKey="utilization" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="efficiency" fill="#818cf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Area type="monotone" dataKey="inbound" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.2} />
                <Area type="monotone" dataKey="outbound" stroke="#818cf8" fill="#818cf8" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Line type="monotone" dataKey="efficiency" stroke="#4f46e5" strokeWidth={2} dot={{ fill: '#4f46e5' }} />
                <Line type="monotone" dataKey="utilization" stroke="#818cf8" strokeWidth={2} dot={{ fill: '#818cf8' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-neutral-200/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-sm">
              <div className="text-neutral-500">Average Utilization</div>
              <div className="font-medium mt-1">72.6%</div>
            </div>
            <div className="text-sm">
              <div className="text-neutral-500">Total Capacity</div>
              <div className="font-medium mt-1">285,000 units</div>
            </div>
            <div className="text-sm">
              <div className="text-neutral-500">Inbound Orders</div>
              <div className="font-medium mt-1">667</div>
            </div>
            <div className="text-sm">
              <div className="text-neutral-500">Outbound Orders</div>
              <div className="font-medium mt-1">716</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;