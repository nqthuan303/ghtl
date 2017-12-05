import React, { Component } from 'react';
// import { withRouter } from 'react-router';
import { Tabs, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DeliveryUnComplete from '../../components/Delivery/DeliveryUnComplete';

const { TabPane } = Tabs;

// import DeliveryComplete from './DeliveryComplete';

// const panes = [
//   { menuItem: 'Chưa kết thúc', render: () => <Tab.Pane><DeliveryUnComplete /></Tab.Pane> },
//   { menuItem: 'Đã kết thúc', render: () => <Tab.Pane><DeliveryComplete /></Tab.Pane> },
// ];

// const AddDelivery = withRouter(({ history }) => (
//   <Button
//     onClick={() => { history.push('/delivery/add'); }}
//     floated="left"
//     icon
//     labelPosition="left"
//     size="small"
//   >
//     <Icon name="add" /> Tạo chuyến đi giao
//   </Button>
// ));

// const AutoAddDelivery = withRouter(({ history }) => (
//   <Button
//     onClick={() => { history.push('/delivery/add'); }}
//     floated="left"
//     icon
//     labelPosition="left"
//     size="small"
//   >
//     <Icon name="add" /> Tạo tự động
//   </Button>
// ));

class DeliveryList extends Component {
  componentDidMount() {
  }

  onClickAddOrder = () => {
  }

  render() {
    return (
      <PageHeaderLayout title="Danh sách ">
        <Card bordered={false}>
          <Tabs type="card">
            <TabPane tab="Chưa Kết Thúc" key="1">
              <DeliveryUnComplete />
            </TabPane>
            <TabPane tab="Kết Thúc" key="2">
              {/* <DeliveryComplete /> */}
            </TabPane>
          </Tabs>
          {/* <AddDelivery />
          <AutoAddDelivery /> */}
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default DeliveryList;
