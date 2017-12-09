import React from 'react';
import { Card, Alert, Tabs } from 'antd';
import { withRouter } from 'react-router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import FormShop from '../../components/Shop/FormShop';
import OrderInfo from '../../components/Shop/OrderInfo';
import PriceInfo from '../../components/Shop/PriceInfo';
import request from '../../utils/request';

const { TabPane } = Tabs;


class ShopInfo extends React.Component {
  constructor(props) {
    super(props);
    this.shopId = this.props.match.params.id;
    this.state = {
      notice: {
        type: 'success',
        message: '',
      },
    };
  }
  componentDidMount() {
    this.getClient();
  }

  onDataSaved = (notice, data) => {
    this.setState({ notice, shop: data });
  }

  async getClient() {
    const result = await request(`/client/findOne/${this.shopId}`);
    if (result.status === 'success') {
      this.setState({ shop: result.data });
    }
  }

  render() {
    const { notice, shop } = this.state;
    return (
      <PageHeaderLayout title="Thông tin shop">
        <Card bordered={false}>
          <div>
            {notice.message !== '' ?
              <Alert closable style={{ marginBottom: 10 }} message={notice.message} type={notice.type} /> : ''}
            <div>
              <Tabs>
                <TabPane tab="Thông tin shop" key="1">
                  <FormShop data={shop} onDataSaved={this.onDataSaved} />
                </TabPane>
                <TabPane tab="Đơn hàng" key="2">
                  <OrderInfo />
                </TabPane>
                <TabPane tab="Gói cước" key="3">
                  <PriceInfo />
                </TabPane>
                <TabPane tab="Bảng kê" key="4">
                  <p>Content of Tab Pane 4</p>
                </TabPane>
              </Tabs>
            </div>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
const ShopInfoƯithRouter = withRouter(ShopInfo);
export default ShopInfoƯithRouter;
