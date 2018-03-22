import React, { Component } from 'react';
import { Table, Icon } from 'antd';
import moment from 'moment';
import request from '../../utils/request';
import { delivery as deliveryStatus } from '../../constants/status';

class DeliveryComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listDelivery: [],
    };
  }
  componentDidMount() {
    this.getDelivery();
  }

  async getDelivery() {
    const data = await request('/delivery/list');
    if (data && data.data) {
      const deliverys = data.data;
      const listDelivery = [];
      for (let i = 0; i < deliverys.length; i += 1) {
        const delivery = deliverys[i];
        if (delivery.status === deliveryStatus.COMPLETED) {
          delivery.key = i;
          listDelivery.push(delivery);
        }
      }
      this.setState({ listDelivery });
    }
  }
  expandedRowRender = (record) => {
    const columns = [
      { title: 'Id', dataIndex: 'id', key: 'id' },
      { title: 'Địa Chỉ', dataIndex: 'address', key: 'address' },
      { title: 'Quận', dataIndex: 'district', key: 'district' },
    ];

    const data = [];
    for (let i = 0; i < record.orders.length; i += 1) {
      const order = record.orders[i];
      data.push({
        key: i,
        id: order.id,
        address: order.receiver.address,
        district: order.receiver.district.name,
      });
    }
    return (
      <Table
        showHeader={false}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    );
  };
  render() {
    const { listDelivery } = this.state;
    const columns = [{
      title: 'Chuyến Giao',
      key: 'id',
      render: record => (
        <div>
          {record.id}
        </div>
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
      dataIndex: 'collectedMoney',
      key: 'collectedMoney',
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
          expandedRowRender={this.expandedRowRender}
        />
      </div>
    );
  }
}

export default DeliveryComplete;
