import React from 'react';
import { withRouter } from 'react-router';
// import request from '../../utils/request';

class OrderInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // orders: [],
    };
  }

  componentDidMount() {
    this.getOrders();
  }

  // async getOrders() {
  //   const { id } = this.props.match.params;
  //   const result = await request(`/client/order-info/${id}`);
  //   const resResult = result.data;
  //
  //   if (resResult.status === 'success') {
  //     const { data } = resResult;
  //     this.setState({ orders: data });
  //   }
  // }

  render() {
    return (
      <div>123123</div>
    );
  }
}

export default withRouter(OrderInfo);
