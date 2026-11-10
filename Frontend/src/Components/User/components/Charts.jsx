import { ui } from "../utils/ui";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { money, number } from '../utils/format';
const colors = ['#5046e5', '#168b80', '#d47b25', '#7e56c2', '#4a81ce'];
export function ChartCard({
  title,
  kind,
  data,
  series,
  valueFormat = number
}) {
  const axis = <><CartesianGrid stroke="#e8edf5" vertical={false} /><XAxis dataKey="name" minTickGap={18} tick={{
      fontSize: 11
    }} /><YAxis tick={{
      fontSize: 11
    }} width={66} /><Tooltip formatter={valueFormat} /></>;
  const charts = {
    line: <LineChart data={data}>{axis}{series.map((key, i) => <Line key={key} dataKey={key} stroke={colors[i]} strokeWidth={2.5} dot={false} isAnimationActive={false} />)}</LineChart>,
    bar: <BarChart data={data}>{axis}{series.map((key, i) => <Bar key={key} dataKey={key} fill={colors[i]} radius={[5, 5, 0, 0]} isAnimationActive={false} />)}</BarChart>,
    area: <AreaChart data={data}>{axis}{series.map((key, i) => <Area key={key} dataKey={key} fill={colors[i]} fillOpacity={.16} stroke={colors[i]} strokeWidth={2} isAnimationActive={false} />)}</AreaChart>,
    pie: <PieChart><Tooltip formatter={valueFormat} /><Legend /><Pie data={data} dataKey={series[0]} nameKey="name" innerRadius="52%" outerRadius="78%" isAnimationActive={false}>{data.map((item, i) => <Cell key={item.name} fill={colors[i % colors.length]} />)}</Pie></PieChart>
  };
  return <section className={ui("card")}><h2>{title}</h2>{data.some(row => series.some(key => row[key] !== 0)) ? <div className={ui("chart-body")}><ResponsiveContainer width="100%" height="100%">{charts[kind]}</ResponsiveContainer></div> : <p className={ui("empty")}>No activity in this date range.</p>}</section>;
}
export function DashboardCharts({
  data,
  mode
}) {
  const charts = [['Revenue Overview', 'line', data.revenue, ['Revenue'], money], ['Sales Performance', 'bar', data.sales, ['Units']], ['User Growth', 'area', data.users, ['Users']], ['Traffic Sources', 'pie', data.traffic, ['Sessions']], ['Monthly Performance', 'bar', data.monthly, ['Revenue'], money], ['Category Performance', 'bar', data.categories, ['Revenue'], money]];
  const visible = mode === 'sales' ? [0, 1, 4, 5] : mode === 'users' ? [2, 3] : [0, 1, 2, 3, 4, 5];
  return <div className={ui("charts")}>{visible.map(index => {
      const [title, kind, rows, series, valueFormat] = charts[index];
      return <ChartCard key={title} title={title} kind={kind} data={rows} series={series} valueFormat={valueFormat} />;
    })}</div>;
}
