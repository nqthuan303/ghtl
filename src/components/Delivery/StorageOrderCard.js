import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';


export default class StorageOrderCard extends Component {
static propTypes = {
  onClickCardOrder: PropTypes.func.isRequired,
  orderEachDistrict: PropTypes.array.isRequired,
}
constructor(props) {
  super(props);
  this.state = {
  };
}

onClickCard(order) {
  this.props.onClickCardOrder(order);
}
renderOrder() {
  const { orderEachDistrict } = this.props;
  const result = [];
  for (let i = 0; i < orderEachDistrict.length; i += 1) {
    const order = orderEachDistrict[i];

    const createdAt = new Date(order.createdAt);
    const orderCreatedAt = `${createdAt.getDate()}/${
      createdAt.getMonth()} ${
      createdAt.getHours()}:${
      createdAt.getMinutes()}`;

    result.push(
      <Card
        key={i}
        title={orderCreatedAt}
        onClick={() => this.onClickCard(order)}
        bordered={false}
        style={{ width: 180, float: 'left', margin: '0 10px 10px 0' }}
      >
        <p>{order.id}</p>
        <p>{order.reciever.address}</p>
      </Card>
    );
  }
  return result;
}
render() {
  return (
    <div>
      {this.renderOrder()}
      {/* <ConfirmModal
          onModalClose={this.onModalClose}
          loading={confirmLoading}
          onConfirm={() => this.confirmCancelOrder()}
          title="Hủy vận đơn"
          content={confirmContent}
          show={cancelOrderModal} /> */}
    </div>

  );
}
}
