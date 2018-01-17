import React, { Component } from 'react';
import { Input, Button, Select, Tag, Modal, notification } from 'antd';
import StorageOrderCard from '../../components/Delivery/StorageOrderCard';
import SelectOrderList from '../../components/Delivery/SelectOrderList';
import OrderConvertStatus from '../../components/Delivery/OrderConvertStatus';
import request from '../../utils/request';
import style from './AddDelivery.less';

const { Search } = Input;
const { Option } = Select;
const { CheckableTag } = Tag;

let orderEachDistrict = {};
const deliveryOrders = {};
let delivery = {};

class UpdateDelivery extends Component {
  constructor(props) {
    super(props);
    this.deliveryId = this.props.match.params.id;
    this.state = {
      shippers: [],
      selectedShipper: '',
      selectedTags: [],
      selectList: [],
      stateOrderEachDistrict: [],
      showModalConvert: false,
      orderConvert: {},
    };
  }

  componentDidMount() {
    this.getDelivery();
    this.getOrderList();
    this.getShipperList();
  }
  onSaveData = () => {
    // e.preventDefault();
    // this.setState({ selectList: [] });
    // this.getOrderList();
    this.props.history.replace('/delivery/list');
  }
  onClickCard(order) {
    const { selectList, stateOrderEachDistrict } = this.state;
    for (let i = 0; i < stateOrderEachDistrict.length; i += 1) {
      if (order._id === stateOrderEachDistrict[i]._id) {
        stateOrderEachDistrict.splice(i, 1);
        break;
      }
    }
    selectList.push(order);
    this.setState({
      selectList,
      stateOrderEachDistrict,
    });
  }
  onCompleteConvert(order) {
    delete deliveryOrders[order._id];
    let index = -1;
    for (let i = 0; i < delivery.orders.length; i += 1) {
      if (order._id === delivery.orders[i]._id) {
        index = i;
        break;
      }
    }
    delivery.orders.splice(index, 1);
    this.getOrderList();
    request(`/delivery/update/${this.deliveryId}`, { method: 'PUT', body: delivery }).then((result) => {
      if (result.status === 'success') {
        notification.success({
          message: 'Thành Công',
          description: 'Xóa và chuyển trạng thái thành công',
        });
      } else {
        notification.error(
          {
            message: 'Đã xãy ra lỗi',
            description: result.data.msg,
          });
      }
    });
  }
  onClickDeleteSelectList(order) {
    const { selectList, stateOrderEachDistrict } = this.state;
    if (deliveryOrders[order._id] && deliveryOrders[order._id] === 1) {
      this.setState({
        showModalConvert: true,
        orderConvert: order,
      });
    } else {
      for (let i = 0; i < selectList.length; i += 1) {
        if (order._id === selectList[i]._id) {
          selectList.splice(i, 1);
          break;
        }
      }
      stateOrderEachDistrict.push(order);
      this.setState({
        selectList,
        stateOrderEachDistrict,
      });
    }
  }
  onUpdateDelivery = () => {
    const { selectedShipper, selectList } = this.state;
    const arrOrderId = [];
    const objDelivery = {};
    for (let i = 0; i < selectList.length; i += 1) {
      arrOrderId.push(selectList[i]._id);
    }
    if (selectedShipper) {
      objDelivery.user = selectedShipper;
    }
    objDelivery.orders = arrOrderId;
    const url = `/delivery/update/${this.deliveryId}`;
    const method = 'PUT';
    request(url, { method, body: objDelivery }).then((result) => {
      if (result.status === 'success') {
        this.onSaveData();
        notification.success({
          message: 'Thành Công',
          description: 'Bạn đã cập nhật Chuyến Đi Giao thành công.',
        });
      } else {
        notification.error({
          message: 'Xãy ra lỗi',
          description: result.data.msg,
        });
      }
    });
  }
  getShipperList() {
    request('/user/getShipper').then((result) => {
      if (result) {
        this.setState({
          shippers: result,
        });
      }
    });
  }
  async getDelivery() {
    const result = await request(`/delivery/findOne/${this.deliveryId}`);
    if (result.status === 'success') {
      const { orders } = result.data;
      for (let i = 0; i < orders.length; i += 1) {
        const orrder = orders[i];
        deliveryOrders[orrder._id] = 1;
      }
      delivery = result.data;
      this.setState({
        selectList: orders,
        selectedShipper: result.data.user,
      });
    }
  }
  getOrderList() {
    request('/order/order-with-status?status=storage').then((result) => {
      if (result && result.data) {
        const orders = result.data;
        orderEachDistrict = {};
        for (let i = 0; i < orders.length; i += 1) {
          const order = orders[i];
          const districId = order.receiver.district._id;
          if (!orderEachDistrict[districId]) {
            orderEachDistrict[districId] = [];
          }
          orderEachDistrict[districId].push(order);
        }
        this.setState({
          stateOrderEachDistrict: orders,
          selectedTags: ['all'],
        });
      }
    });
  }
  closeModalConvert = () => {
    this.setState({
      showModalConvert: false,
    });
  }
  handleSelectShipper = (value) => {
    this.setState({
      selectedShipper: value,
    });
  }
  handleChangeTag(tag, checked) {
    const { selectedTags } = this.state;
    if (tag === 'all') {
      let orders = [];
      for (const districtId in orderEachDistrict) {
        if (Object.prototype.hasOwnProperty.call(orderEachDistrict, districtId)) {
          orders = orders.concat(orderEachDistrict[districtId]);
        }
      }

      this.setState({
        selectedTags: ['all'],
        stateOrderEachDistrict: orders,
      });
    } else {
      let nextSelectedTags = checked ?
        [...selectedTags, tag] :
        selectedTags.filter(t => t !== tag);
      if (nextSelectedTags[0] === 'all') {
        nextSelectedTags = nextSelectedTags.filter(t => t !== 'all');
      }
      let orders = [];
      for (let i = 0; i < nextSelectedTags.length; i += 1) {
        const district = nextSelectedTags[i];
        orders = orders.concat(orderEachDistrict[district]);
      }
      this.setState({
        selectedTags: nextSelectedTags,
        stateOrderEachDistrict: orders,
      });
    }
  }
  renderShippers() {
    const { shippers } = this.state;
    const result = [];
    for (let i = 0; i < shippers.length; i += 1) {
      result.push(
        <Option key={i} value={shippers[i].value}>{shippers[i].text}</Option>
      );
    }
    return result;
  }
  renderCheckableTag() {
    const { selectedTags } = this.state;
    const result = [];
    result.push(
      <CheckableTag
        key="all"
        checked={selectedTags.indexOf('all') > -1}
        onChange={checked => this.handleChangeTag('all', checked)}
      >
        Tất Cả
      </CheckableTag>
    );
    for (const districtId in orderEachDistrict) {
      if (Object.prototype.hasOwnProperty.call(orderEachDistrict, districtId)) {
        result.push(
          <CheckableTag
            key={districtId}
            checked={selectedTags.indexOf(districtId) > -1}
            onChange={checked => this.handleChangeTag(districtId, checked)}
          >
            {orderEachDistrict[districtId][0].receiver.district.name}
            ({orderEachDistrict[districtId].length})
          </CheckableTag>
        );
      }
    }
    return result;
  }
  render() {
    const {
      // shippers,
      // districts,
      selectedShipper,
      selectList,
      orderConvert,
      showModalConvert,
      stateOrderEachDistrict } = this.state;
    return (
      <div>
        <div>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select a person"
            optionFilterProp="children"
            value={selectedShipper}
            onChange={this.handleSelectShipper}
            filterOption={
              (input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {this.renderShippers()}
          </Select>
          <Button style={{ float: 'right' }} type="primary" onClick={this.onUpdateDelivery}>Cập Nhật</Button>
          <Search
            placeholder="Mã Vận Đơn"
            style={{ width: 200, float: 'right', marginRight: '10px' }}
          />
        </div>
        <div className={style.tagDistrict}>
          {this.renderCheckableTag()}
        </div>
        <div style={{ background: '#ECECEC', padding: '20px', overflow: 'hidden' }}>
          <StorageOrderCard
            onClickCardOrder={order => this.onClickCard(order)}
            orderEachDistrict={stateOrderEachDistrict}
          />
        </div>
        <div style={{ background: '#ECECEC', padding: '20px', overflow: 'hidden' }}>
          <SelectOrderList
            data={selectList}
            onClickDeleteOrder={order => this.onClickDeleteSelectList(order)}
          />
        </div>
        <Modal
          title="Chuyển Trạng Thái Đơn Hàng"
          visible={showModalConvert}
          onCancel={this.closeModalConvert}
          footer={null}
          width={500}
        >
          <OrderConvertStatus
            orderConvert={orderConvert}
            closeShowModal={this.closeModalConvert}
            onSaveData={order => this.onCompleteConvert(order)}
          />
        </Modal>
      </div>
    );
  }
}
export default UpdateDelivery;
