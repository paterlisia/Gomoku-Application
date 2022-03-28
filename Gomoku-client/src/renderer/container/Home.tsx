import { Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import React, { useState } from 'react';
import './Home.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

// internal component

import HumanPlay from '../feature/HumanPlay'; // human interaction with model in gomoku
import UploadModel from '../feature/UploadModel'; // upload models
import ModelCompete from '../feature/ModelCompete'; // model compete

const { Header, Sider, Content, Footer } = Layout;

export default function HomePage() {
  // for menu
  const [collapsed, setcollapsed] = useState(false);
  // for content
  const [phase, setPhase] = useState(0);

  const toggle = () => {
    setcollapsed(!collapsed);
  };

  const PageContent = () => {
    if (phase === 0) {
      return <UploadModel />;
    }
    if (phase === 1) {
      return <ModelCompete />;
    }
    return <HumanPlay />;
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item
            key="1"
            icon={<UserOutlined />}
            onClick={() => setPhase(0)}
          >
            Upload model
            <Link to="/" />
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<VideoCameraOutlined />}
            onClick={() => setPhase(1)}
          >
            Model comparison
            <Link to="/" />
          </Menu.Item>
          <Menu.Item
            key="3"
            icon={<UploadOutlined />}
            onClick={() => setPhase(2)}
          >
            Play Gomoku
            <Link to="/" />
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: 'trigger',
              onClick: toggle,
            }
          )}
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 1024,
          }}
        >
          <PageContent />
        </Content>

        <Footer style={{ textAlign: 'center' }}>
          Gomoku-Application 2022 Created by Jing
        </Footer>
      </Layout>
    </Layout>
  );
}
