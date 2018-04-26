import React from 'react';
import {
  Table,
  Button,
  Modal,
  // notification
} from 'antd';
// import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import FormEmployee from '../../components/Employee/FormEmployee';
// import { delivery as deliveryStatus } from '../../constants/status';
import request from '../../utils/request';

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clients: [],
      showModal: false,
    };
  }

  componentDidMount() {
    this.getList();
  }
  onClickPayment(paymentId) {
    const { history } = this.props;
    history.push(`/payment/pay/${paymentId}`);
  }
  onClickAddPayment(clientId) {
    const { history } = this.props;
    history.push(`/payment/add/${clientId}`);
  }
  onClickAddUser = () => {
    this.setState({ showModal: true });
  }
  async getList() {
    const data = await request('/client/client-for-payment');
    if (data && data.data) {
      this.setState({ clients: data.data });
    }
  }
  closeShowModal = () => {
    this.setState({ showModal: false });
  }
  render() {
    const { clients, showModal } = this.state;
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
      render: record => (
        record.payment ?
          <a onClick={() => this.onClickPayment(record.payment._id)}>{record.payment.id}</a>
          : ''
      ),
    }];
    return (
      <PageHeaderLayout title="Danh sách nhân viên">
        <div>
          <Button type="primary" onClick={this.onClickAddUser}> Tạo mới</Button>
        </div>
        <br />
        <div>
          <Table
            bordered
            dataSource={clients}
            rowKey={record => record._id}
            columns={columns}
          />
        </div>
        <Modal
          title="Thêm nhân viên"
          visible={showModal}
          onCancel={this.closeShowModal}
          width={450}
          footer={null}
        >
          <FormEmployee
            closeShowModal={this.closeShowModal}
            onDataSaved={this.onDataSaved}
          />
        </Modal>
      </PageHeaderLayout>
    );
  }
}
export default List;
