'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface ChartsProps {
  data: {
    salesData: {
      month: string;
      totalSales: number;
    }[];
  };
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 shadow-lg rounded-lg border">
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-lg font-semibold text-primary">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const Charts = ({ data }: ChartsProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart 
        data={data.salesData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          padding={{ left: 20, right: 20 }}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `€${value}`}
          width={80}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="totalSales"
          stroke="#FF7A3D"
          strokeWidth={2}
          dot={{ fill: '#FF7A3D', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: '#FF7A3D', stroke: '#fff', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Charts;