"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { chartData, categoryData } from "./data";

export function ViewsChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#DC2626" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#DC2626" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--border)" strokeOpacity={0.25} vertical={false} />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          width={50}
          tickFormatter={(value) => `${Number(value) / 1000}K`}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
        />
        <Area
          type="linear"
          dataKey="views"
          stroke="#DC2626"
          strokeWidth={3}
          fill="url(#viewsFill)"
          activeDot={false}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function CategoryBarChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={categoryData} layout="vertical">
        <CartesianGrid stroke="var(--border)" strokeOpacity={0.25} horizontal={false} />
        <XAxis
          type="number"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
        />
        <YAxis
          type="category"
          dataKey="name"
          axisLine={false}
          tickLine={false}
          width={80}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {categoryData.map((entry, index) => (
            <rect key={index} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
