'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
  { month: 'Jan', equity: 80000 },
  { month: 'Feb', equity: 82500 },
  { month: 'Mar', equity: 84000 },
  { month: 'Apr', equity: 87000 },
  { month: 'May', equity: 88500 },
  { month: 'Jun', equity: 91000 },
  { month: 'Jul', equity: 92300 },
  { month: 'Aug', equity: 95000 },
  { month: 'Sep', equity: 96000 },
  { month: 'Oct', equity: 98500 },
  { month: 'Nov', equity: 101000 },
  { month: 'Dec', equity: 103000 },
];

const chartConfig = {
  equity: {
    label: 'Equity',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

/**
 * Renders a chart that displays the user's equity growth over the last 12 months.
 *
 * @returns {JSX.Element} The EquityChart component.
 */
export default function EquityChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 0,
          right: 12,
          top: 10,
          bottom: 0,
        }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis
          tickFormatter={(value) => `£${Number(value) / 1000}k`}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={40}
        />
        <Tooltip
          cursor={true}
          content={<ChartTooltipContent
            formatter={(value) => `£${Number(value).toLocaleString()}`}
            indicator="dot"
            labelClassName='font-bold'
            className='bg-card'
          />}
        />
        <defs>
          <linearGradient id="fillEquity" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-equity)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-equity)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <Area
          dataKey="equity"
          type="monotone"
          fill="url(#fillEquity)"
          stroke="var(--color-equity)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}
