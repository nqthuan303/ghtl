import React, { Component } from 'react';
import { Table } from 'antd';
import request from '../../utils/request';

export default class PickupTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ordersPerShiper: {},
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
      const ordersPerShiper = {};
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const { user } = item;
        const shipperId = user._id;
        if (ordersPerShiper[shipperId]) {
          ordersPerShiper[shipperId]++;
        } else {
          ordersPerShiper[shipperId] = 1;
        }
      }
      this.setState({
        ordersPerShiper,
        pickups: data,
      });
    }
  }

  renderShiperName = (value, row) => {
    // console.log(row);
    const { ordersPerShiper } = this.state;
    const shipper = row.user;
    let rowSpan = 0;
    if (this.shiperId !== shipper._id) {
      this.shiperId = shipper._id;
      rowSpan = ordersPerShiper[this.shiperId];
    }
    const obj = {
      children: value,
      props: {
        rowSpan,
      },
    };
    return obj;
  }

  renderPickupId = (value, row) => {
    const { ordersPerShiper } = this.state;
    const shipper = row.user;
    let rowSpan = 0;
    if (this.shiperId !== shipper._id) {
      this.shiperId = shipper._id;
      rowSpan = ordersPerShiper[this.shiperId];
    }
    const obj = {
      children: value,
      props: {
        rowSpan,
      },
    };
    return obj;
  }

  render() {
    const { pickups } = this.state;

    const columns = [
      { key: 'pickupId', dataIndex: 'id', render: this.renderPickupId },
      { key: 'shipperName', dataIndex: 'user.name', render: this.renderShiperName },
      { key: 'createdAtPickup', render: () => 123 },
    ];

    return (
      <div style={{ marginTop: 20 }}>
        <Table
          showHeader={false}
          dataSource={pickups}
          columns={columns}
          pagination={false}
        />
      </div>
    );
  }
}
