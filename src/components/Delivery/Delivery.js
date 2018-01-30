import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, notification, Button, Select } from 'antd';
import moment from 'moment';
import request from '../../utils/request';
import orderStatusConstants from '../../constants/orderStatus';

const { Option } = Select;

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
        listOrderStatus: [],
      };
    }


    componentDidMount() {
      this.getDelivery(this.props.deliveryId);
      this.getOrderStatus();
    }
    componentWillReceiveProps(nextProps) {
      if (this.props.deliveryId !== nextProps.deliveryId) {
        this.getDelivery(nextProps.deliveryId);
      }
    }
    onClickSave() {
      const { orders } = this.state;
      const postData = {};
      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        if (!postData[order.orderstatus]) {
          postData[order.orderstatus] = [];
        }
        postData[order.orderstatus].push(order._id);
      }
      request('/order/changeMulti', { method: 'PUT', body: postData }).then((result) => {
        if (result.status === 'success') {
          this.props.closeShowModal();
          this.props.onSaveDataDelivery();
          notification.success({
            message: 'Thành Công',
            description: 'Bạn đã cập nhật chuyến đi giao thành công.',
          });
        } else {
          this.props.closeShowModal();
          notification.error({
            message: 'Xãy ra lỗi',
            description: result.data.msg,
          });
        }
      });
    }
    onChangeOrderStatus(value, index) {
      const stateOrders = Object.assign([], this.state.orders);
      stateOrders[index].orderstatus = value;
      this.setState({
        orders: stateOrders,
      });
    }
    onClickChangeStatusDone = () => {
      const { listOrderStatus } = this.state;
      const stateOrders = Object.assign([], this.state.orders);
      let statusDelivery = '';
      for (let i = 0; i < listOrderStatus.length; i += 1) {
        const orderStatus = listOrderStatus[i];
        if (orderStatus.name === orderStatusConstants.DONE) {
          statusDelivery = orderStatus.value;
        }
      }
      if (!statusDelivery || statusDelivery === '') {
        return;
      }
      for (let i = 0; i < stateOrders.length; i += 1) {
        stateOrders[i].orderstatus = statusDelivery;
      }
      this.setState({
        orders: stateOrders,
      });
    }
    onClickEndDelivery = async () => {
      const { orders } = this.state;
      const postData = {};
      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        if (!postData[order.orderstatus]) {
          postData[order.orderstatus] = [];
        }
        postData[order.orderstatus].push(order._id);
      }
      const result = await request(`/delivery/completeDelivery/${this.props.deliveryId}`, { method: 'PUT', body: postData });
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
    async getOrderStatus() {
      const result = await request('/orderStatus/listForSelect');
      if (result && result.length > 0) {
        this.setState({
          listOrderStatus: result,
        });
      }
    }
    renderOrder() {
      const { orders } = this.state;
      const result = [];
      for (let i = 0; i < orders.length; i += 1) {
        const order = orders[i];
        const { phoneNumbers } = order.receiver;
        let textPhoneNUmbers = '';
        for (let k = 0; k < phoneNumbers.length; k += 1) {
          textPhoneNUmbers = `${textPhoneNUmbers}    ${phoneNumbers[k]}`;
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
          phoneNumbers: textPhoneNUmbers,
          orderStatus: order.orderstatus,
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
        },
        {
          title: 'SĐT Người Nhận',
          dataIndex: 'phoneNumbers',
          key: 'phoneNumbers',
        },
        {
          title:
  <div style={{ textAlign: 'center' }}>
    <div> Trạng Thái </div>
    <br />
    <div> <Button type="primary" onClick={this.onClickChangeStatusDone}>Đã Giao</Button> </div>
  </div>,
          key: 'orderStatus',
          render: record => (
            <Select
              style={{ minWidth: '150px' }}
              onChange={value => this.onChangeOrderStatus(value, record.key)}
              value={record.orderStatus}
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
      return <Table columns={columns} dataSource={result} />;
    }
    renderOrderStatus = () => {
      const { listOrderStatus } = this.state;
      const result = [];
      for (let i = 0; i < listOrderStatus.length; i += 1) {
        const status = listOrderStatus[i];
        result.push(
          <Option key={i} value={status.value}>{status.text}</Option>
        );
      }
      return result;
    }
    render() {
      return (
        <div>
          {this.renderOrder()}
          <div style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              onClick={() => this.onClickSave()}
            > Xác Nhận
            </Button>
            <Button
              style={{ marginLeft: '20px' }}
              onClick={() => this.props.closeShowModal()}
            > Hủy
            </Button>
            <Button
              style={{ float: 'right' }}
              type="primary"
              onClick={() => this.onClickEndDelivery()}
            > Kết Thúc Chuyến Đi
            </Button>
          </div>
        </div>
      );
    }
}

export default Delivery;
