import type { WidgetServerProps } from 'payload'
import type { CSSProperties } from 'react'

import { Banner, Pill } from '@payloadcms/ui'

import { AnalyticsTrendChart } from '@/components/Dashboard/AnalyticsTrendChart'
import { getAnalyticsSummary } from '@/endpoints/analytics'

const metricGridStyle = {
  display: 'grid',
  gap: 'var(--base)',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  marginBottom: 'var(--base)',
} satisfies CSSProperties

const metricValueStyle = {
  fontSize: 'calc(var(--base) * 1.75)',
  fontWeight: 600,
  lineHeight: 1.1,
  margin: 0,
} satisfies CSSProperties

const metricHintStyle = {
  color: 'var(--theme-elevation-500)',
  fontSize: '0.875rem',
  margin: '0.5rem 0 0',
} satisfies CSSProperties

const tableStyle = {
  borderCollapse: 'collapse',
  width: '100%',
} satisfies CSSProperties

const cellStyle = {
  borderBottom: '1px solid var(--theme-elevation-150)',
  padding: '0.75rem 0',
} satisfies CSSProperties

const tableHeaderStyle = {
  ...cellStyle,
  color: 'var(--theme-elevation-600)',
  fontSize: '0.8125rem',
  fontWeight: 600,
  textTransform: 'uppercase' as const,
} satisfies CSSProperties

const sectionHeaderStyle = {
  alignItems: 'center',
  display: 'flex',
  gap: '0.75rem',
  justifyContent: 'space-between',
  marginBottom: 'var(--base)',
  marginTop: 10,
} satisfies CSSProperties

const titleStyle = {
  fontSize: '1.25rem',
  fontWeight: 600,
  margin: 0,
} satisfies CSSProperties

const descriptionStyle = {
  color: 'var(--theme-elevation-600)',
  margin: '0.35rem 0 0',
} satisfies CSSProperties

const surfaceStyle = {
  display: 'grid',
  gap: 'var(--base)',
} satisfies CSSProperties

const cardBodyStyle = {
  display: 'grid',
  gap: '0.5rem',
  width: '100%',
} satisfies CSSProperties

const trendRowStyle = {
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
} satisfies CSSProperties

const chartMetaStyle = {
  color: 'var(--theme-elevation-500)',
  fontSize: '0.875rem',
  margin: 0,
} satisfies CSSProperties

const getBounceRate = (visits: number, bounces: number) => {
  if (visits === 0) {
    return 0
  }

  return Math.round((bounces / visits) * 100)
}

const getMostRecentPageviews = (points: Array<{ x: string; y: number }>) => {
  return points.at(-1)?.y ?? 0
}

const sumPoints = (points: Array<{ x: string; y: number }>) => {
  return points.reduce((total, point) => total + point.y, 0)
}

const getWeeklyTrend = (points: Array<{ x: string; y: number }>) => {
  const recent = points.slice(-7)
  const previous = points.slice(-14, -7)
  const recentTotal = sumPoints(recent)
  const previousTotal = sumPoints(previous)

  if (recent.length === 0) {
    return {
      change: 0,
      label: 'No recent activity',
      pillStyle: 'light-gray' as const,
      recentTotal,
    }
  }

  if (previous.length === 0 || previousTotal === 0) {
    return {
      change: 0,
      label: 'Last 7 days',
      pillStyle: 'light-gray' as const,
      recentTotal,
    }
  }

  const change = Math.round(((recentTotal - previousTotal) / previousTotal) * 100)

  if (change > 0) {
    return {
      change,
      label: `${change}% vs previous 7 days`,
      pillStyle: 'success' as const,
      recentTotal,
    }
  }

  if (change < 0) {
    return {
      change,
      label: `${Math.abs(change)}% vs previous 7 days`,
      pillStyle: 'warning' as const,
      recentTotal,
    }
  }

  return {
    change,
    label: 'Flat vs previous 7 days',
    pillStyle: 'light-gray' as const,
    recentTotal,
  }
}

const MetricCard = ({
  description,
  title,
  value,
}: {
  description: string
  title: string
  value: string | number
}) => {
  return (
    <div className="card">
      <div style={cardBodyStyle}>
        <div className="card__title">{title}</div>
        <p style={metricValueStyle}>{value}</p>
        <p style={metricHintStyle}>{description}</p>
      </div>
    </div>
  )
}

export const AnalyticsDashboard = async (_props: WidgetServerProps) => {
  try {
    const { pageviews, stats, topPages } = await getAnalyticsSummary()
    const bounceRate = getBounceRate(stats.visits, stats.bounces)
    const latestPageviews = getMostRecentPageviews(pageviews.pageviews)
    const weeklyTrend = getWeeklyTrend(pageviews.pageviews)
    const chartData = pageviews.pageviews.map((point) => ({
      label: new Date(point.x).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      pageviews: point.y,
    }))

    return (
      <div style={surfaceStyle}>
        <div style={sectionHeaderStyle}>
          <div>
            <h2 className="collections__label">Analytics</h2>
            <p style={descriptionStyle}>Last 30 days from Umami</p>
          </div>
          <Pill pillStyle="light-gray">Umami v3</Pill>
        </div>

        <div style={trendRowStyle}>
          <Pill pillStyle={weeklyTrend.pillStyle}>{weeklyTrend.label}</Pill>
          <Pill pillStyle="light-gray">{weeklyTrend.recentTotal} views in last 7 days</Pill>
        </div>

        <div style={metricGridStyle}>
          <MetricCard
            description="Total page views in the selected window"
            title="Page views"
            value={stats.pageviews}
          />
          <MetricCard
            description="Unique visitors recorded by Umami"
            title="Visitors"
            value={stats.visitors}
          />
          <MetricCard
            description="Sessions started across the site"
            title="Visits"
            value={stats.visits}
          />
          <MetricCard
            description="Bounces as a percentage of visits"
            title="Bounce rate"
            value={`${bounceRate}%`}
          />
        </div>

        <div className="card">
          <div style={cardBodyStyle}>
            <div className="card__title">Top pages</div>
            {topPages.length > 0 ? (
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={{ ...tableHeaderStyle, textAlign: 'left' }}>Path</th>
                    <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>Views</th>
                  </tr>
                </thead>
                <tbody>
                  {topPages.map((page) => (
                    <tr key={page.x}>
                      <td style={{ ...cellStyle, textAlign: 'left' }}>{page.x}</td>
                      <td style={{ ...cellStyle, textAlign: 'right' }}>{page.y}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <Banner type="info">Umami returned no top-page data for the current period.</Banner>
            )}
          </div>
        </div>

        <div className="card">
          <div style={cardBodyStyle}>
            <div className="card__title">Pageview trend</div>
            {chartData.length > 0 ? (
              <AnalyticsTrendChart data={chartData} />
            ) : (
              <Banner type="info">Umami returned no pageview series for the current period.</Banner>
            )}
            <p style={chartMetaStyle}>Daily pageviews across the last 30 days.</p>
          </div>
        </div>

        <div className="card">
          <div style={cardBodyStyle}>
            <div className="card__title">Latest daily snapshot</div>
            <p style={metricValueStyle}>{latestPageviews}</p>
            <p style={metricHintStyle}>
              Most recent daily pageview count from the Umami pageviews series.
            </p>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load analytics'

    return <Banner type="error">Unable to load analytics: {message}</Banner>
  }
}

export default AnalyticsDashboard
