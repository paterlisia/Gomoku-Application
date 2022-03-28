import { Empty, Button } from 'antd';

export default function ModelCompete() {
  return (
    <Empty
      image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
      imageStyle={{
        height: 60,
      }}
      description={
        <span>
          Results will shown <a href="#API">here</a>
        </span>
      }
    >
      <Button type="primary">Start Now</Button>
    </Empty>
  );
}
