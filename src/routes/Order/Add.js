import React from 'react';
import { Card, notification } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import FormOrder from '../../components/Order/FormOrder';
import TempOrder from '../../components/Order/TempOrder';
import request from '../../utils/request';

class AddOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tempOrders: [],
    };
  }

  componentDidMount() {
    this.getTempOrderList();
  }
  onSaveTempOrder = (data) => {
    const { tempOrders, inProcessIds } = this.state;
    tempOrders.unshift(data);
    inProcessIds.unshift(data._id);
    this.setState({
      tempOrders,
      inProcessIds,
    });
  }

  getTempOrderList = async () => {
    const result = await request('/order/list?status=temp');
    const { data } = result;
    const inProcessIds = [];

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      inProcessIds.push(item._id);
    }
    this.setState({
      inProcessIds,
      tempOrders: data,
    });
  }

  saveOrder = async () => {
    const { inProcessIds } = this.state;
    const result = await request('/order/setStatus?status=pending', {
      method: 'POST',
      body: inProcessIds,
    });
    if (result.status === 'success') {
      notification.success({
        message: 'Thành công!',
        description: 'Cập nhật thành công!',
      });
      this.getTempOrderList();
    }
  }

  removeOrder = async (id) => {
    const inProcessIds = [];
    const tempOrders = [];
    for (let i = 0; i < this.state.tempOrders.length; i++) {
      const item = this.state.tempOrders[i];
      if (item._id !== id) {
        tempOrders.push(item);
        inProcessIds.push(item._id);
      }
    }
    this.setState({
      inProcessIds,
      tempOrders,
    });
    await request(`/order/delete/${id}`, { method: 'DELETE' });
  }

  render() {
    const { tempOrders } = this.state;
    return (
      <PageHeaderLayout title="Thêm đơn hàng">
        <Card bordered={false}>
          <FormOrder saveOrder={this.saveOrder} onSave={this.onSaveTempOrder} />
          <TempOrder removeOrder={this.removeOrder} data={tempOrders} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
export default AddOrder;
