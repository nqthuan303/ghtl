import React from 'react';
import { Menu, Table, Divider, Modal, notification, Button } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import globalStyles from '../../index.less';
import request from '../../utils/request';
import { convertDateTime } from '../../utils/utils';
import styles from './styles.less';
import { orderPayBy } from '../../constants/status';

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
        <Menu.Item key={item.value}>
          {item.name}
        </Menu.Item>
      );
    });
  }

  renderId = (record) => {
    const { createdAt } = record;
    const dateTime = convertDateTime(createdAt);
    return (
      <div className={styles.colOrderId}>
        <a className={styles.orderId}>{record.id}</a>
        <p className={styles.createdAt}>({dateTime})</p>
      </div>
    );
  }

  renderSender = ({ client }) => {
    return client ? client.name : '';
  }

  renderReceiverName = ({ receiver }) => {
    return receiver ? receiver.name : '';
  }

  renderReceiverAddress = ({ receiver }) => {
    return receiver ? receiver.address : '';
  }

  renderTotalMoney = ({ goodsMoney, payBy, shipFee }) => {
    let result = 0;
    if (payBy === orderPayBy.SENDER.value) {
      result = goodsMoney;
    }
    if (payBy === orderPayBy.RECEIVER.value) {
      result = Number(goodsMoney) + Number(shipFee);
    }
    return result;
  }

  render() {
    const { items, currentMenu } = this.state;
    const columns = [
      {
        key: 'id',
        title: 'Mã',
        render: this.renderId,
        width: '120px',
        align: 'center',
      },
      {
        key: 'senderName',
        title: 'Người gửi',
        render: this.renderSender,
      },
      {
        key: 'ReceiverName',
        title: 'Người nhận',
        render: this.renderReceiverName,
      },
      {
        key: 'ReceiverAddress',
        title: 'Đ/c nhận',
        render: this.renderReceiverAddress,
        width: '200px',
      },
      {
        key: 'TotalMoney',
        title: 'Thu khách',
        render: this.renderTotalMoney,
      },
      {
        title: 'Trạng thái',
        dataIndex: 'orderstatus',
        key: 'orderstatus',
      },
      {
        title: '',
        key: 'action',
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
      </PageHeaderLayout>
    );
  }
}

export default OrderList;
