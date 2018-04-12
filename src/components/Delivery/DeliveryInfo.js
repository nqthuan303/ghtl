import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Row, Col } from 'antd';
import moment from 'moment';
import request from '../../utils/request';
import { order as objOrderStatus, orderPayBy } from '../../constants/status';

class DeliveryInfo extends Component {
    static propTypes = {
      delivery: PropTypes.object.isRequired,
      closeShowModal: PropTypes.func.isRequired,
    }
    constructor(props) {
      super(props);
      this.state = {
        orders: [],
      };
    }
    componentDidMount() {
      this.getDeliveryInfo(this.props.delivery);
    }
    componentWillReceiveProps(nextProps) {
      if (JSON.stringify(this.props.delivery) !== JSON.stringify(nextProps.delivery)) {
        this.getDeliveryInfo(nextProps.delivery);
      }
    }
    async getDeliveryInfo(delivery) {
      const result = await request(`/history/list-for-type?id=${delivery._id}&type=delivery`);
      if (result.status === 'success') {
        const orders = result.data;
        const arrOrder = [];
        for (let i = 0; i < orders.length; i++) {
          arrOrder.push({ ...orders[i], key: i + 1 });
        }
        this.setState({
          orders: arrOrder,
        });
      }
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
    renderMoney(order) {
      let money = order.goodsMoney + order.shipFee;
      if (order.payBy === orderPayBy.SENDER.value) {
        money = order.goodsMoney;
      }
      return money;
    }
    renderReceiver(order) {
      const { phoneNumbers, name } = order.receiver;
      const phoneNumber = phoneNumbers && phoneNumbers.length > 0 ? phoneNumbers[0] : '';
      const result = phoneNumber ? `${name} - ${phoneNumber}` : name;
      return result;
    }
    renderOrder() {
      const { orders } = this.state;
      const columns = [
        {
          title: 'Mã Vận Đơn',
          key: 'id',
          render: record => (
            <div>{record.orderId.id}</div>
          ),
        },
        {
          title: 'Ngày Tạo',
          key: 'createAt',
          render: record => (
            <div>{moment(record.createdAt).format('DD-MM HH:mm')}</div>
          ),
        },
        {
          title: 'Tiền Thu',
          key: 'money',
          render: record => this.renderMoney(record.orderId),
        },
        {
          title: 'Người Nhận',
          key: 'receiver',
          render: record => this.renderReceiver(record.orderId),
        },
        {
          title: 'Địa chỉ',
          key: 'address',
          render: record => record.orderId.receiver.address,
        },
        {
          title: 'Trạng thái',
          key: 'orderStatus',
          render: record => this.renderOrderStatus(record.orderStatus),
        },
      ];
      return (<Table
        columns={columns}
        dataSource={orders}
      />);
    }
    render() {
      const { delivery } = this.props;
      return (
        <div>
          <Row>
            <Col span={12}>Mã Chuyến Đi: <b> {delivery.id} </b></Col>
            <Col span={12}>Thời gian bắt đầu: <b>{moment(delivery.startTime).format('DD-MM HH:mm')}</b></Col>
          </Row>
          <Row>
            <Col span={12}>Shipper: <b>{delivery.user.name}</b></Col>
            <Col span={12}>Thời gian kết thúc: <b>{moment(delivery.endTime).format('DD-MM HH:mm')}</b></Col>
          </Row>
          {this.renderOrder()}
          <div style={{ textAlign: 'center' }}>
            <Button
              onClick={() => this.props.closeShowModal()}
            > Đóng
            </Button>
          </div>
        </div>
      );
    }
}

export default DeliveryInfo;
