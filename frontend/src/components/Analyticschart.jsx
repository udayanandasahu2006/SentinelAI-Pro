import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function AnalyticsChart({ stats }) {
  const data = [
    {
      name: "Threats",
      value: stats.threats_detected
    },
    {
      name: "Safe",
      value: stats.safe_images
    }
  ];

  const COLORS = ["#f44336", "#4caf50"];

  return (
    <div style={{ width: "100%", height: 350 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={120}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}