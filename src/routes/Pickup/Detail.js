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
      checkedIds: [],
      pickup: {
        data: [],
        shipper: {},
      },
    };
    this.pickupId = id;
  }
  componentDidMount() {
    this.getPickup();
  }

  onClickEnd = async () => {
    const { objChecked } = this.state;
    const url = '/pickup/save';
    const result = await request(url, {
      method: 'POST',
      body: { pickupId: this.pickupId, objChecked },
    });
    if (result.status === 'success') {
      notification.success({
        message: 'Thành công',
        description: 'Đã kết thúc chuyến đi!',
      });
      this.getPickup();
    }
  }

  onClickSave = async () => {
    const url = '/order/update-status';
    const orderIds = this.getCheckedOrder();
    const body = { status: orderStatus.STORAGE.value, orderIds };
    const result = await request(url, {
      method: 'POST',
      body,
    });
    if (result.status === 'success') {
      notification.success({
        message: 'Thành công',
        description: 'Lưu chuyến đi thành công!',
      });
      this.getPickup();
    }
  }
  onCheckClient(checked, clientId, orders) {
    const { objChecked, checkedIds } = this.state;
    const checkedClient = objChecked[clientId];
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const orderId = order._id;
      if (order.orderstatus !== orderStatus.STORAGE.value) {
        checkedClient[orderId] = checked;
      }
      const indexOfOrder = checkedIds.indexOf(orderId);
      if (checked) {
        if (indexOfOrder === -1) {
          checkedIds.push(orderId);
        }
      } else if (indexOfOrder > -1) {
        checkedIds.splice(indexOfOrder, 1);
      }
    }
    this.setState({
      checkedIds,
      objChecked: {
        ...objChecked, [clientId]: checkedClient,
      },
    });
  }
  onCheckOrder(checked, clientId, orderId) {
    const { objChecked, checkedIds } = this.state;
    const indexOfOrder = checkedIds.indexOf(orderId);
    if (checked) {
      if (indexOfOrder === -1) {
        checkedIds.push(orderId);
      }
    } else if (indexOfOrder > -1) {
      checkedIds.splice(indexOfOrder, 1);
    }
    this.setState({
      objChecked: {
        ...objChecked,
        [clientId]: {
          ...objChecked[clientId], [orderId]: checked,
        },
      },
    });
  }
  getCheckedOrder() {
    const { objChecked } = this.state;
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
    return orderIds;
  }
  async getPickup() {
    const url = `/pickup/${this.pickupId}`;
    const result = await request(url);
    if (result.status === 'success') {
      const { data } = result;
      const { data: dataPickups } = data;
      const objChecked = {};
      let numOfOrders = 0;
      const checkedIds = [];
      const objPickup = data;
      for (let i = 0; i < dataPickups.length; i++) {
        const dataPickup = dataPickups[i];
        const { client, orders } = dataPickup;
        const clientId = client._id;
        objChecked[clientId] = {};
        for (let j = 0; j < orders.length; j++) {
          const order = orders[j];
          if (order.client === clientId) {
            const orderId = order._id;
            const { orderstatus } = order;
            if (orderstatus === orderStatus.STORAGE.value) {
              objChecked[clientId][orderId] = true;
              checkedIds.push(orderId);
            } else {
              objChecked[clientId][orderId] = false;
            }
          }
        }
        numOfOrders += orders.length;
      }
      this.setState({
        loading: false,
        pickup: objPickup,
        numOfOrders,
        objChecked,
        checkedIds,
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
    const { data: dataPickups } = pickup;
    const { DONE } = pickupStatus;
    return dataPickups.map((dataPickup) => {
      const { client, orders } = dataPickup;
      const { address, district, ward } = client;
      const fullAddress = `${address}, ${ward.type} ${ward.name}, ${district.type} ${district.name}`;
      return (
        <div style={{ height: 100 }} key={client._id}>
          <div style={{ width: 250, float: 'left' }} >
            <Checkbox
              disabled={pickup.status === DONE}
              onChange={
                ({ target: { checked } }) => this.onCheckClient(checked, client._id, orders)
              }
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
    const { pickup, numOfOrders, loading, checkedIds } = this.state;
    const { shipper } = pickup;
    const { INPROCESS } = pickupStatus;
    return (
      <PageHeaderLayout title="Danh sách shop">
        <Spin spinning={loading}>
          Mã chuyến đi lấy {pickup.id} (0/{numOfOrders}) <br />
          Nhân viên lấy: {shipper.name} - (id: {shipper.id}) <br /> <br />
          {this.renderData()}
        </Spin>
        { pickup.status === INPROCESS ?
          <Button
            disabled={checkedIds.length === 0}
            onClick={this.onClickSave}
            type="primary"
            style={{ marginRight: 10 }}
          >
            Lưu
          </Button> : ''}
        { pickup.status === INPROCESS ?
          <Button
            disabled={checkedIds.length === 0}
            onClick={this.onClickEnd}
          >
            Kết thúc
          </Button> : '' }
      </PageHeaderLayout>
    );
  }
}
export default PickupDetail;
