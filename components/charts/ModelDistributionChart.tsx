'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ModelData {
  model: string
  requests: number
  cost: string
  tokens: number
}

interface ModelDistributionChartProps {
  data: ModelData[]
}

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#f59e0b', '#06b6d4']

export function ModelDistributionChart({ data }: ModelDistributionChartProps) {
  const chartData = data.map(item => ({
    name: item.model.split('/').pop() || item.model,
    value: item.requests,
    fullName: item.model,
  }))

  return (
    <Card className="border-gray-800 bg-gray-900/30">
      <CardHeader>
        <CardTitle className="text-white text-sm">Model Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '6px',
                color: '#fff'
              }}
              formatter={(value: number) => [`${value.toLocaleString()} requests`, 'Requests']}
            />
            <Legend
              wrapperStyle={{ color: '#9ca3af' }}
              formatter={(value) => <span className="text-gray-400 text-xs">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
