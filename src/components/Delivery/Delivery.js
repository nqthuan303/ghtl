import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, notification, Button, Select, Input } from 'antd';
import moment from 'moment';
import request from '../../utils/request';
import { order as objOrderStatus, orderPayBy } from '../../constants/status';

const { TextArea } = Input;
const { Option } = Select;
const listOrderStatus = [];

for (const key in objOrderStatus) {
  if (key === 'STORAGE' || key === 'DELIVERY' ||
    key === 'DELIVERED' || key === 'RETURNFEESTORAGE' || key === 'RETURNSTORAGE') {
    const status = objOrderStatus[key];
    listOrderStatus.push(status);
  }
}
class Delivery extends Component {
    static propTypes = {
      deliveryId: PropTypes.string.isRequired,
      closeShowModal: PropTypes.func.isRequired,
      onSaveDataDelivery: PropTypes.func.isRequired,
    }
    constructor(props) {
      super(props);
      this.state = {
        orders: [],
      };
    }
    componentDidMount() {
      this.getDelivery(this.props.deliveryId);
    }
    componentWillReceiveProps(nextProps) {
      if (this.props.deliveryId !== nextProps.deliveryId) {
        this.getDelivery(nextProps.deliveryId);
      }
    }
    onChangeOrderStatus(value, index) {
      const stateOrders = Object.assign([], this.state.orders);
      stateOrders[index].orderstatus = value;
      this.setState({
        orders: stateOrders,
      });
    }
    onClickChangeDelivered = () => {
      const stateOrders = Object.assign([], this.state.orders);
      for (let i = 0; i < stateOrders.length; i += 1) {
        stateOrders[i].orderstatus = objOrderStatus.DELIVERED.value;
      }
      this.setState({
        orders: stateOrders,
      });
    }
    onClickEndDelivery = async () => {
      const { orders } = this.state;
      const postData = {};
      const deliveryOrder = {};
      let collectedMoney = 0;
      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        if (!deliveryOrder[order.orderstatus]) {
          deliveryOrder[order.orderstatus] = [];
        }
        deliveryOrder[order.orderstatus].push(order._id);
        if (order.orderstatus === objOrderStatus.DELIVERED.value) {
          let money = order.goodMoney + order.shipFee;
          if (order.payBy === orderPayBy.SENDER.value) {
            money = order.goodMoney;
          }
          collectedMoney += money;
        }
      }
      postData.orders = deliveryOrder;
      postData.collectedMoney = collectedMoney;
      const result = await request(`/delivery/delivery-completed/${this.props.deliveryId}`, { method: 'PUT', body: postData });
      if (result.status === 'success') {
        this.props.closeShowModal();
        this.props.onSaveDataDelivery();
        notification.success({
          message: 'Thành Công',
          description: 'Hoàn Thành chuyến đi giao thành công.',
        });
      } else {
        this.props.closeShowModal();
        notification.error({
          message: 'Xãy ra lỗi',
          description: result.data.msg,
        });
      }
    }
    async getDelivery(deliveryId) {
      const result = await request(`/delivery/findOne/${deliveryId}`);
      if (result.status === 'success') {
        this.setState({
          orders: result.data.orders,
        });
      }
    }
    renderOrder() {
      const { orders } = this.state;
      const result = [];
      for (let i = 0; i < orders.length; i += 1) {
        const order = orders[i];
        const { phoneNumbers } = order.receiver;
        let textPhoneNumbers = '';
        if (phoneNumbers) {
          for (let k = 0; k < phoneNumbers.length; k += 1) {
            textPhoneNumbers = `${textPhoneNumbers}    ${phoneNumbers[k]}`;
          }
        }
        let money = order.goodMoney + order.shipFee;
        if (order.payBy === orderPayBy.SENDER.value) {
          money = order.goodMoney;
        }
        result.push({
          key: i,
          _id: order._id,
          count: i + 1,
          id: order.id,
          createAt: moment(order.createdAt).format('DD-MM HH:mm'),
          name: order.receiver.name,
          address: order.receiver.address,
          district: order.receiver.district.name,
          phoneNumbers: textPhoneNumbers,
          orderstatus: order.orderstatus,
          payBy: order.payBy,
          money,
        });
      }
      const columns = [
        {
          title: '#',
          dataIndex: 'count',
          key: 'count',
        }, {
          title: 'Mã Vận Đơn',
          dataIndex: 'id',
          key: 'id',
        }, {
          title: 'Ngày Tạo',
          dataIndex: 'createAt',
          key: 'createAt',
        }, {
          title: 'Người Nhận',
          dataIndex: 'name',
          key: 'name',
        }, {
          title: 'Địa Chỉ',
          dataIndex: 'address',
          key: 'address',
        }, {
          title: 'Quận',
          dataIndex: 'district',
          key: 'district',
        }, {
          title: 'SĐT Người Nhận',
          dataIndex: 'phoneNumbers',
          key: 'phoneNumbers',
        }, {
          title: 'Tiền thu',
          dataIndex: 'money',
          key: 'money',
        }, {
          title:
  <div style={{ textAlign: 'center' }}>
    <div> Trạng Thái </div>
    <br />
    <div> <Button type="primary" onClick={this.onClickChangeDelivered}>Đã Giao</Button> </div>
  </div>,
          key: 'orderstatus',
          render: record => (
            <Select
              style={{ minWidth: '150px' }}
              onChange={value => this.onChangeOrderStatus(value, record.key)}
              value={record.orderstatus}
              showSearch
              placeholder="Chọn trạng thái"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {this.renderOrderStatus()}
            </Select>),
        },
      ];
      return (<Table
        columns={columns}
        dataSource={result}
        expandedRowRender={() => <p style={{ margin: 0 }}>Lý Do: <TextArea rows={2} /></p>}
      />);
    }
    renderOrderStatus = () => {
      const result = [];
      for (let i = 0; i < listOrderStatus.length; i++) {
        const status = listOrderStatus[i];
        result.push(
          <Option key={i} value={status.value}>{status.name}</Option>
        );
      }
      return result;
    }
    render() {
      const { orders } = this.state;
      let disableButton = true;
      const ordersLength = orders.length;
      let count = 0;
      for (let i = 0; i < ordersLength; i += 1) {
        if (orders[i].orderstatus === objOrderStatus.DELIVERY.value) {
          break;
        }
        count += 1;
      }
      if (count === ordersLength) {
        disableButton = false;
      }
      return (
        <div>
          {this.renderOrder()}
          <div style={{ textAlign: 'center' }}>
            <Button
              disabled={disableButton}
              type="primary"
              onClick={() => this.onClickEndDelivery()}
            > Kết Thúc Chuyến Đi
            </Button>
            <Button
              style={{ marginLeft: '20px' }}
              onClick={() => this.props.closeShowModal()}
            > Hủy
            </Button>
          </div>
        </div>
      );
    }
}

export default Delivery;
