import React, { Component } from 'react';
import { Table, Icon, notification, Modal } from 'antd';
import { withRouter } from 'react-router';
import Delivery from './Delivery';
import request from '../../utils/request';

class DeliveryUnComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listDelivery: [],
      showModal: false,
      selectDelivery: '',
    };
  }
  componentDidMount() {
    this.getDelivery();
  }
  onClickEditDelivery(delivery) {
    const { history } = this.props;
    history.push(`/delivery/update/${delivery._id}`);
  }
  onSaveData =() => {
    this.getDelivery();
    this.setState({
      showModal: false,
    });
  }
  onClickDeleteDelivery(delivery) {
    request(`/delivery/delete/${delivery._id}`, { method: 'DELETE' }).then((result) => {
      if (result.status === 'success') {
        notification.success({
          message: 'Thành Công',
          description: 'Bạn đã xóa chuyến đi giao',
        });
        this.getDelivery();
      } else {
        notification.error({
          message: 'Xãy ra lỗi',
          description: result.data.msg,
        });
      }
    });
  }
  onClickChangeStatus(record) {
    const { countOrders, name } = record;
    if (countOrders <= 0 || !name || name === '') {
      notification.error({
        message: 'Xãy ra lỗi',
        description: 'Chuyến đi giao cần chọn shiper và đơn hàng!!!!',
      });
      return;
    }
    request(`/delivery/changeStatusDelivery/${record._id}`, { method: 'PUT' }).then((result) => {
      if (result.status === 'success') {
        this.getDelivery();
        notification.success({
          message: 'Thành Công',
          description: 'Bạn đã lưu Chuyến Đi Giao thành công.',
        });
      } else {
        notification.error({
          message: 'Xãy ra lỗi',
          description: result.data.msg,
        });
      }
    });
  }
  onClickChangeDelivery(record) {
    this.setState({
      showModal: true,
      selectDelivery: record._id,
    });
  }
  async getDelivery() {
    const data = await request('/delivery/list');
    if (data && data.data) {
      const deliveries = data.data;
      const listDelivery = [];
      for (let i = 0; i < deliveries.length; i += 1) {
        const delivery = deliveries[i];
        if (delivery.status === 'unCompleted' || delivery.status === 'delivery') {
          const createdAt = new Date(delivery.createdAt);
          const deliveryCreatedAt = `${createdAt.getDate()}/${
            createdAt.getMonth()} ${
            createdAt.getHours()}:${
            createdAt.getMinutes()}`;
          listDelivery.push({
            _id: delivery._id,
            key: i,
            id: delivery.id,
            name: delivery.user ? delivery.user.name : '',
            countOrders: delivery.orders.length,
            createdAt: deliveryCreatedAt,
            status: delivery.status,
          });
        }
      }
      this.setState({ listDelivery });
    }
  }
    closeShowModal =() => {
      this.setState({
        showModal: false,
      });
    }
    render() {
      const { listDelivery, selectDelivery, showModal } = this.state;
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
          record.status === 'unCompleted' ?
            <div style={{ fontSize: '16px' }} >
              <a onClick={() => this.onClickEditDelivery(record)}>
                <Icon type="edit" />
              </a>
              <a style={{ marginLeft: '10px' }} onClick={() => this.onClickDeleteDelivery(record)}>
                <Icon type="delete" />
              </a>
            </div>
            : ''
        ),
      }, {
        title: 'Trạng Thái',
        key: 'status',
        render: record => (
          <div>
            {record.status === 'unCompleted' ?
              <a onClick={() => this.onClickChangeStatus(record)}>
                {record.status}
              </a>
          :
              <a onClick={() => this.onClickChangeDelivery(record)}>
                {record.status}
              </a>
          }
          </div>

        ),
      }, {
        title: 'In',
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
          <Modal
            title="Delivery"
            visible={showModal}
            onCancel={this.closeShowModal}
            width={900}
            footer={null}
          >
            <Delivery
              deliveryId={selectDelivery}
              closeShowModal={this.closeShowModal}
              onSaveData={this.onSaveData}
            />
          </Modal>
        </div>
      );
    }
}

export default withRouter(DeliveryUnComplete);
