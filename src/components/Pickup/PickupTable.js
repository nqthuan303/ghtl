import React, { Component } from 'react';
import { Table, notification, Modal } from 'antd';
import { withRouter } from 'react-router';
import request from '../../utils/request';
import styles from './styles.less';

class PickupTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pickups: [],
      client: {
        district: {},
        ward: {},
      },
      spin: true,
      showOrder: false,
    };
    this.shiperId = '';
  }
  componentDidMount() {
    this.getPickUpList();
  }

  onCancelModal = () => {
    this.setState({
      showOrder: false,
    });
  }

  onClickPickupId(pickupId) {
    const { history } = this.props;
    history.push(`/pickup/${pickupId}`);
  }
  async getPickUpList() {
    const result = await request('/pickup/list');
    if (result.status === 'success') {
      const { data } = result;

      this.setState({
        pickups: data,
        spin: false,
      });
    } else {
      notification.error({
        message: 'Lỗi',
        description: result.data.msg,
      });
    }
  }
  showOrders(record) {
    const { orders, name, phone, address, district, ward } = record;
    this.setState({
      client: {
        name,
        phone,
        address,
        district,
        ward,
        orders,
      },
      showOrder: true,
    });
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

  renderMoney = (record) => {
    const { orders } = record;
    let money = 0;
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      money += Number(order.goodsMoney) + Number(order.shipFee);
    }
    return money;
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

  renderShowOrder = (record) => {
    return (
      <a onClick={() => this.showOrders(record)}>Xem</a>
    );
  }

  renderData = (record) => {
    const { clients } = record;
    const columns = [
      { key: 'id', dataIndex: 'id' },
      { render: this.renderDate },
      { render: this.renderName },
      { render: this.renderAddress },
      { render: this.renderMoney },
      { render: this.renderShowOrder },
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

  renderDateModal = (record) => {
    const { createdAt } = record;
    const dateTime = new Date(createdAt);
    const month = dateTime.getMonth();
    const date = dateTime.getDate();
    const hour = dateTime.getHours();
    const min = dateTime.getMinutes();
    const result = `${date}/${month} ${hour}:${min}`;
    return result;
  }

  renderAddressModal = (record) => {
    const { receiver: { address, district, ward } } = record;
    const result = `${address}, ${ward.type} ${ward.name}, ${district.type} ${district.name}`;
    return result;
  }

  renderMoneyModal = (record) => {
    return Number(record.goodsMoney) + Number(record.shipFee);
  }

  renderOrderList() {
    const { client } = this.state;
    const { orders, district, ward, address } = client;

    const columns = [
      { title: 'Mã', width: '8%', dataIndex: 'id' },
      { title: 'Ngày tạo', render: this.renderDateModal },
      { title: 'Người nhận', dataIndex: 'receiver.name' },
      { title: 'Địa chỉ', width: '35%', render: this.renderAddressModal },
      { title: 'Thu khách', render: this.renderMoneyModal },
    ];
    const fullAddress = `${address}, ${ward.type} ${ward.name}, ${district.type} ${district.name}`;
    return (
      <div>
        <span>{client.name} ({client.phone}) - {fullAddress}</span> <br /> <br />
        <Table
          rowKey="_id"
          dataSource={orders}
          columns={columns}
        />
      </div>
    );
  }

  renderShiperName = (value, row) => {
    const { shipper } = row;
    return (
      <p>{shipper.name} - {shipper.id}/{shipper.phone}</p>
    );
  }
  renderPickupId = (record) => {
    return (
      <a onClick={() => this.onClickPickupId(record._id)}>{record.id}</a>
    );
  }
  render() {
    const { pickups, showOrder, spin } = this.state;
    const columns = [
      { key: 'pickupId', render: this.renderPickupId },
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
          loading={spin}
        />
        <Modal
          title="Danh sách đơn hàng"
          visible={showOrder}
          footer={null}
          width={800}
          onCancel={this.onCancelModal}
        >
          {this.renderOrderList()}
        </Modal>
      </div>
    );
  }
}

export default withRouter(PickupTable, { withRef: true });
