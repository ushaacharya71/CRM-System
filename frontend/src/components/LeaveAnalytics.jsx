import { PieChart, Pie, Tooltip } from "recharts";

const LeaveAnalytics = ({ data }) => (
  <PieChart width={300} height={300}>
    <Pie data={data} dataKey="count" nameKey="_id" />
    <Tooltip />
  </PieChart>
);
