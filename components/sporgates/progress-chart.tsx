"use client"

import { Line, LineChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts"

interface DataPoint {
  date: string
  value: number
}

interface ProgressChartProps {
  title: string
  data: DataPoint[]
  color?: string
  unit?: string
}

export function ProgressChart({ title, data, color = "#3b82f6", unit = "" }: ProgressChartProps) {
  return (
    <div>
      {title && <h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>}
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#999" />
            <YAxis tick={{ fontSize: 12 }} stroke="#999" />
            <Tooltip
              contentStyle={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "8px" }}
              formatter={(value) => [`${value}${unit}`, title || "Progress"]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
