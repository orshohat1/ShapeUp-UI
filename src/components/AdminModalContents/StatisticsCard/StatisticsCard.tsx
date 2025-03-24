import { Card, Col, Row } from "antd";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface ChartDataItem {
  name: string;
  value: number;
}

interface StatisticsCardProps {
  dataSets: ChartDataItem[][];
  colors: string[];
  labels: string[];
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  dataSets,
  colors,
  labels,
}) => {
  return (
    <Card title="General statistics" style={{ height: "100%" }}>
      <Row justify="space-around">
        {dataSets.map((data, i) => (
          <Col span={6} key={i} style={{ textAlign: "center" }}>
            <ResponsiveContainer width="100%" height={80}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={35}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                >
                  <Cell fill={colors[i]} />
                  <Cell fill="#F3F3F3" />
                </Pie>
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: 14, fontWeight: 600 }}
                >
                  {data[0].value}
                </text>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ fontSize: 12, marginTop: 4 }}>{labels[i]}</div>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default StatisticsCard;
