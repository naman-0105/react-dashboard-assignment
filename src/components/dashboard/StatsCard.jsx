import { ArrowUp, ArrowDown } from 'lucide-react';
import { LineChart } from '@/components/ui/line-chart';

export default function StatsCard({ title, value, change, trend, period, chartData }) {
  return (
    <div className="group bg-white rounded-lg shadow p-4 py-8 flex items-center justify-between transition-transform duration-200 hover:shadow-lg hover:scale-[1.02]">
      <div className="w-1/2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="flex items-baseline mt-1">
          <span className="text-3xl font-semibold group-hover:text-blue-600 transition-colors">{value}</span>
          <span className={`ml-2 text-xs font-normal p-1 rounded-lg ${trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {trend === 'up' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />}
            {change}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">{period}</p>
      </div>

      <div className="w-1/2 h-20">
        <LineChart data={chartData} color='#2563EB' />
      </div>
    </div>
  );
}