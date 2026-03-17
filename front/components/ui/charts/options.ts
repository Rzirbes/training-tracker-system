type Align = 'end' | 'start' | 'center' | 'bottom' | 'left' | 'right'
type Anchor = 'center' | 'start' | 'end'

export const options = {
  maintainAspectRatio: false,
  responsive: true,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  scales: {
    y: {
      type: 'linear' as const,
      display: true,
      position: 'left' as const,
    },
    y1: {
      type: 'linear' as const,
      display: true,
      position: 'right' as const,
    },
  },
  plugins: {
    datalabels: {
      display: (chart: any) => chart.dataset.data[chart.dataIndex],
      color: 'white',
      borderRadius: 4,
      backgroundColor: (chart: any) => {
        return chart.dataset.backgroundColor
      },
      formatter: (v: number) => v.toLocaleString(),
      anchor: 'center' as Anchor,
      offset: -12,
      align: 'start' as Align,
      textAlign: 'center' as const,
      padding: {
        top: 4,
        bottom: 4,
        left: 8,
        right: 8,
      },
    },
  },
}
