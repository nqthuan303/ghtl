import React from 'react';
import { Table, Modal } from 'antd';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { payment as paymentStatus, paymentMethods } from '../../constants/status';
import PaymentInfo from '../../components/Payment/Info';
import request from '../../utils/request';
import FormPaymentMethod from '../../components/Payment/FormPaymentMethod';

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
  onClickUpdateBill(record, index) {
    this.selectedPayment = index;
    this.setState({
      payment: record,
      showModalBill: true,
    });
  }
  onPaymentMethodSaved = ({ method, bank, bill }) => {
    const { payments } = this.state;
    payments[this.selectedPayment].method = method;
    if (method === paymentMethods.TRANSFER.value) {
      payments[this.selectedPayment].bank = bank;
      payments[this.selectedPayment].bill = bill;
    }
    this.setState({
      showModalBill: false,
      payments,
    });
  }
  async getList() {
    const result = await request('/payment/list');
    if (result.status === 'success') {
      this.setState({ payments: result.data });
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
  renderStatus({ status }) {
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
      render: this.renderStatus,
    }, {
      title: 'Ngày thanh toán',
      key: 'endTime',
      render: record => moment(record.endTime).format('DD-MM HH:mm'),
    }, {
      title: 'Phương thức',
      key: 'paymentMethod',
      render: (text, record, index) => (
        <a onClick={() => this.onClickUpdateBill(record, index)}>{record.method}</a>
      ),
    }];
    const paymentMethodData = {
      money: payment.money,
      paymentId: payment._id,
      method: payment.method,
      bill: payment.bill,
      bank: payment.bank,
    };
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
            <FormPaymentMethod
              onDataSaved={this.onPaymentMethodSaved}
              action="updatePayment"
              data={paymentMethodData}
            />
          </Modal>
        </div>
      </PageHeaderLayout>
    );
  }
}
export default History;
