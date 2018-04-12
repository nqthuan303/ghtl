import React from 'react';
import {
  Table,
  Row,
  Col,
  Button,
  // Modal,
  // notification,
} from 'antd';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { order as orderStatus, orderPayBy } from '../../constants/status';
import request from '../../utils/request';

class Pay extends React.Component {
  constructor(props) {
    super(props);
    this.paymentId = this.props.match.params.id;
    this.state = {
      payment: {},
    };
  }

  componentDidMount() {
    this.getPayment();
  }
  onClickBlack = () => {
    const { history } = this.props;
    history.push('/payment/list');
  }
  async getPayment() {
    const data = await request(`/payment/findOne/${this.paymentId}`);
    console.log(data);
    if (data && data.data) {
      this.setState({
        payment: data.data,
      });
    }
  }
  renderMoney = (order) => {
    let money = 0;
    if (order.orderstatus === orderStatus.DELIVERED.value) {
      money = order.goodMoney + order.shipFee;
      if (order.payBy === orderPayBy.SENDER.value) {
        money = order.goodMoney;
      }
    }
    return money;
  }
  renderStatus(status) {
    for (const key in orderStatus) {
      if (key === 'DELIVERED' || key === 'RETURNFEESTORAGE' || key === 'RETURNFEEPREPARE' ||
        key === 'RETURNINGFEE' || key === 'RETURNEDFEE' || key === 'RETURNSTORAGE'
        || key === 'RETURNPREPARE' || key === 'RETURNING' || key === 'RETURNED') {
        if (status === orderStatus[key].value) {
          return orderStatus[key].name;
        }
      }
    }
  }
  renderReveiverMoney = (order) => {
    let money = 0;
    if (order.orderstatus === orderStatus.DELIVERED.value) {
      money = order.goodMoney + order.shipFee;
      if (order.payBy === orderPayBy.SENDER.value) {
        money = order.goodMoney;
      }
    }
    money -= order.shipFee;
    return money;
  }
  render() {
    const { payment } = this.state;
    const columns = [{
      title: 'MVĐ',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Ngày tạo',
      key: 'date',
      render: record => moment(record.createdAt).format('DD-MM HH:mm'),
    },
    {
      title: 'Người nhận',
      key: 'receiver',
      render: record => (
        <div>{record.receiver.name} - {record.receiver.phone}</div>
      ),
    },
    {
      title: 'Địa chỉ nhận',
      key: 'address',
      render: record => record.receiver.address,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: record => this.renderStatus(record.orderstatus),
    },
    {
      title: 'Đã thu khách',
      key: 'money',
      render: this.renderMoney,
    }, {
      title: 'Cước phí',
      dataIndex: 'shipFee',
      key: 'shipFee',
    },
    {
      title: 'Thực nhận',
      key: 'receiverMoney',
      render: this.renderReveiverMoney,
    }];
    return (
      <PageHeaderLayout title="Tạo bảng">
        <div>
          {payment.client ?
            <Row gutter={8}>
              <Col span={12}>
                <div> Thông Tin Shop</div>
                <ul>
                  <li>{payment.client.name}</li>
                  <li>{payment.client.phone}</li>
                  <li>{payment.client.address}</li>
                </ul>
              </Col>
              <Col span={12}>
                <div>Thanh Toán: Chuyển khoản</div>
                <ul>
                  <li>{payment.client.bankBranch}</li>
                  <li>{payment.client.bankAccount}</li>
                  <li>{payment.client.bankNumber}</li>
                </ul>
              </Col>
            </Row>
          : ''}

          <Table
            dataSource={payment.orders}
            columns={columns}
            pagination={{ showSizeChanger: true, pageSize: 20 }}
          />
          <div style={{ textAlign: 'right' }}>
            <Button onClick={this.onClickBlack} style={{ marginRight: 10 }}> Quay Lại</Button>
            <Button onClick={this.onClickCancel} type="danger" style={{ marginRight: 10 }}> Hủy Bảng</Button>
            <Button
              type="primary"
              onClick={this.onClickDone}
            > Xác Nhận Thanh Toán
            </Button>
          </div>
        </div>
      </PageHeaderLayout>
    );
  }
}
export default Pay;
