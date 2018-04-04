import React, { Component } from 'react';
import { Table, Select, Icon, Modal, notification } from 'antd';

import request from '../../utils/request';
import styles from './ClientOrderTable.less';

const { Option } = Select;
const { confirm } = Modal;

export default class ClientOrderTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shippers: [],
      clients: [],
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

  renderOrders = (record) => {
    const { orders } = record;
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
        dataSource={orders}
        columns={columns}
        pagination={false}
      />
    );
  }

  render() {
    const { clients } = this.state;
    const columns = [
      { key: 'name' },
      { render: this.renderAddress },
      { render: () => '1.200.000' },
      { render: () => <Icon type="printer" /> },
      { render: this.renderShipers },
    ];

    return (
      <div className={styles.clientOrderContainer}>
        <Table
          showHeader={false}
          expandedRowRender={this.renderOrders}
          dataSource={clients}
          columns={columns}
          pagination={false}
        />
      </div>
    );
  }
}
