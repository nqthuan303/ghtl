import React from 'react';
import { Checkbox, Spin, Button, notification } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { order as orderStatus, pickup as pickupStatus } from '../../constants/status';
import request from '../../utils/request';

class PickupDetail extends React.Component {
  constructor(props) {
    super(props);
    const { match: { params: { id } } } = props;
    this.state = {
      numOfOrders: 0,
      loading: true,
      objChecked: {},
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

  onClickEnd = async () => {
    const saved = await this.onClickSave('endPickup');
    if (saved) {
      const url = '/pickup/save';
      const result = await request(url, {
        method: 'POST',
        body: { pickupId: this.pickupId },
      });
      if (result.status === 'success') {
        notification.success({
          message: 'Thành công',
          description: 'Đã kết thúc chuyến đi!',
        });
      }
    }
  }

  onClickSave = async (type) => {
    const { objChecked } = this.state;
    const url = '/order/update-status';
    const orderIds = [];
    for (const clientId in objChecked) {
      if (Object.prototype.hasOwnProperty.call(objChecked, clientId)) {
        const checkedClient = objChecked[clientId];
        for (const orderId in checkedClient) {
          if (Object.prototype.hasOwnProperty.call(checkedClient, orderId)) {
            const checkedOrder = checkedClient[orderId];
            if (checkedOrder) {
              orderIds.push(orderId);
            }
          }
        }
      }
    }
    const body = { status: orderStatus.STORAGE.value, orderIds };
    const result = await request(url, {
      method: 'POST',
      body,
    });
    let saved = false;
    if (result.status === 'success') {
      if (type !== 'endPickup') {
        notification.success({
          message: 'Thành công',
          description: 'Lưu chuyến đi thành công!',
        });
      }
      this.getPickup();
      saved = true;
    }
    return saved;
  }
  onCheckClient(checked, client) {
    const clientId = client._id;
    const { orders } = client;
    const { objChecked } = this.state;
    const checkedClient = objChecked[clientId];
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const orderId = order._id;
      if (order.orderstatus !== orderStatus.STORAGE.value) {
        checkedClient[orderId] = checked;
      }
    }
    this.setState({
      objChecked: {
        ...objChecked, [clientId]: checkedClient,
      },
    });
  }
  onCheckOrder(checked, clientId, orderId) {
    const { objChecked } = this.state;
    this.setState({
      objChecked: {
        ...objChecked,
        [clientId]: {
          ...objChecked[clientId], [orderId]: checked,
        },
      },
    });
  }
  async getPickup() {
    const url = `/pickup/${this.pickupId}`;
    const result = await request(url);
    if (result.status === 'success') {
      const { data } = result;
      const { clients } = data;
      const objChecked = {};
      let numOfOrders = 0;
      for (let i = 0; i < clients.length; i++) {
        const client = clients[i];
        const { orders } = client;
        objChecked[client._id] = {};
        for (let j = 0; j < orders.length; j++) {
          const order = orders[j];
          const { orderstatus } = order;
          if (orderstatus === orderStatus.STORAGE.value) {
            objChecked[client._id][order._id] = true;
          } else {
            objChecked[client._id][order._id] = false;
          }
        }
        numOfOrders += orders.length;
      }
      this.setState({
        loading: false,
        pickup: data,
        numOfOrders,
        objChecked,
      });
    }
  }

  renderOrders(orders, clientId) {
    const { objChecked } = this.state;
    const checkedClient = objChecked[clientId];
    return orders.map((order) => {
      const { orderstatus } = order;
      let disabled = false;
      if (orderstatus === orderStatus.STORAGE.value) {
        disabled = true;
      }
      return (
        <Checkbox
          disabled={disabled}
          checked={checkedClient[order._id]}
          onChange={({ target: { checked } }) => this.onCheckOrder(checked, clientId, order._id)}
          key={order._id}
        >
          {order.id}
        </Checkbox>
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
            <Checkbox
              onChange={({ target: { checked } }) => this.onCheckClient(checked, client)}
            >{client.name} (0/{orders.length})
            </Checkbox> <br />
            {fullAddress}
          </div>
          <div>{this.renderOrders(orders, client._id)}</div>
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
        { pickup.status !== pickupStatus.DONE ?
          <Button onClick={this.onClickSave} type="primary" style={{ marginRight: 10 }}>Lưu</Button> : ''}
        { pickup.status !== pickupStatus.DONE ?
          <Button onClick={this.onClickEnd}>Kết thúc</Button> : '' }
      </PageHeaderLayout>
    );
  }
}
export default PickupDetail;
