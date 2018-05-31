import React, { Component } from 'react';
import { Card } from 'antd';
import styles from '../../routes/Order/styles.less';
import request from '../../utils/request';
import { payment as paymentStatus, orderPayBy, order as orderStatus } from '../../constants/status';
import { convertDateTime } from '../../utils/utils';

class OrderDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: {},
    };
  }
  componentDidMount() {
    const { orderId } = this.props;
    this.getOrder(orderId);
  }
  componentWillReceiveProps(nextProps) {
    const { orderId } = this.props;
    const { orderId: nextOrderId } = nextProps;
    if (orderId !== nextOrderId) {
      this.getOrder(nextOrderId);
    }
  }
  async getOrder(orderId) {
    this.setState({
      loading: true,
    });
    const result = await request(`/order/detail/${orderId}`);
    if (result.status === 'success') {
      const { data } = result;
      this.setState({ data, loading: false });
    }
  }

  renderPayment() {
    const { data } = this.state;
    const { payment } = data;
    let result = '';
    if (payment) {
      let status = '';
      let dateTime = '';
      if (payment.status === paymentStatus.DONE) {
        status = 'Đã thanh toán';
        dateTime = convertDateTime(payment.endTime);
      }
      if (payment.status === paymentStatus.DOING) {
        status = 'Chờ thanh toán';
        dateTime = convertDateTime(payment.startTime);
      }
      result = (
        <div>
          <strong>{status}</strong> <br />
          {dateTime} <br />
          Mã bảng kê: {payment.id}
        </div>
      );
    }
    return result;
  }

  renderTitle = () => {
    const { data } = this.state;
    if (Object.keys(data).length > 0) {
      const { order } = data;
      const orderId = order.id;
      const status = order.orderstatus.toUpperCase();
      return (
        <div>
          Mã vận đơn: {orderId}
          <span className={styles.orderStatus}>{orderStatus[status].name}</span>
        </div>
      );
    }
  }

  renderOrderInfo() {
    const { data, loading } = this.state;
    let result = '';
    if (Object.keys(data).length > 0) {
      const { order: { client, receiver, goodsMoney, shipFee, payBy } } = data;
      const { district, ward, address } = client;
      const {
        district: receiverDistrict,
        ward: receiverWard,
        address: receiverAddress,
      } = client;
      const fullAddress = `${address}, ${ward.type} ${ward.name}, ${district.type} ${district.name}`;
      const receiverFullAddress = `${receiverAddress}, ${receiverWard.type} ${receiverWard.name}, ${receiverDistrict.type} ${receiverDistrict.name}`;
      const totalMoney = payBy === orderPayBy.RECEIVER ? (shipFee + goodsMoney) : shipFee;
      result = (
        <div className={styles.orderInforContainer}>
          <div className={styles.orderInforBox} span={6}>
            Người gửi: <br />
            <ul>
              <li>{client.name}</li>
              <li>{client.phone}</li>
              <li>{fullAddress}</li>
            </ul>
          </div>
          <div className={styles.orderInforBox} span={6}>
            Người nhận: <br />
            <ul>
              <li>{receiver.name}</li>
              <li>{receiver.phone}</li>
              <li>{receiverFullAddress}</li>
            </ul>
          </div>
          <div className={styles.orderMoneyBox} span={6}>
            <br />
            Tiền hàng: {goodsMoney}<br />
            Phí: {shipFee}<br />
            Người gửi: {payBy}<br />
            Thu khách: {totalMoney}
          </div>
          <div className={styles.orderPaymentBox} span={6}>
            {this.renderPayment()}
          </div>
        </div>
      );
    }
    return (
      <Card loading={loading} className={styles.clientInfoContainer} title={this.renderTitle()}>
        {result}
      </Card>
    );
  }

  render() {
    return (
      <div className={styles.orderDetailContainer}>
        { this.renderOrderInfo() }
        <Card className={styles.orderDetailContainer} title="Lịch sử đơn hàng">
          123123
        </Card>
      </div>
    );
  }
}
export default OrderDetail;
