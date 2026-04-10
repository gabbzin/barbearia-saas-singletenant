"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";

const margin = {
  top: 5,
  right: 10,
  left: 0,
  bottom: 5,
};

interface BarChartGraphProps {
  chartConfig: ChartConfig;
  data: {
    day: string;
    saldoEmReais: number;
  }[];
}

export function BarChartGraph({ chartConfig, data }: BarChartGraphProps) {
  return (
    <ChartContainer config={chartConfig}>
      <BarChart data={data} margin={margin}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={value => value.slice(0, 3)}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={item =>
                `
                  Saldo
                  ${item === "Sabado" || item === "Domingo" ? `no` : `na`}
                  ${item}
                `
              }
              formatter={(value, _name, _item) => {
                return (
                  <div className="flex w-full items-center justify-between">
                    <span className="text-muted-foreground">Saldo</span>
                    <span className="m-0 font-inter font-semibold">
                      {Number(value).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                );
              }}
            />
          }
        />
        <Bar dataKey="saldoEmReais" fill="var(--chart-6)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
