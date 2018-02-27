import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Tabs, Card, Button } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import RefundUnComplete from '../../components/Refund/RefundUnComplete';
import RefundComplete from '../../components/Refund/RefundComplete';

const { TabPane } = Tabs;

const AddRefund = withRouter(({ history }) => (
  <Button
    onClick={() => { history.push('/refund/add'); }}
    icon="plus"
  >
    Tạo chuyến đi trả
  </Button>
));

class ListRefund extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // onSaveData = () => {
  //   this.refundComplete.getRefund();
  // }
  render() {
    return (
      <PageHeaderLayout title="Danh sách ">
        <Card bordered={false}>
          <div style={{ marginBottom: '20px', display: 'inline-block', width: '100%' }}>
            <AddRefund />
          </div>
          <Tabs type="card">
            <TabPane tab="Chưa Kết Thúc" key="1">
              <RefundUnComplete />
            </TabPane>
            <TabPane tab="Kết Thúc" key="2">
              <RefundComplete />
            </TabPane>
          </Tabs>

        </Card>
      </PageHeaderLayout>
    );
  }
}

export default ListRefund;
