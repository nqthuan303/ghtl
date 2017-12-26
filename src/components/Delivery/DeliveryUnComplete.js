import React, { Component } from 'react';
import { Table, Icon } from 'antd';
import { withRouter } from 'react-router';
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
  onClickEditDelivery(delivery) {
    const { history } = this.props;
    history.push(`/delivery/update/${delivery._id}`);
  }
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
            _id: delivery._id,
            key: i,
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
      render: (text, record) => (
        <a
          onClick={() => this.onClickEditDelivery(record)}
          // href={`delivery/update/${record._id}`}
        >
          <Icon type="edit" />
        </a>
      ),
    }, {
      title: 'Trạng Thái',
      key: 'status',
      render: () => (
        <span>
          Chưa Kết Thúc
        </span>
      ),
    }, {
      title: 'Print',
      key: 'print',
      render: () => (
        <span >
          <Icon type="printer" />
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

export default withRouter(DeliveryUnComplete);
