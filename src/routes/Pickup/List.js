import React, { Component } from 'react';
import { Menu } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ClientOrderTable from '../../components/Pickup/ClientOrderTable';
import PickupTable from '../../components/Pickup/PickupTable';
import request from '../../utils/request';

class PickupList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      districts: [],
      districtId: 'all',
    };
  }

  componentDidMount() {
    this.getDistrictList();
  }

  onOrderChange = () => {
    this.getDistrictList();
    this.pickupTableRef.getPickUpList();
  }

  onChangeDistrict = (e, { name }) => {
    this.setState({ districtId: name });
  }

  onChangeDistrict = (e) => {
    this.setState({
      districtId: e.key,
    });
  }
  async getDistrictList() {
    const result = await request('/order/count-order-in-district?status=pending');
    if (result.status === 'success') {
      this.setState({
        districts: result.data,
      });
    }
  }
  renderDistrict() {
    const { districts, districtId } = this.state;

    return districts.map((district) => {
      const orderInDistrict = `${district.name} ( ${district.count} )`;
      return (
        <Menu.Item
          key={district._id}
          name={district._id}
          active={districtId === district._id}
          onClick={this.onChangeDistrict}
        >
          {orderInDistrict}
        </Menu.Item>
      );
    });
  }
  render() {
    const { districtId } = this.state;
    return (
      <PageHeaderLayout title="Danh sách shop">
        <div>
          <Menu
            style={{ height: 48 }}
            onClick={this.onChangeDistrict}
            selectedKeys={[districtId]}
            mode="horizontal"
          >
            <Menu.Item key="all">
              All
            </Menu.Item>
            {this.renderDistrict()}
          </Menu>
          <ClientOrderTable
            ref={(instance) => { this.clientOrderTableRef = instance; }}
            onOrderChange={this.onOrderChange}
            districtId={districtId}
          />
          <PickupTable
            wrappedComponentRef={(instance) => { this.pickupTableRef = instance; }}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}

export default PickupList;
