"use client";

import { useState, useEffect } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface ChartData {
  month: string;
  articles: number;
  views: number;
}

interface CategoryData {
  name: string;
  color: string;
  count: number;
}

export function ViewsChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((d) => {
        setData(d.chartData || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="h-full animate-pulse rounded bg-muted/30" />;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
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
  const [data, setData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((d) => {
        setData(d.categoryStats || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="h-full animate-pulse rounded bg-muted/30" />;
  }

  if (data.length === 0) {
    return <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Tidak ada data</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical">
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
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color || "#666"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
