import React, { Component } from 'react';
import { Table, notification } from 'antd';
import request from '../../utils/request';
import styles from './styles.less';

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

  renderName = (record) => {
    const { orders } = record;
    return (
      <div>
        <span>({orders.length}) {record.name}</span> <br />
        <span>{record.phone}</span>
      </div>
    );
  }

  renderAddress = (record) => {
    const { district, ward } = record;
    const result = `${record.address}, ${ward.type} ${ward.name}, ${district.type} ${district.name}`;
    return result;
  }

  renderData = (record) => {
    const { clients } = record;
    const columns = [
      { key: 'id', dataIndex: 'id' },
      { render: this.renderName },
      { render: this.renderAddress },
      { render: () => 'Sửa' },
      { render: () => 'xxx' },
    ];
    return (
      <Table
        rowKey="_id"
        showHeader={false}
        dataSource={clients}
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
      <div className={styles.pickupTable}>
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
