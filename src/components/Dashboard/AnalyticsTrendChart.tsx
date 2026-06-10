'use client'

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'

type TrendPoint = {
  label: string
  pageviews: number
}

const chartConfig = {
  pageviews: {
    label: 'Pageviews',
    color: 'var(--color-chart-1)',
  },
} satisfies ChartConfig

const chartColor = 'var(--color-chart-1)'

export const AnalyticsTrendChart = ({ data }: { data: TrendPoint[] }) => {
  return (
    <ChartContainer config={chartConfig} style={{ height: 220, width: '100%' }}>
      <AreaChart accessibilityLayer data={data} margin={{ left: 12, right: 12, top: 8 }}>
        <defs>
          <linearGradient id="analytics-pageviews-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="5%" stopColor={chartColor} stopOpacity={0.35} />
            <stop offset="95%" stopColor={chartColor} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--theme-elevation-150)" />
        <XAxis
          axisLine={false}
          dataKey="label"
          minTickGap={24}
          tickLine={false}
          tickMargin={10}
          tick={{ fill: 'var(--theme-elevation-500)', fontSize: 12 }}
        />
        <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
        <Area
          activeDot={{
            fill: chartColor,
            r: 4,
            stroke: 'var(--theme-bg)',
            strokeWidth: 2,
          }}
          dataKey="pageviews"
          dot={false}
          fill="url(#analytics-pageviews-fill)"
          fillOpacity={1}
          stroke={chartColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          type="monotone"
        />
      </AreaChart>
    </ChartContainer>
  )
}

export default AnalyticsTrendChart
