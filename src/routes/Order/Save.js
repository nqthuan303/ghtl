import React from 'react';
import { notification } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import FormOrder from '../../components/Order/FormOrder';
import TempOrder from '../../components/Order/TempOrder';
import request from '../../utils/request';

class SaveOrder extends React.Component {
  constructor(props) {
    super(props);
    if (props.match.params.id) {
      this.orderId = props.match.params.id;
    }
    this.state = {
      tempOrders: [],
    };
  }

  componentDidMount() {
    this.getTempOrderList();
  }
  onSaveTempOrder = () => {
    this.getTempOrderList();
  }
  getTempOrderList = async () => {
    const result = await request('/order/list?orderstatus=temp');
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
    const { history } = this.props;
    const result = await request('/order/saveOrder', {
      method: 'POST',
      body: inProcessIds,
    });
    if (result.status === 'success') {
      notification.success({
        message: 'Thành công!',
        description: 'Cập nhật thành công!',
      });
      history.push('/pickup/list');
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
    const showEndButton = tempOrders.length > 0;
    return (
      <PageHeaderLayout title="Thêm đơn hàng">
        <FormOrder
          showEndButton={showEndButton}
          saveOrder={this.saveOrder}
          onSave={this.onSaveTempOrder}
        />
        <TempOrder removeOrder={this.removeOrder} data={tempOrders} />
      </PageHeaderLayout>
    );
  }
}
export default SaveOrder;
