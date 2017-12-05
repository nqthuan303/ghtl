import React, { Component } from 'react';
import { Table } from 'antd';
// import EachDelivery from './EachDelivery';
import request from '../../utils/request';

class DeliveryUnComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listDelivery: [],
    //   showModal: false,
    //   delivery: {},
    };
  }
  componentDidMount() {
    this.getDelivery();
  }
  //   onClickEditDelivery(delivery) {
  //     this.setState({
  //       delivery,
  //       showModal: true,
  //     });
  //   }
  async getDelivery() {
    const data = await request('/delivery/list');
    if (data && data.data) {
      const deliverys = data.data;
      const listDelivery = [];
      for (let i = 0; i < deliverys.length; i += 1) {
        const delivery = deliverys[i];
        if (delivery.status === 'unCompleted') {
          const createdAt = new Date(delivery.createdAt);
          const deliveryCreatedAt = `${createdAt.getDate()}/${
            createdAt.getMonth()} ${
            createdAt.getHours()}:${
            createdAt.getMinutes()}`;
          listDelivery.push({
            id: delivery.id,
            name: delivery.user.name,
            countOrders: delivery.orders.length,
            createdAt: deliveryCreatedAt,
          });
        }
      }
      this.setState({ listDelivery });
    }
  }
  //   closeShowModal =() => {
  //     this.setState({
  //       showModal: false,
  //     });
  //   }
  render() {
    const { listDelivery } = this.state;
    const columns = [{
      title: 'Chuyến Giao',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: 'Bắt Đầu',
      dataIndex: 'createdAt',
      key: 'createdAt',
    }, {
      title: 'Nhân Viên Giao',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: 'Số Đơn',
      dataIndex: 'countOrders',
      key: 'countOrders',
    }, {
      title: 'Tổng Thu',
      key: 'monney',
    }, {
      title: 'Chỉnh Sửa',
      key: 'edit',
    }, {
      title: 'Trạng Thái',
      key: 'address',
      render: (text, record) => (
        <span onClick={() => this.onClickEditDelivery(record)}>
          Chưa Kết Thúc
        </span>
      ),
    }, {
      title: '',
      key: 'print',
      render: () => (
        <span >
          Chưa Kết Thúc
        </span>
      ),
    }];
    return (
      <div>
        <Table dataSource={listDelivery} columns={columns} />
        {/* <Modal
          size="large"
          open={showModal}
          onClose={this.closeShowModal}
        >
          <Modal.Header>Chuyến Đi Giao  {delivery.id}</Modal.Header>
          <Modal.Content>
            <EachDelivery
              delivery={delivery}
              closeShowModal={this.closeShowModal}
    onClickDeleteOrder={(deliveryId, orderId) => this.onClickDeleteOrder(deliveryId, orderId)}
            />
          </Modal.Content>
        </Modal> */}
      </div>
    );
  }
}

export default DeliveryUnComplete;
