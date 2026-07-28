"use client";

import { GoTriangleUp, GoTriangleDown } from "react-icons/go";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { stats } from "./data";
import { cn } from "@/lib/utils";

export function StatGrid() {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="min-h-28 rounded-none bg-card py-4 ring-0 shadow-sm"
        >
          <CardHeader className="flex items-center gap-2 px-4 pb-2">
            <div
              className={cn(
                "flex items-center justify-center p-2 text-white",
                stat.tone
              )}
            >
              <stat.icon className="size-5" />
            </div>
            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
          </CardHeader>
          <CardContent className="px-4 flex flex-col mt-auto">
            <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
            <div>
              <div
                className={cn(
                  "mt-2 flex items-center gap-1 text-sm",
                  stat.detail.startsWith("+")
                    ? "text-emerald-500"
                    : stat.detail.startsWith("-")
                    ? "text-red-500"
                    : "text-muted-foreground"
                )}
              >
                {stat.detail.startsWith("+") || stat.detail.startsWith("-") ? (
                  <>
                    {stat.detail.startsWith("+") ? (
                      <GoTriangleUp className="size-4 fill-current" />
                    ) : (
                      <GoTriangleDown className="size-4 fill-current" />
                    )}
                    <span>{stat.detail}</span>
                  </>
                ) : (
                  <span>{stat.detail}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
