import React from 'react';
import { Checkbox, Spin } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import request from '../../utils/request';

class PickupDetail extends React.Component {
  constructor(props) {
    super(props);
    const { match: { params: { id } } } = props;
    this.state = {
      numOfOrders: 0,
      loading: true,
      pickup: {
        clients: [],
        shipper: {},
      },
    };
    this.pickupId = id;
  }
  componentDidMount() {
    this.getPickup();
  }
  async getPickup() {
    const url = `/pickup/${this.pickupId}`;
    const result = await request(url);
    if (result.status === 'success') {
      const { data } = result;
      const { clients } = data;
      let numOfOrders = 0;
      for (let i = 0; i < clients.length; i++) {
        const client = clients[i];
        const { orders } = client;
        numOfOrders += orders.length;
      }
      this.setState({
        loading: false,
        pickup: data,
        numOfOrders,
      });
    }
  }

  renderOrders(orders) {
    return orders.map((order) => {
      return (
        <Checkbox key={order._id}>{order.id}</Checkbox>
      );
    });
  }

  renderData() {
    const { pickup } = this.state;
    const { clients } = pickup;
    return clients.map((client) => {
      const { orders } = client;
      const { address, district, ward } = client;
      const fullAddress = `${address}, ${ward.type} ${ward.name}, ${district.type} ${district.name}`;
      return (
        <div style={{ height: 100 }} key={client._id}>
          <div style={{ width: 250, float: 'left' }} >
            <Checkbox>{client.name} (0/{orders.length})</Checkbox> <br />
            {fullAddress}
          </div>
          <div>{this.renderOrders(orders)}</div>
        </div>
      );
    });
  }

  render() {
    const { pickup, numOfOrders, loading } = this.state;
    const { shipper } = pickup;
    return (
      <PageHeaderLayout title="Danh sách shop">
        <Spin spinning={loading}>
          Mã chuyến đi lấy {pickup.id} (0/{numOfOrders}) <br />
          Nhân viên lấy: {shipper.name} - (id: {shipper.id}) <br /> <br />
          {this.renderData()}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
export default PickupDetail;
