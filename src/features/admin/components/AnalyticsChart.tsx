'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ChartDataPoint {
  label: string
  value: number
}

export function AnalyticsChart() {
  const [chartType, setChartType] = useState<string>('revenue')

  const datasets: Record<string, ChartDataPoint[]> = {
    revenue: [
      { label: 'Jan', value: 1200 },
      { label: 'Feb', value: 1800 },
      { label: 'Mar', value: 2400 },
      { label: 'Apr', value: 3100 },
      { label: 'May', value: 4300 },
      { label: 'Jun', value: 5900 },
    ],
    user_growth: [
      { label: 'Jan', value: 80 },
      { label: 'Feb', value: 140 },
      { label: 'Mar', value: 210 },
      { label: 'Apr', value: 380 },
      { label: 'May', value: 650 },
      { label: 'Jun', value: 1248 },
    ],
    product_growth: [
      { label: 'Jan', value: 100 },
      { label: 'Feb', value: 220 },
      { label: 'Mar', value: 410 },
      { label: 'Apr', value: 550 },
      { label: 'May', value: 720 },
      { label: 'Jun', value: 856 },
    ],
    orders: [
      { label: 'Jan', value: 40 },
      { label: 'Feb', value: 90 },
      { label: 'Mar', value: 130 },
      { label: 'Apr', value: 210 },
      { label: 'May', value: 350 },
      { label: 'Jun', value: 512 },
    ],
    sellers: [
      { label: 'Jan', value: 10 },
      { label: 'Feb', value: 22 },
      { label: 'Mar', value: 45 },
      { label: 'Apr', value: 70 },
      { label: 'May', value: 110 },
      { label: 'Jun', value: 185 },
    ],
    buyers: [
      { label: 'Jan', value: 70 },
      { label: 'Feb', value: 118 },
      { label: 'Mar', value: 165 },
      { label: 'Apr', value: 310 },
      { label: 'May', value: 540 },
      { label: 'Jun', value: 1063 },
    ],
    payment_volume: [
      { label: 'Jan', value: 12000 },
      { label: 'Feb', value: 18000 },
      { label: 'Mar', value: 24000 },
      { label: 'Apr', value: 31000 },
      { label: 'May', value: 43000 },
      { label: 'Jun', value: 59000 },
    ],
  }

  const currentData = datasets[chartType] || datasets.revenue
  const maxValue = Math.max(...currentData.map((d) => d.value), 10)

  const width = 500
  const height = 200
  const padding = 30

  const points = currentData.map((d, index) => {
    const x = padding + (index * (width - 2 * padding)) / (currentData.length - 1)
    const y = height - padding - (d.value * (height - 2 * padding)) / maxValue
    return { x, y, label: d.label, value: d.value }
  })

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ')

  const pathPoints =
    points.length > 0
      ? `M ${points[0].x} ${height - padding} ` +
        points.map((p) => `L ${p.x} ${p.y}`).join(' ') +
        ` L ${points[points.length - 1].x} ${height - padding} Z`
      : ''

  return (
    <Card className="border border-border bg-card rounded-none font-sans select-none">
      <CardHeader className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
          Platform Analytics
        </CardTitle>
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          className="border border-border bg-card text-[10px] uppercase font-bold tracking-wider rounded-none p-1.5 focus-visible:ring-emerald-600 focus-visible:ring-1 outline-none cursor-pointer"
        >
          <option value="revenue">Revenue (USD)</option>
          <option value="user_growth">User Growth (Profiles)</option>
          <option value="product_growth">Product Growth (Listings)</option>
          <option value="orders">Orders Over Time</option>
          <option value="sellers">Seller Registrations</option>
          <option value="buyers">Buyer Registrations</option>
          <option value="payment_volume">Payment Volume (XLM)</option>
        </select>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative w-full overflow-hidden">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="currentColor" strokeOpacity="0.05" />
            <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="currentColor" strokeOpacity="0.05" />
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="currentColor" strokeOpacity="0.1" />

            {pathPoints && <path d={pathPoints} fill="url(#areaGrad)" />}

            <polyline
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              points={polylinePoints}
            />

            {points.map((p, index) => (
              <g key={index} className="group">
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  fill="#ffffff"
                  stroke="#10b981"
                  strokeWidth="2"
                  className="transition-all duration-200 cursor-pointer hover:r-6"
                />
                <text
                  x={p.x}
                  y={p.y - 10}
                  textAnchor="middle"
                  fill="currentColor"
                  className="text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity fill-foreground"
                >
                  {p.value}
                </text>
                <text
                  x={p.x}
                  y={height - 10}
                  textAnchor="middle"
                  fill="currentColor"
                  className="text-[8px] tracking-wide fill-muted-foreground"
                >
                  {p.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}
