import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#6366F1', '#A855F7', '#EC4899', '#0EA5E9', '#10B981', '#F59E0B'];

export const CategoryChart = ({ data = {} }) => {
  const chartData = Object.keys(data).map((key) => ({
    name: key,
    value: data[key]
  }));

  if (chartData.length === 0) {
    return <div className="text-xs text-slate-500 text-center py-8">No category data available</div>;
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#FFF' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const FileTypeChart = ({ data = {} }) => {
  const chartData = Object.keys(data).map((key) => ({
    type: key,
    count: data[key]
  }));

  if (chartData.length === 0) {
    return <div className="text-xs text-slate-500 text-center py-8">No file type data available</div>;
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="type" stroke="#94A3B8" fontSize={12} tickLine={false} />
          <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#FFF' }}
          />
          <Bar dataKey="count" fill="#6366F1" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
