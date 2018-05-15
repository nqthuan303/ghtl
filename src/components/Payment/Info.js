import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Row, Col } from 'antd';
import moment from 'moment';
import request from '../../utils/request';
import { order as objOrderStatus, orderPayBy } from '../../constants/status';

class PaymentInfo extends Component {
    static propTypes = {
      payment: PropTypes.object.isRequired,
      closeShowModal: PropTypes.func.isRequired,
    }
    constructor(props) {
      super(props);
      this.state = {
        orders: [],
      };
    }
    componentDidMount() {
      this.getPaymentInfo(this.props.payment);
    }
    componentWillReceiveProps(nextProps) {
      if (JSON.stringify(this.props.payment) !== JSON.stringify(nextProps.payment)) {
        this.getPaymentInfo(nextProps.payment);
      }
    }
    async getPaymentInfo(payment) {
      const result = await request(`/history/list-for-type?id=${payment._id}&type=payment`);
      if (result.status === 'success') {
        const orders = result.data;
        const arrOrder = [];
        for (let i = 0; i < orders.length; i++) {
          arrOrder.push(orders[i]);
        }
        this.setState({
          orders: arrOrder,
        });
      }
    }
    renderReceiver(order) {
      const { phoneNumbers, name } = order.receiver;
      const phoneNumber = phoneNumbers && phoneNumbers.length > 0 ? phoneNumbers[0] : '';
      const result = phoneNumber ? `${name} - ${phoneNumber}` : name;
      return result;
    }
    renderMoney = (order) => {
      let money = 0;
      if (order.orderstatus === objOrderStatus.DELIVERED.value) {
        money = order.goodsMoney + order.shipFee;
        if (order.payBy === orderPayBy.SENDER.value) {
          money = order.goodsMoney;
        }
      }
      return money;
    }
    renderOrderStatus = (status) => {
      let result = '';
      for (const key in objOrderStatus) {
        if (objOrderStatus[key]) {
          const objStatus = objOrderStatus[key];
          if (objStatus.value === status) {
            result = objStatus.name;
            break;
          }
        }
      }
      return result;
    }
    render() {
      const { payment: { client } } = this.props;
      const { orders } = this.state;
      const columns = [{
        title: 'MVĐ',
        key: 'id',
        render: record => (
          <div>{record.order ? record.order.id : ''}</div>
        ),
      },
      {
        title: 'Ngày tạo',
        key: 'date',
        render: record => moment(record.createdAt).format('DD-MM HH:mm'),
      }, {
        title: 'Địa chỉ nhận',
        key: 'receiver',
        render: record => this.renderReceiver(record.order),
      }, {
        title: 'Đã thu khách',
        key: 'money',
        render: record => this.renderMoney(record.order),
      }, {
        title: 'Cước phí',
        key: 'shipFee',
        render: record => (
          <div>{record.order ? record.order.shipFee : 0}</div>
        ),
      }, {
        title: 'Trạng thái',
        key: 'status',
        render: record => this.renderOrderStatus(record.orderStatus),
      }];
      return (
        <div>
          <div style={{ fontSize: '16px' }}>
            <b> Tổng tiền thanh toán: {this.props.payment.money}</b>
          </div>
          <Row gutter={8}>
            <Col span={12}>
              <div> Thông Tin Shop</div>
              <ul>
                <li>{client.name}</li>
                <li>{client.phone}</li>
                <li>{client.address}</li>
              </ul>
            </Col>
            <Col span={12}>
              <div>Thanh Toán: Chuyển khoản</div>
              <ul>
                <li>{client.bankBranch}</li>
                <li>{client.bankAccount}</li>
                <li>{client.bankNumber}</li>
              </ul>
            </Col>
          </Row>
          <Table
            pagination={false}
            bordered
            columns={columns}
            dataSource={orders}
            rowKey={record => record._id}
          />
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Button
              onClick={() => this.props.closeShowModal()}
            > Đóng
            </Button>
          </div>
        </div>
      );
    }
}

export default PaymentInfo;
