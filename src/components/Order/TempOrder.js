import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Table, Divider, Modal } from 'antd';
import { convertDateTime } from '../../utils/utils';

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
  onClickEdit(orderId) {
    const { history } = this.props;
    history.push(`/order/save/${orderId}`);
  }

  renderCreatedAt = (record) => {
    return convertDateTime(record.createdAt);
  }

  render() {
    const { data } = this.props;

    const columns = [
      {
        title: 'Mã',
        width: '70px',
        dataIndex: 'id',
      },
      {
        title: 'Ngày tạo',
        render: this.renderCreatedAt,
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
        title: 'Trạng thái',
        dataIndex: 'orderstatus',

      },
      {
        title: 'Hoạt động',
        render: (text, record) => (
          <div>
            <a onClick={() => this.onClickDelete(record._id)}>Xóa</a>
            <Divider type="vertical" />
            <a onClick={() => this.onClickEdit(record._id)}>Sửa</a>
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

export default withRouter(TempOrder);
