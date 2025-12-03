"use client";

import React from "react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import {  convertFileSize } from "@/lib/utils";

interface ChartProps {
  used?: number; // bytes
}

const TOTAL_STORAGE = 9 * 1024 * 1024 * 1024; // 9GB in bytes

const chartConfig: ChartConfig = {
  size: { label: "Size" },
  used: { label: "Used", color: "white" },
};

interface ChartDataItem {
  name: string;
  value: number;
  fill: string;
}

export const Chart: React.FC<ChartProps> = ({ used = 0 }) => {
  const safeUsed = Number(used) || 0;
  const safeTotal = TOTAL_STORAGE;

  const percent: number = Math.min(Math.max((safeUsed / safeTotal) * 100, 0), 100);

  const chartData: ChartDataItem[] = [
    {
      name: "Used",
      value: percent,
      fill: "white",
    },
  ];

  return (
    <Card className="chart">
      <CardContent className="flex-1 p-0">
        <ChartContainer config={chartConfig} className="chart-container">
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={percent + 90}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              polarRadius={[86, 74]}
            />

            <RadialBar dataKey="value" background cornerRadius={10} />

            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="chart-total-percentage"
                        >
                          {Math.round(percent)}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-white/70"
                        >
                          Space used
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>

      <CardHeader className="chart-details">
        <CardTitle className="chart-title">Available Storage</CardTitle>
        <CardDescription className="chart-description">
          {convertFileSize(safeUsed)} / 9GB
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
