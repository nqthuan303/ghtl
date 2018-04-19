import React from 'react';
import {
  Table,
  // Button,
  Modal,
  // notification
} from 'antd';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { payment as paymentStatus } from '../../constants/status';
import PaymentInfo from '../../components/Payment/PaymentInfo';
import request from '../../utils/request';

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      payments: [],
      payment: {},
      showModal: false,
    };
  }

  componentDidMount() {
    this.getList();
  }
  onClickPaymentInfo(record) {
    this.setState({
      payment: record,
      showModal: true,
    });
  }
  async getList() {
    const data = await request('/payment/list');
    if (data && data.data) {
      this.setState({ payments: data.data });
    }
  }
  closeShowModal = () => {
    this.setState({
      showModal: false,
    });
  }
  renderShopName = (record) => {
    let nameShop = '';
    let phoneShop = '';
    if (record.client) {
      nameShop = record.client.name;
      phoneShop = record.client.phone;
    }
    return (<div>{nameShop} - {phoneShop}</div>);
  }
  renderStatus(status) {
    if (status === paymentStatus.DONE) {
      return 'Đã thanh toán';
    } else if (status === paymentStatus.DOING) {
      return 'Chưa thanh toán';
    } else {
      return 'Bảng kê đã Hủy';
    }
  }
  render() {
    const { payments, payment } = this.state;
    const columns = [{
      title: 'Mã bảng kê',
      key: 'id',
      render: record => (
        <a onClick={() => this.onClickPaymentInfo(record)}>{record.id}</a>
      ),
    },
    {
      title: 'Ngày kê',
      key: 'startTime',
      render: record => moment(record.startTime).format('DD-MM HH:mm'),
    }, {
      title: 'Tên shop',
      key: 'name',
      render: this.renderShopName,
    }, {
      title: 'Tổng thanh toán',
      key: 'money',
      dataIndex: 'money',
    }, {
      title: 'Trạng thái',
      key: 'status',
      render: record => this.renderStatus(record.status),
    }, {
      title: 'Ngày thanh toán',
      key: 'endTime',
      render: record => moment(record.endTime).format('DD-MM HH:mm'),
    }, {
      title: 'Mã giao dịch',
      key: 'bill',
      dataIndex: 'bill',
    }];
    return (
      <PageHeaderLayout title="Lịch sử thanh thanh toán">
        <div>
          <Table
            bordered
            dataSource={payments}
            rowKey={record => record._id}
            columns={columns}
          />
          <Modal
            title="Thông tin đơn hàng của chuyến đi giao"
            visible={this.state.showModal}
            onCancel={this.closeShowModal}
            width={1000}
            footer={null}
          >
            <PaymentInfo
              payment={payment}
              closeShowModal={this.closeShowModal}
            />
          </Modal>
        </div>
      </PageHeaderLayout>
    );
  }
}
export default History;
