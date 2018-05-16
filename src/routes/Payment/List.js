import React from 'react';
import {
  Table,
  Button,
  // Modal,
  // notification
} from 'antd';
// import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import { delivery as deliveryStatus } from '../../constants/status';
import request from '../../utils/request';

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clients: [],
    };
  }

  componentDidMount() {
    this.getList();
  }
  onClickPayment(paymentId) {
    const { history } = this.props;
    history.push(`/payment/info/${paymentId}`);
  }
  onClickAddPayment(clientId) {
    const { history } = this.props;
    history.push(`/payment/add/${clientId}`);
  }
  onClickHistory = () => {
    const { history } = this.props;
    history.push('/payment/history');
  }
  async getList() {
    const result = await request('/client/client-for-payment');
    if (result.status === 'success') {
      this.setState({ clients: result.data });
    }
  }
  renderPaymentId = ({ payments }) => {
    let result = '';
    if (payments && payments.length > 0) {
      result = (
        <a onClick={() => this.onClickPayment(payments[0]._id)}>{payments[0].id}</a>
      );
    }
    return result;
  }
  render() {
    const { clients } = this.state;
    const columns = [{
      title: 'Tên Shop',
      key: 'name',
      render: record => (
        <a onClick={() => this.onClickAddPayment(record._id)}>{record.name} - {record.phone}</a>
      ),
    },
    {
      title: 'Địa Chỉ',
      dataIndex: 'address',
      key: 'address',
    }, {
      title: 'Quận',
      key: 'district',
      render: record => record.district.name,
    }, {
      title: 'Chưa thanh toán',
      key: 'totalMoney',
      dataIndex: 'totalMoney',
    }, {
      title: 'Bảng kê',
      key: 'payment',
      render: this.renderPaymentId,
    }];
    return (
      <PageHeaderLayout title="Shop cần thanh toán">
        <div>
          <div>
            <Button onClick={this.onClickHistory} type="primary">Lịch Sử Thanh Toán</Button>
          </div>
          <br />
          <Table
            bordered
            dataSource={clients}
            rowKey={record => record._id}
            columns={columns}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
export default List;
