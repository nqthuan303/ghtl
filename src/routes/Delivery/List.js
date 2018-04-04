import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Tabs, Button } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DeliveryUnComplete from '../../components/Delivery/DeliveryUnComplete';
import DeliveryComplete from '../../components/Delivery/DeliveryComplete';

const { TabPane } = Tabs;

const AddDelivery = withRouter(({ history }) => (
  <Button
    onClick={() => { history.push('/delivery/add'); }}
    icon="plus"
  >
    Tạo chuyến đi giao
  </Button>
));

class List extends Component {
  onSaveData = () => {
    if (this.deliveryComplete) {
      this.deliveryComplete.getDelivery();
    }
  }
  render() {
    return (
      <PageHeaderLayout title="Danh sách ">
        <div style={{ marginBottom: '20px', display: 'inline-block', width: '100%' }}>
          <AddDelivery />
        </div>
        <Tabs type="card">
          <TabPane tab="Chưa Kết Thúc" key="1">
            <DeliveryUnComplete
              onSaveData={this.onSaveData}
            />
          </TabPane>
          <TabPane tab="Kết Thúc" key="2">
            <DeliveryComplete
              ref={(instance) => { this.deliveryComplete = instance; }}
            />
          </TabPane>
        </Tabs>
      </PageHeaderLayout>
    );
  }
}

export default List;
