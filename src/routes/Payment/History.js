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
import FormBill from '../../components/Payment/FormBill';

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      payments: [],
      payment: {},
      showModal: false,
      showModalBill: false,
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
  onClickUpdateBill(record) {
    this.setState({
      payment: record,
      showModalBill: true,
    });
  }
  onDataSaved = () => {
    this.setState({ showModalBill: false });
    this.getList();
  }
  async getList() {
    const data = await request('/payment/list');
    if (data && data.data) {
      this.setState({ payments: data.data });
    }
  }
  closeShowModal = () => {
    this.setState({ showModal: false });
  }
  closeShowModalBill = () => {
    this.setState({ showModalBill: false });
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
      render: record => (
        <a onClick={() => this.onClickUpdateBill(record)}>{record.bill}</a>
      ),
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
            title={<div> Thông tin đơn hàng đã thanh toán ({moment(payment.endTime).format('DD-MM HH:mm')}) </div>}
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
          <Modal
            title="Cập nhật mã giao dịch"
            visible={this.state.showModalBill}
            onCancel={this.closeShowModalBill}
            width={450}
            footer={null}
          >
            <FormBill
              payment={payment}
              closeShowModalBill={this.closeShowModalBill}
              onDataSaved={this.onDataSaved}
            />
          </Modal>
        </div>
      </PageHeaderLayout>
    );
  }
}
export default History;
