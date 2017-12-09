import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Icon } from 'antd';

export default class SelectOrderList extends Component {
    static propTypes = {
      data: PropTypes.array.isRequired,
      onClickDeleteOrder: PropTypes.func.isRequired,
    }
    constructor(props) {
      super(props);
      this.state = {
      };
    }


    onClickDelete(order) {
      this.props.onClickDeleteOrder(order);
    }
    renderOrder() {
      const { data } = this.props;
      const result = [];
      for (let i = 0; i < data.length; i += 1) {
        const order = data[i];
        const createdAt = new Date(order.createdAt);
        const orderCreatedAt = `${createdAt.getDate()}/${
          createdAt.getMonth()} ${
          createdAt.getHours()}:${
          createdAt.getMinutes()}`;
        result.push({
          key: i,
          _id: order._id,
          count: i + 1,
          id: order.id,
          createAt: orderCreatedAt,
          name: order.reciever.name,
          address: order.reciever.address,
          district: order.reciever.district.name,
          order,
        });
      }
      const columns = [{
        title: '#',
        dataIndex: 'count',
        key: 'count',
      }, {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
      }, {
        title: 'Ngày Tạo',
        dataIndex: 'createAt',
        key: 'createAt',
      }, {
        title: 'Tên Người Nhận',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: 'Địa Chỉ',
        dataIndex: 'address',
        key: 'address',
      }, {
        title: 'Tiền Thu',
        key: 'money',
      }, {
        title: 'Quận',
        dataIndex: 'district',
        key: 'district',
      }, {
        title: 'Xóa',
        key: 'delete',
        render: (text, record) =>
          (<Icon
            style={{ fontSize: '20px', cursor: 'pointer', color: 'red' }}
            onClick={() => this.onClickDelete(record.order)}
            type="close"
          />),
      }];

      return <Table columns={columns} dataSource={result} />;
    }
    render() {
      return (
        <div style={{ backgroundColor: 'white' }}>
          {this.renderOrder()}
        </div>

      );
    }
}
