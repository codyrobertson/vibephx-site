'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PurposeData {
  purpose: string
  requests: number
  cost: string
}

interface CostBreakdownChartProps {
  data: PurposeData[]
}

export function CostBreakdownChart({ data }: CostBreakdownChartProps) {
  const chartData = data.map(item => ({
    name: item.purpose.replace(/_/g, ' '),
    cost: parseFloat(item.cost),
    requests: item.requests,
  })).sort((a, b) => b.cost - a.cost)

  return (
    <Card className="border-gray-800 bg-gray-900/30">
      <CardHeader>
        <CardTitle className="text-white text-sm">Cost by Purpose</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '6px',
                color: '#fff'
              }}
              formatter={(value: number, name: string) => {
                if (name === 'cost') return [`$${value.toFixed(4)}`, 'Cost']
                return [value.toLocaleString(), 'Requests']
              }}
            />
            <Bar dataKey="cost" fill="#f97316" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
