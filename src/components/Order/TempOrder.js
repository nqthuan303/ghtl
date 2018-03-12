import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Divider, Modal } from 'antd';

const { confirm } = Modal;

class TempOrder extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClickDelete(id) {
    const { removeOrder } = this.props;
    confirm({
      title: 'Xác nhận xóa!',
      content: 'Bạn có chắc chắn muốn xóa đơn hàng này???',
      okText: 'Xác nhận',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        removeOrder(id);
      },
    });
  }

  render() {
    const { data } = this.props;

    const columns = [
      {
        title: 'Mã',
        width: '6%',
        dataIndex: 'id',
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'createdAt',

      },
      {
        title: 'Shop',
        render: (text, record) => {
          return record.client ? record.client.name : '';
        },
      },
      {
        title: 'Địa chỉ nhận',
        render: (text, record) => {
          return record.receiver ? record.receiver.address : '';
        },
      },
      {
        title: 'Số ĐT',
        render: () => {
          return '';
        },
      },
      {
        title: 'Trạng thái',
        dataIndex: 'orderstatus',

      },
      {
        title: 'Hoạt động',
        render: (text, record) => (
          <div>
            <a onClick={() => this.onClickDelete(record._id)}>Xóa</a>
            <Divider type="vertical" />
            <a>Sửa</a>
          </div>
        ),
      },
    ];

    return (
      <Table
        rowKey={record => record._id}
        dataSource={data}
        columns={columns}
        pagination={{ showSizeChanger: true }}
      />
    );
  }
}

export default TempOrder;
