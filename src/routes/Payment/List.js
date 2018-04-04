import React from 'react';
import {
  Table,
  // Button,
  // Modal,
  // notification
} from 'antd';
// import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import { delivery as deliveryStatus } from '../../constants/status';
import request from '../../utils/request';

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listPayment: [],
    };
  }

  componentDidMount() {
    this.getList();
  }
  async getList() {
    const data = await request('/client/client-for-payment');
    if (data && data.data) {
      const deliveries = data.data;

      this.setState({ listPayment: deliveries });
    }
  }
  render() {
    const { listPayment } = this.state;
    const columns = [{
      title: 'Tên Shop',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Địa Chỉ',
      dataIndex: 'address',
      key: 'address',
    }, {
      title: 'Quận',
      dataIndex: 'district',
      key: 'district',
    }, {
      title: 'Chưa thanh toán',
      key: 'money',
      dataIndex: 'money',
    }];
    return (
      <PageHeaderLayout title="Danh Sách">
        <div>
          <Table dataSource={listPayment} columns={columns} />
        </div>
      </PageHeaderLayout>
    );
  }
}
export default List;
