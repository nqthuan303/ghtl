import React, { Component } from 'react';
import { Table, Icon, Modal } from 'antd';
import moment from 'moment';
import request from '../../utils/request';
import DeliveryInfo from './DeliveryInfo';
import { delivery as deliveryStatus } from '../../constants/status';

class DeliveryComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listDelivery: [],
      showModal: false,
      delivery: {},
    };
  }
  componentDidMount() {
    this.getDelivery();
  }
  onClickInfo(delivery) {
    this.setState({
      showModal: true,
      delivery,
    });
  }
  async getDelivery() {
    const data = await request('/delivery/list');
    if (data && data.data) {
      const deliverys = data.data;
      const listDelivery = [];
      for (let i = 0; i < deliverys.length; i += 1) {
        const delivery = deliverys[i];
        if (delivery.status === deliveryStatus.COMPLETED ||
          delivery.status === deliveryStatus.DONE) {
          delivery.key = i;
          listDelivery.push(delivery);
        }
      }
      this.setState({ listDelivery });
    }
  }
  closeShowModal = () => {
    this.setState({
      showModal: false,
    });
  }
  render() {
    const { listDelivery } = this.state;
    const columns = [{
      title: 'Chuyến Giao',
      key: 'id',
      render: record => (
        <a onClick={() => this.onClickInfo(record)}>
          {record.id}
        </a>
      ),
    }, {
      title: 'Kết Thúc',
      key: 'endTime',
      render: record => (
        <div>
          {moment(record.endTime).format('DD-MM HH:mm')}
        </div>
      ),
    }, {
      title: 'Nhân Viên Giao',
      key: 'name',
      render: record => (
        <div>
          {record.user.name}
        </div>
      ),
    }, {
      title: 'Số Đơn',
      key: 'countOrders',
      render: record => (
        <div>
          {record.orders.length}
        </div>
      ),
    }, {
      title: 'Tổng Thu',
      dataIndex: 'money',
      key: 'money',
    }, {
      title: 'Trạng Thái',
      key: 'status',
      render: () => (
        <div>
          Hoàn Thành
        </div>
      ),
    }, {
      title: 'In',
      key: 'print',
      render: () => (
        <div>
          <Icon style={{ cursor: 'pointer' }} type="printer" />
        </div>
      ),
    }];
    return (
      <div>
        <Table
          dataSource={listDelivery}
          columns={columns}
        />
        <Modal
          title="Thông tin đơn hàng của chuyến đi giao"
          visible={this.state.showModal}
          onCancel={this.closeShowModal}
          width={1000}
          footer={null}
        >
          <DeliveryInfo
            delivery={this.state.delivery}
            closeShowModal={this.closeShowModal}
          />
        </Modal>
      </div>
    );
  }
}

export default DeliveryComplete;
