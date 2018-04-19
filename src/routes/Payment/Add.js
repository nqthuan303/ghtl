import React from 'react';
import {
  Table,
  Row,
  Col,
  Button,
  // Modal,
  Badge,
  notification,
} from 'antd';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { order as orderStatus, orderPayBy } from '../../constants/status';
import request from '../../utils/request';

class Add extends React.Component {
  constructor(props) {
    super(props);
    this.clientId = this.props.match.params.id;
    this.state = {
      client: {},
      orders: [],
      selectedRowKeys: [],
    };
  }

  componentDidMount() {
    this.getClient();
  }
  onClickBlack = () => {
    const { history } = this.props;
    history.push('/payment/list');
  }
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }
  async getClient() {
    const data = await request(`/client/find-one-payment/${this.clientId}`);
    if (data && data.data) {
      const result = [];
      const client = data.data;
      if (client.orders) {
        for (let i = 0; i < client.orders.length; i++) {
          const order = client.orders[i];
          if (order.orderstatus === orderStatus.DELIVERED.value
            || order.orderstatus === orderStatus.RETURNFEESTORAGE.value
            || order.orderstatus === orderStatus.RETURNFEEPREPARE.value
            || order.orderstatus === orderStatus.RETURNINGFEE.value
            || order.orderstatus === orderStatus.RETURNEDFEE.value
            || order.orderstatus === orderStatus.RETURNSTORAGE.value
            || order.orderstatus === orderStatus.RETURNPREPARE.value
            || order.orderstatus === orderStatus.RETURNING.value
            || order.orderstatus === orderStatus.RETURNED.value
          ) {
            result.push(order);
          }
        }
      }
      delete client.orders;
      this.setState({
        client,
        orders: result,
      });
    }
  }
  createPayment= () => {
    const { client, selectedRowKeys } = this.state;
    const payment = {
      client: client._id,
      orders: selectedRowKeys,
    };
    const url = '/payment/add';
    const method = 'POST';
    request(url, { method, body: payment }).then((result) => {
      if (result.status === 'success') {
        notification.success({
          message: 'Thành Công',
          description: 'Tạo bảng kê thành công',
        });
        const { history } = this.props;
        history.push(`/payment/pay/${result.data._id}`);
      } else {
        notification.error({
          message: 'Xãy ra lỗi',
          description: result.data.msg,
        });
      }
    });
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
  render() {
    const { client, orders, selectedRowKeys } = this.state;
    const columns = [{
      title: 'MVĐ',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Ngày tạo',
      key: 'date',
      render: record => moment(record.createdAt).format('DD-MM HH:mm'),
    }, {
      title: 'Địa chỉ nhận',
      key: 'address',
      render: record => record.receiver.address,
    }, {
      title: 'Đã thu khách',
      key: 'money',
      render: this.renderMoney,
    }, {
      title: 'Cước phí',
      dataIndex: 'shipFee',
      key: 'shipFee',
    }, {
      title: 'Trạng thái',
      key: 'status',
      render: record => this.renderStatus(record.orderstatus),
    }];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <PageHeaderLayout title="Tạo bảng">
        <div>
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
            dataSource={orders}
            columns={columns}
            rowKey={record => record._id}
            rowSelection={rowSelection}
            pagination={{ showSizeChanger: true, pageSize: 20 }}
          />
          <div style={{ textAlign: 'right' }}>
            <Button onClick={this.onClickBlack} style={{ marginRight: 10 }}> Quay Lại</Button>
            <Badge count={selectedRowKeys.length} showZero>
              <Button
                type="primary"
                onClick={this.createPayment}
                disabled={client.payment}
              > Tạo Bảng Kê
              </Button>
            </Badge>
          </div>
        </div>
      </PageHeaderLayout>
    );
  }
}
export default Add;
