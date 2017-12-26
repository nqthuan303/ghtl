import React from 'react';
import { Card, Menu, Table, Divider, Modal, notification, Button } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import globalStyles from '../../index.less';
import request from '../../utils/request';

const { confirm } = Modal;

class OrderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ordersInStatus: [],
      currentMenu: 'all',
    };
  }
  componentDidMount() {
    this.getOrderList();
    this.getOrdersInStatus();
  }
  onClickMenu = ({ key }) => {
    const { currentMenu } = this.state;
    let options = {};
    if (key !== 'all' && currentMenu !== key) {
      options = { orderStatusId: key };
    }
    this.getOrderList(options);
    this.setState({
      currentMenu: key,
    });
  }
  onClickDelete = async (record, index) => {
    confirm({
      title: 'Xác nhận xóa?',
      content: 'Bạn có chắc muốn xóa đơn hàng này?',
      okText: 'Xác nhận',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => this.onConfirmDelete(record._id, index),
      onCancel() {
        // console.log('Cancel');
      },
    });
  }

  onClickAddOrder = () => {
    const { history } = this.props;
    history.push('/order/add');
  }
  async onConfirmDelete(id, index) {
    const result = await request(`/order/delete/${id}`, {
      method: 'DELETE',
    });
    if (result.status === 'success') {
      const { items } = this.state;
      items.splice(index, 1);
      this.setState({
        items,
      });
      notification.success({
        message: 'Thành công',
        description: 'Xóa đơn hàng thành công!',
      });
    } else {
      notification.error({
        message: 'Lỗi',
        description: result.data.msg,
      });
    }
  }
  async getOrdersInStatus() {
    const result = await request('/order/count-order-in-status');
    this.setState({
      ordersInStatus: result,
    });
  }
  async getOrderList(options) {
    const url = this.buildUrl('/order/list', options);
    const result = await request(url);
    if (result.status === 'success') {
      this.setState({ items: result.data });
    }
  }
  buildUrl(url, options) {
    let result = url;
    if (options) {
      for (const key in options) {
        if (url.includes('?')) {
          result += `&${key}=options[key]`;
        } else {
          result += `?${key}=${options[key]}`;
        }
      }
    }
    return result;
  }

  renderMenu() {
    const { ordersInStatus } = this.state;
    return ordersInStatus.map((item) => {
      return (
        <Menu.Item key={item._id}>
          {item.name}
        </Menu.Item>
      );
    });
  }

  render() {
    const { items, currentMenu } = this.state;
    const columns = [
      {
        title: 'Mã',
        width: '6%',
        dataIndex: 'id',
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'createdAt',

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
        title: 'Số ĐT',
        render: (text, record) => {
          return record.receiver ? record.receiver.phoneNumbers[0] : '';
        },
      },
      {
        title: 'Trạng thái',
        render: (text, record) => {
          return record.orderstatus ? record.orderstatus.name : '';
        },
      },
      {
        title: 'Hoạt động',
        render: (text, record, index) => (
          <div>
            <a onClick={() => this.onClickDelete(record, index)}>Xóa</a>
            <Divider type="vertical" />
            <a>Sửa</a>
          </div>
        ),
      },
    ];

    return (
      <PageHeaderLayout title="Danh sách đơn hàng">
        <Card bordered={false}>
          <Button onClick={this.onClickAddOrder}>Thêm đơn hàng</Button>
          <div className={globalStyles.tableList}>
            <Menu
              style={{ marginBottom: 20 }}
              onClick={this.onClickMenu}
              selectedKeys={[currentMenu]}
              mode="horizontal"
            >
              <Menu.Item key="all">
                Tất cả
              </Menu.Item>
              {this.renderMenu()}
            </Menu>
            <Table
              rowKey={record => record._id}
              dataSource={items}
              columns={columns}
              pagination={{ showSizeChanger: true }}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default OrderList;
