import React from 'react';
import { Table, Modal, notification } from 'antd';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { delivery as deliveryStatus } from '../../constants/status';
import request from '../../utils/request';

const confirmModal = Modal.confirm;
class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listDelivery: [],
    };
  }

  componentDidMount() {
    this.getDelivery();
  }
  onClickReceiveMoney(delivery) {
    const _this = this;
    confirmModal({
      title: 'Bạn có xác nhận thu tiền không?',
      content: (
        <div>
          <div>Mã Chuyến đi: {delivery.id}</div>
          <div>Tổng Tiền: {delivery.money}</div>
        </div>
      ),
      onOk() {
        _this.deliveryDone(delivery);
      },
    });
  }

  async getDelivery() {
    const data = await request('/delivery/list');
    if (data && data.data) {
      const deliveries = data.data;
      const listDelivery = [];
      for (let i = 0; i < deliveries.length; i += 1) {
        const delivery = deliveries[i];
        if (delivery.status === deliveryStatus.DONE) {
          listDelivery.push({ ...delivery, key: i });
        }
      }
      this.setState({ listDelivery });
    }
  }
  async deliveryDone(delivery) {
    const result = await request(`/delivery/delivery-done/${delivery._id}`, { method: 'PUT' });
    if (result.status === 'success') {
      notification.success({
        message: 'Thành Công',
        description: 'Đã Thu tiền thành công',
      });
      this.getDelivery();
    } else {
      notification.error({
        message: 'Xãy ra lỗi',
        description: result.data.msg,
      });
    }
  }
  render() {
    const { listDelivery } = this.state;
    const columns = [{
      title: 'Chuyến Giao',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Ngày Thu',
      key: 'date',
      render: record => moment(record.endTime).format('DD-MM HH:mm'),
    },
    {
      title: 'Người Thu',
      key: 'ddddd',
    },
    {
      title: 'Bưu Tá',
      key: 'user',
      render: record => (
        <div>
          {record.user.name} - {record.user.phone_number}
        </div>
      ),
    }, {
      title: 'Tổng Thu',
      dataIndex: 'money',
      key: 'money',
    }];
    return (
      <PageHeaderLayout title="Lịch Sử">
        <div>
          <Table dataSource={listDelivery} columns={columns} />
        </div>
      </PageHeaderLayout>
    );
  }
}
export default History;
