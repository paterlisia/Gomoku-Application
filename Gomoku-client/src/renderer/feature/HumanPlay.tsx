import { Space, Card } from 'antd';

export default function HumanPlay() {
  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <Card title="Card" size="small">
        <p>Hold for human player</p>
      </Card>
      <Card title="Card" size="small">
        <p>Hold for human player</p>
      </Card>
      <Card title="Card" size="small">
        <p>Hold for human player</p>
      </Card>
    </Space>
  );
}
