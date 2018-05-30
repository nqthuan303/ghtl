import React from 'react';
import {
  Menu, Table,
  Divider, Modal,
  notification, Button,
} from 'antd';

import queryString from 'query-string';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import globalStyles from '../../index.less';
import request from '../../utils/request';
import { convertDateTime, generateQueryString } from '../../utils/utils';
import styles from './styles.less';
import { orderPayBy, order as orderStatus } from '../../constants/status';
import SearchOrder from '../../components/Order/SearchOrder';
import OrderDetail from '../../components/Order/OrderDetail';
import FormOrder from '../../components/Order/FormOrder';

const { confirm } = Modal;

class OrderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ordersInStatus: [],
      objSearch: {},
      orderDetailModal: false,
      orderFormModal: false,
      orderId: '',
      orderShortId: '',
    };
    this.selectedOrder = '';
    this.selectedIndex = '';
  }
  componentDidMount() {
    const { location: { search } } = this.props;
    const objSearch = queryString.parse(search);
    if (Object.keys(objSearch).length === 0) {
      objSearch.orderstatus = 'all';
    }
    this.setState({ objSearch });
    this.getOrderList(objSearch);
    this.getOrdersInStatus(objSearch);
  }
  componentWillReceiveProps(nextProps) {
    const { location: { search: nextSearch } } = nextProps;
    const { location: { search } } = this.props;
    if (search !== nextSearch) {
      const objSearch = queryString.parse(nextSearch);
      this.getOrderList(objSearch);
      this.getOrdersInStatus(objSearch);
      this.setState({ objSearch });
    }
  }
  onClickMenu = ({ key }) => {
    const { objSearch } = this.state;
    objSearch.orderstatus = key;
    const queryStr = generateQueryString(objSearch);
    this.props.history.push({
      pathname: '/order/list',
      search: queryStr,
    });
    this.setState({ objSearch });
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
    history.push('/order/save');
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
  onClickCancel(orderId) {
    this.selectedOrder = orderId;
    confirm({
      title: 'Hủy đơn hàng',
      content: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
      onOk: this.onConfirmCancelOrder,
    });
  }
  onConfirmCancelOrder = async () => {
    const { objSearch } = this.state;
    const url = '/order/cancel';
    const result = await request(url, {
      body: { orderId: this.selectedOrder },
      method: 'POST',
    });
    if (result.status === 'success') {
      this.getOrderList(objSearch);
      this.getOrdersInStatus(objSearch);
    }
  }
  onClickId() {
    this.setState({
      orderDetailModal: true,
    });
  }
  onClickEditOrder(record, index) {
    this.selectedIndex = index;
    this.setState({
      orderFormModal: true,
      orderId: record._id,
      orderShortId: record.id,
    });
  }
  onOrderSaved = (data) => {
    console.log(data);
    const { items } = this.state;
    items[this.selectedIndex] = data;
    this.setState({
      items,
      orderFormModal: false,
    });
  }
  async getOrdersInStatus(options) {
    const url = this.buildUrl('/order/count-order-in-status', options);
    const result = await request(url);
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
        if (result.includes('?')) {
          result += `&${key}=${options[key]}`;
        } else {
          result += `?${key}=${options[key]}`;
        }
      }
    }
    return result;
  }

  handleCancel = () => {
    this.setState({
      orderDetailModal: false,
    });
  }

  closeOrderForm = () => {
    this.setState({
      orderFormModal: false,
    });
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
        <a onClick={() => this.onClickId(record)} className={styles.orderId}>{record.id}</a>
        <p className={styles.createdAt}>({dateTime})</p>
      </div>
    );
  }
  renderSender = ({ client }) => {
    return (
      <div>
        <p>{client.name}</p>
        <p>{client.phone}</p>
      </div>
    );
  }

  renderReceiver = ({ receiver }) => {
    return (
      <div>
        <p>{receiver.name}</p>
        <p>{receiver.phone}</p>
      </div>
    );
  }

  renderReceiverAddress = ({ receiver }) => {
    const { district, ward } = receiver;
    return `${receiver.address}, ${ward.type} ${ward.name}, ${district.type} ${district.name}`;
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

  renderAction = (text, record, index) => {
    const { orderstatus } = record;
    let result = '-';
    const { TEMP, PENDING, PICKUP, STORAGE, DELIVERYPREPARE, DELIVERY } = orderStatus;
    if (orderstatus === TEMP.value) {
      result = (
        <div>
          <a onClick={() => this.onClickDelete(record, index)}>Xóa</a>
          <Divider type="vertical" />
          <a onClick={() => this.onClickEditOrder(record, index)}>Sửa</a>
          <Divider type="vertical" />
          <a>Duyệt</a>
        </div>
      );
    }
    if (
      orderstatus === PENDING.value ||
      orderstatus === PICKUP.value ||
      orderstatus === STORAGE.value ||
      orderstatus === DELIVERYPREPARE.value
    ) {
      result = (
        <div>
          <a onClick={() => this.onClickCancel(record._id)}>Hủy</a>
          <Divider type="vertical" />
          <a onClick={() => this.onClickEditOrder(record, index)}>Sửa</a>
        </div>
      );
    }
    if (orderstatus === DELIVERY.value) {
      result = <a onClick={() => this.onClickEditOrder(record, index)}>Sửa</a>;
    }
    return (
      <div>
        {result}
      </div>
    );
  }

  render() {
    const {
      items, objSearch,
      orderDetailModal,
      orderFormModal, orderId,
      orderShortId,
    } = this.state;
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
        render: this.renderReceiver,
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
        render: this.renderAction,
      },
    ];
    return (
      <PageHeaderLayout title="Danh sách đơn hàng">
        <Button onClick={this.onClickAddOrder}>Thêm đơn hàng</Button>
        <SearchOrder objSearch={objSearch} />
        <div className={globalStyles.tableList}>
          <Menu
            style={{ marginBottom: 20 }}
            onClick={this.onClickMenu}
            selectedKeys={[objSearch.orderstatus]}
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
          <Modal
            title="Basic Modal"
            visible={orderDetailModal}
            footer={null}
            onCancel={this.handleCancel}
          >
            <OrderDetail />
          </Modal>
          <Modal
            width={800}
            title={`Cập nhật đơn hàng ${orderShortId}`}
            visible={orderFormModal}
            footer={null}
            onCancel={this.closeOrderForm}
          >
            <FormOrder onSave={this.onOrderSaved} orderId={orderId} />
          </Modal>
        </div>
      </PageHeaderLayout>
    );
  }
}

export default OrderList;
