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
  Tooltip,
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

function formatNumber(value: number): string {
  return value.toLocaleString("id-ID");
}

function shortenNumber(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)} jt`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)} rb`;
  return `${value}`;
}

const tooltipStyle = {
  backgroundColor: "#111111",
  border: "none",
  borderRadius: 0,
  fontSize: 12,
  color: "#ffffff",
  padding: "8px 12px",
};

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
    return <div className="h-full animate-pulse bg-muted/30" />;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B8860B" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#B8860B" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--border)" strokeOpacity={0.25} vertical={false} />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          width={44}
          tickFormatter={(value) => shortenNumber(Number(value))}
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
        />
        <Tooltip
          cursor={{ stroke: "#B8860B", strokeOpacity: 0.3 }}
          contentStyle={tooltipStyle}
          labelStyle={{ color: "#D4AF37", fontWeight: 600, marginBottom: 4 }}
          itemStyle={{ color: "#ffffff" }}
          formatter={(value) => [formatNumber(Number(value)), "Dibaca"]}
        />
        <Area
          type="linear"
          dataKey="views"
          stroke="#B8860B"
          strokeWidth={2}
          fill="url(#viewsFill)"
          activeDot={{ r: 4, fill: "#B8860B", strokeWidth: 0 }}
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
    return <div className="h-full animate-pulse bg-muted/30" />;
  }

  if (data.length === 0) {
    return <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Tidak ada data</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="var(--border)" strokeOpacity={0.25} horizontal={false} />
        <XAxis
          type="number"
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
        />
        <YAxis
          type="category"
          dataKey="name"
          axisLine={false}
          tickLine={false}
          width={88}
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
        />
        <Tooltip
          cursor={{ fill: "var(--border)", fillOpacity: 0.3 }}
          contentStyle={tooltipStyle}
          labelStyle={{ color: "#D4AF37", fontWeight: 600, marginBottom: 4 }}
          itemStyle={{ color: "#ffffff" }}
          formatter={(value) => [formatNumber(Number(value)), "Artikel"]}
        />
        <Bar dataKey="count" radius={[0, 0, 0, 0]} barSize={16}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color || "#666"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
