import React from 'react';
import './App.css';
import { Table } from "antd";
import { StepBackwardOutlined, AlertFilled, StepBackwardFilled, UserOutlined } from '@ant-design/icons';
import { Splitter } from './components/Splitter';

function App() {
  const dataSource = [
    {
      key: '1',
      name: 'Mike',
      age: 32,
      address: '10 Downing Street',
      sex: 'm',
    },
    {
      key: '2',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
      sex: 'm',
    },
    {
      key: '3',
      name: 'Varvara Krasa',
      age: 42,
      address: '10 Moscow City',
      sex: 'w',
    },
    {
      key: '4',
      name: 'Grandfather Hottabych',
      age: 43,
      address: '12 Moscow City',
      sex: 'm',
    },
    {
      key: '5',
      name: 'Colo Bock',
      age: 15,
      address: '12 Moscow City Street',
      sex: 'm',
    },
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Sex',
      dataIndex: 'sex',
      key: 'sex',
    },
  ];

  return (
    <div>
      <hr />
      <Splitter
        onSaveRatio={(val) => console.log('=====', val)}
        direction="vertical"
      >
        <div style={{ height: '100%', backgroundColor: 'lightskyblue' }} />

        <Splitter
          onSaveRatio={(val) => console.log('=====', val)}
          direction="horizontal"
        >
          <div style={{ height: '100%', backgroundColor: 'lightsalmon' }} />
          <Table
            style={{ backgroundColor: 'lightgreen' }}
            dataSource={dataSource}
            columns={columns}
            size="small"
            bordered
          />
          <div style={{ backgroundColor: 'lightblue', display: 'flex', gap: 20, justifyContent: 'space-around' }}>
            <StepBackwardFilled />
            <StepBackwardOutlined />
            <UserOutlined />
            <AlertFilled />
          </div>
          <div style={{ height: 200, backgroundColor: 'lightslategrey' }} />
        </Splitter>
      </Splitter>
      <hr />
    </div>
  );
}

export default App;
