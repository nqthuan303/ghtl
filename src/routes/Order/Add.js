import React from 'react';
import { Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import FormOrder from '../../components/Order/FormOrder';

class AddOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <PageHeaderLayout title="Thêm đơn hàng">
        <Card bordered={false}>
          <FormOrder />
        </Card>
      </PageHeaderLayout>
    );
  }
}
export default AddOrder;
