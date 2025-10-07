'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ModelData {
  model: string
  requests: number
  cost: string
  tokens: number
}

interface TokenUsageChartProps {
  data: ModelData[]
}

export function TokenUsageChart({ data }: TokenUsageChartProps) {
  const chartData = data.map(item => ({
    name: item.model.split('/').pop() || item.model,
    tokens: item.tokens,
    requests: item.requests,
  })).sort((a, b) => b.tokens - a.tokens)

  return (
    <Card className="border-gray-800 bg-gray-900/30">
      <CardHeader>
        <CardTitle className="text-white text-sm">Token Usage by Model</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '6px',
                color: '#fff'
              }}
              formatter={(value: number, name: string) => {
                if (name === 'tokens') return [`${value.toLocaleString()} tokens`, 'Tokens']
                return [value.toLocaleString(), 'Requests']
              }}
            />
            <Area
              type="monotone"
              dataKey="tokens"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorTokens)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
