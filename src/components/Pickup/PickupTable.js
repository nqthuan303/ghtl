import React, { Component } from 'react';
import { Table, notification } from 'antd';
import request from '../../utils/request';

export default class PickupTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pickups: [],
    };
    this.shiperId = '';
  }
  componentDidMount() {
    this.getPickUpList();
  }
  async getPickUpList() {
    const result = await request('/pickup/list');
    if (result.status === 'success') {
      const { data } = result;
      this.setState({
        pickups: data,
      });
    } else {
      notification.error({
        message: 'Lỗi',
        description: result.data.msg,
      });
    }
  }

  renderShiperName = (value, row) => {
    const { shipper } = row;
    return (
      <p>{shipper.name} - {shipper.id}/{shipper.phone}</p>
    );
  }

  renderData = (record) => {
    const { data } = record;
    const columns = [
      { key: 'id', dataIndex: 'id' },
      { render: () => '123 abc' },
      { render: () => '625.000' },
      { render: () => 'Sửa' },
      { render: () => 'xxx' },
    ];
    return (
      <Table
        showHeader={false}
        dataSource={data}
        columns={columns}
        pagination={false}
      />
    );
  }

  render() {
    const { pickups } = this.state;
    const columns = [
      { key: 'pickupId', dataIndex: 'id' },
      { key: 'shipperName', render: this.renderShiperName },
    ];

    return (
      <div style={{ height: '200px', borderTop: '1px solid #ddd' }}>
        <Table
          rowKey="_id"
          showHeader={false}
          expandedRowRender={this.renderData}
          dataSource={pickups}
          columns={columns}
          pagination={false}
        />
      </div>
    );
  }
}
