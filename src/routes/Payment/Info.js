import React from 'react';
import {
  Table,
  Row,
  Col,
  Button,
  Modal,
  notification,
  Form,
  Select,
  Input,
} from 'antd';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { order as orderStatus, orderPayBy, payment as paymentStatus } from '../../constants/status';
import request from '../../utils/request';

const { confirm } = Modal;
const { Option } = Select;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 6 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 14, offset: 6 },
  },
};

class PaymentInfo extends React.Component {
  constructor(props) {
    super(props);
    this.paymentId = this.props.match.params.id;
    this.state = {
      payment: {},
      showModal: false,
      bank: '',
      bill: '',
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
  onChangeBank = (bank) => {
    this.setState({ bank });
  }
  onChangeBill = (e) => {
    this.setState({ bill: e.target.value });
  }
  onConfirmComplete = async () => {
    const { bank, bill, totalMoneyNeedToBePaid } = this.state;
    const result = await request(`/payment/payment-done/${this.paymentId}?money=${totalMoneyNeedToBePaid}&bank=${bank}&bill=${bill}`, { method: 'PUT' });
    if (result.status === 'success') {
      notification.success({
        message: 'Thành Công',
        description: result.data,
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
  async getPayment() {
    const data = await request(`/payment/findOne/${this.paymentId}`);
    if (data && data.data) {
      const payment = data.data;
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
    const { payment, showModal, totalMoneyNeedToBePaid, bank } = this.state;
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
            <Form >
              <FormItem {...formItemLayout} label="Tổng tiền" >
                {totalMoneyNeedToBePaid}
              </FormItem>
              <FormItem {...formItemLayout} label="Mã giao dịch" >
                <Input onChange={this.onChangeBill} />
              </FormItem>
              <FormItem {...formItemLayout} label="Ngân hàng" >
                <Select
                  showSearch
                  placeholder="Chọn ngân hàng"
                  optionFilterProp="children"
                  filterOption={this.filterOption}
                  onChange={this.onChangeBank}
                  value={bank}
                >
                  <Option key="Techcombank" value="Techcombank">Techcombank - Ngân hàng TMCP Kỹ thương Việt Nam</Option>
                  <Option key="VPBank" value="VpBank">VPBank - Ngân hàng VN Thịnh Vượng</Option>
                </Select>
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" onClick={this.onConfirmComplete}>Xác Nhận</Button>
                <Button
                  onClick={this.closeShowModal}
                  style={{ marginLeft: 8 }}
                >
                  Hủy
                </Button>
              </FormItem>
            </Form>
          </Modal>
        </div>
      </PageHeaderLayout>
    );
  }
}
export default PaymentInfo;
