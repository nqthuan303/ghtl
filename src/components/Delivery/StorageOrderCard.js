import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, List } from 'antd';


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
renderOrder(order) {
  const createdAt = new Date(order.createdAt);
  const orderCreatedAt = `${createdAt.getDate()}/${
    createdAt.getMonth()} ${
    createdAt.getHours()}:${
    createdAt.getMinutes()}`;

  return (
    <List.Item>
      <Card title={orderCreatedAt} onClick={() => this.onClickCard(order)}>
        <div> ID: {order.id}</div>
        <p>{order.receiver.address}</p>
      </Card>
    </List.Item>);
}
render() {
  const { orderEachDistrict } = this.props;
  return (
    <div>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={orderEachDistrict}
        renderItem={order => (
          this.renderOrder(order)
        )}
      />
    </div>

  );
}
}
