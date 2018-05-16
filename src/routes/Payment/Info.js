import React from 'react';
import {
  Table,
  Row,
  Col,
  Button,
  Modal,
  notification,
} from 'antd';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { order as orderStatus, orderPayBy, payment as paymentStatus } from '../../constants/status';
import request from '../../utils/request';
import FormPaymentMethod from '../../components/Payment/FormPaymentMethod';

const { confirm } = Modal;

class PaymentInfo extends React.Component {
  constructor(props) {
    super(props);
    this.paymentId = this.props.match.params.id;
    this.state = {
      payment: {},
      showModal: false,
      totalMoneyNeedToBePaid: 0,
    };
  }

  componentDidMount() {
    this.getPayment();
  }
  onConfirmCancel = async () => {
    const result = await request(`/payment/payment-cancel/${this.paymentId}`, { method: 'PUT' });
    if (result.status === 'success') {
      notification.success({
        message: 'Thành Công',
        description: 'Hủy bảng kê thành công',
      });
      const { history } = this.props;
      history.push('/payment/list');
    } else {
      notification.error({
        message: 'Xãy ra lỗi',
        description: result.data.msg,
      });
    }
  }
  onClickCancel = () => {
    const _this = this;
    confirm({
      title: 'Xác nhận xóa?',
      content: 'Bạn có chắc muốn HỦY bảng kê này không?',
      okText: 'Xác nhận',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: _this.onConfirmCancel,
    });
  }
  onClickConfirm = () => {
    this.setState({ showModal: true });
  }
  onClickBlack = () => {
    const { history } = this.props;
    history.push('/payment/list');
  }
  onPaymentMethodSaved = () => {
    const { history } = this.props;
    history.push('/payment/list');
  }
  getShipFee = (record) => {
    const { orderstatus, shipFee } = record;
    let result = 0;
    if (
      orderstatus === orderStatus.DELIVERED.value ||
      orderstatus === orderStatus.RETURNFEESTORAGE.value ||
      orderstatus === orderStatus.RETURNEDFEE.value ||
      orderstatus === orderStatus.RETURNFEEPREPARE.value
    ) {
      result = shipFee;
    }
    return result;
  }
  getMoneyFromReceiver = (order) => {
    let money = 0;
    if (order.orderstatus === orderStatus.DELIVERED.value) {
      money = order.goodsMoney;
      if (order.payBy === orderPayBy.RECEIVER.value) {
        money += order.shipFee;
      }
    }
    return money;
  }
  async getPayment() {
    const result = await request(`/payment/findOne/${this.paymentId}`);
    if (result.status === 'success') {
      const payment = result.data;
      if (payment.status !== paymentStatus.DOING) {
        const { history } = this.props;
        history.push('/payment/list');
      }
      let totalMoneyNeedToBePaid = 0;
      for (let i = 0; i < payment.orders.length; i++) {
        const order = payment.orders[i];
        const moneyFromReceiver = this.getMoneyFromReceiver(order);
        const shipFee = this.getShipFee(order);
        totalMoneyNeedToBePaid += (moneyFromReceiver - shipFee);
      }
      this.setState({
        payment,
        totalMoneyNeedToBePaid,
      });
    }
  }
  getReceivedMoney = (order) => {
    const moneyFromReceiver = this.getMoneyFromReceiver(order);
    const shipFee = this.getShipFee(order);
    return (moneyFromReceiver - shipFee);
  }
  closeShowModal = () => {
    this.setState({ showModal: false });
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
    const { payment, showModal, totalMoneyNeedToBePaid } = this.state;
    const columns = [{
      title: 'ID',
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
      width: 150,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: record => this.renderStatus(record.orderstatus),
    },
    {
      title: 'Đã thu khách',
      key: 'money',
      render: this.getMoneyFromReceiver,
    },
    {
      title: 'Cước phí',
      key: 'shipFee',
      render: this.getShipFee,
    },
    {
      title: 'Thực nhận',
      key: 'receiverMoney',
      render: this.getReceivedMoney,
    }];
    const paymentMethodData = {
      money: totalMoneyNeedToBePaid,
      paymentId: this.paymentId,
    };
    return (
      <PageHeaderLayout title="Xác nhận thanh toán">
        <div style={{ fontSize: '16px' }}>
          <b> Tổng tiền cần thanh toán: {totalMoneyNeedToBePaid}</b>
        </div>
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
                <div>Thông tin tài khoản</div>
                <ul>
                  <li>Ngân hàng: {payment.client.bankName ? payment.client.bankName : 'N/A'}</li>
                  <li>Chi Nhánh: {payment.client.bankBranch ? payment.client.bankBranch : 'N/A'}</li>
                  <li>Tài khoản: {payment.client.bankAccount ? payment.client.bankAccount : 'N/A'}</li>
                  <li>Số Tài khoản: {payment.client.bankNumber ? payment.client.bankNumber : 'N/A'}</li>
                </ul>
              </Col>
            </Row>
          : ''}

          <Table
            bordered
            rowKey={record => record._id}
            dataSource={payment.orders}
            columns={columns}
            pagination={false}
          />
          <div style={{ textAlign: 'right', marginTop: 20 }}>
            <Button onClick={this.onClickBlack} style={{ marginRight: 10 }}> Quay Lại</Button>
            <Button onClick={this.onClickCancel} type="danger" style={{ marginRight: 10 }}> Hủy Bảng</Button>
            <Button
              type="primary"
              onClick={this.onClickConfirm}
            > Xác Nhận Thanh Toán
            </Button>
          </div>
          <Modal
            title="Xác nhận"
            visible={showModal}
            onCancel={this.closeShowModal}
            width={550}
            footer={null}
          >
            <FormPaymentMethod
              onDataSaved={this.onPaymentMethodSaved}
              action="donePayment"
              data={paymentMethodData}
            />
          </Modal>
        </div>
      </PageHeaderLayout>
    );
  }
}
export default PaymentInfo;
