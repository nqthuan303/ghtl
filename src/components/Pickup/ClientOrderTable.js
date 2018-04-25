import React, { Component } from 'react';
import { Table, Select, Modal, notification } from 'antd';

import request from '../../utils/request';
import styles from './styles.less';

const { Option } = Select;
const { confirm } = Modal;

export default class ClientOrderTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shippers: [],
      clients: [],
      spin: true,
    };
  }

  componentDidMount() {
    this.getShipperList();
    this.getOrdersEachClient();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.districtId !== this.props.districtId) {
      this.getOrdersEachClient({ districtId: nextProps.districtId });
    }
  }

  onConfirm = async () => {
    const result = await request('/pickup/add', {
      method: 'POST',
      body: this.selectedData,
    });

    if (result.status === 'success') {
      notification.success({
        message: 'Thành công!',
        description: 'Tạo chuyến đi giao thành công!!!',
      });
      this.getOrdersEachClient();
      this.props.onOrderChange();
    }
  }

  onCancel = () => {
  }

  onSelectShipper(value, orders, client) {
    const orderIds = [];
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      orderIds.push(order._id);
    }
    this.selectedData = {
      shipperId: value,
      orders: orderIds,
      client,
    };
    confirm({
      title: 'Xác nhận?',
      content: 'Bạn có chắc chắn muốn thêm đơn hàng vào chuyến đi cho shipper này?',
      onOk: this.onConfirm,
      onCancel: this.onCancel,
    });
  }
  async getOrdersEachClient(options) {
    const url = this.buildUrl('/client/orders-each-client', options);
    const result = await request(url);
    if (result.status === 'success') {
      const { data } = result;
      this.setState({
        clients: data,
        spin: false,
      });
    }
  }
  async getShipperList() {
    const result = await request('/user/getShipper');
    this.setState({
      shippers: result,
    });
  }

  buildUrl(url, options) {
    let result = url;
    if (options) {
      for (const key in options) {
        if (url.includes('?')) {
          result += `&${key}=${options[key]}`;
        } else {
          result += `?${key}=${options[key]}`;
        }
      }
    }
    return result;
  }
  renderShipers = (record) => {
    const { shippers } = this.state;
    const options = shippers.map((shipper) => {
      return (<Option key={shipper.value} value={shipper.value}>{shipper.text}</Option>);
    });
    return (
      <Select
        onChange={value => this.onSelectShipper(value, record.orders, record._id)}
        style={{ minWidth: 100 }}
      >
        {options}
      </Select>
    );
  }

  renderAddress = (record) => {
    const { district } = record;
    return `${record.address}, ${district.type} ${district.name}`;
  }
  renderMoney = (record) => {
    const money = Number(record.goodsMoney) + Number(record.shipFee);
    return money;
  }
  renderOrderAddress = (record) => {
    const { receiver } = record;
    const result = receiver.address;
    return result;
  }
  renderOrders = (record) => {
    const { orders } = record;
    const columns = [
      { key: 'id', dataIndex: 'id' },
      { render: this.renderOrderAddress },
      { render: this.renderMoney },
      { render: () => 'Sửa' },
    ];
    return (
      <Table
        rowKey="_id"
        showHeader={false}
        dataSource={orders}
        columns={columns}
        pagination={false}
      />
    );
  }

  renderTotalMoney = (record) => {
    const { orders } = record;
    let result = 0;
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const money = Number(order.goodsMoney) + Number(order.shipFee);
      result += money;
    }
    return result;
  }
  renderDate = (record) => {
    const { orders } = record;
    const dateTime = new Date(orders[0].createdAt);
    const month = dateTime.getMonth();
    const date = dateTime.getDate();
    const hour = dateTime.getHours();
    const min = dateTime.getMinutes();
    const result = `${date}/${month} ${hour}:${min}`;
    return result;
  }
  renderName = (record) => {
    return (
      <div>
        <span>{record.name}</span><br />
        <span>({record.phone})</span>
      </div>
    );
  }

  render() {
    const { clients, spin } = this.state;
    const columns = [
      { key: 'id', dataIndex: 'id' },
      { render: this.renderDate },
      { render: this.renderName },
      { render: this.renderAddress },
      { render: this.renderTotalMoney },
      { render: this.renderShipers },
    ];

    return (
      <div className={styles.clientOrderContainer}>
        <Table
          rowKey="_id"
          showHeader={false}
          expandedRowRender={this.renderOrders}
          dataSource={clients}
          columns={columns}
          pagination={false}
          loading={spin}
        />
      </div>
    );
  }
}
