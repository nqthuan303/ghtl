import React, { Component } from 'react';
import { Input, Button, Select, Tag, notification } from 'antd';
import OrderCard from '../../components/Refund/OrderCard';
import SelectOrderList from '../../components/Refund/SelectOrderList';
import request from '../../utils/request';
import style from './AddRefund.less';

const { Search } = Input;
const { Option } = Select;
const { CheckableTag } = Tag;

let orderEachDistrict = {};

class AddRefund extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shippers: [],
      selectedShipper: '',
      selectedTags: [],
      selectList: [],
      stateOrderEachDistrict: [],
    };
  }

  componentDidMount() {
    this.getOrderList();
    this.getShipperList();
  }
  onSaveData() {
    this.setState({ selectList: [] });
    this.getOrderList();
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
  onClickDeleteSelectList(order) {
    const { selectList, stateOrderEachDistrict } = this.state;
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
  getShipperList() {
    request('/user/getShipper').then((result) => {
      if (result) {
        this.setState({
          shippers: result,
        });
      }
    });
  }
  getOrderList() {
    request('/order/order-for-refund').then((result) => {
      if (result && result.data) {
        const orders = result.data;
        orderEachDistrict = {};
        for (let i = 0; i < orders.length; i += 1) {
          const order = orders[i];
          const districId = order.sender.district._id;
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
  handleSelectShipper = (value) => {
    this.setState({
      selectedShipper: value,
    });
  }
  createRefund= () => {
    const { selectedShipper, selectList } = this.state;
    const objOrderId = {};
    const refund = {};
    for (let i = 0; i < selectList.length; i += 1) {
      const order = selectList[i];
      if (!objOrderId[order.orderstatus]) {
        objOrderId[order.orderstatus] = [];
      }
      objOrderId[order.orderstatus].push(order._id);
    }
    if (selectedShipper) {
      refund.user = selectedShipper;
    }
    refund.order = objOrderId;
    const url = '/refund/add';
    const method = 'POST';
    request(url, { method, body: refund }).then((result) => {
      if (result.status === 'success') {
        this.onSaveData();
        notification.success({
          message: 'Thành Công',
          description: 'Bạn đã lưu Chuyến Đi trả thành công.',
        });
      } else {
        notification.error({
          message: 'Xãy ra lỗi',
          description: result.data.msg,
        });
      }
    });
  }
  handleChangeTag(tag, checked) {
    const { selectedTags, selectList } = this.state;
    const staticOrders = JSON.parse(JSON.stringify(orderEachDistrict));
    for (let i = 0; i < selectList.length; i += 1) {
      const districtId = selectList[i].sender.district._id;
      if (staticOrders[districtId]) {
        const arrOrder = staticOrders[districtId];
        for (let k = 0; k < arrOrder.length; k += 1) {
          if (selectList[i]._id === arrOrder[k]._id) {
            arrOrder.splice(k, 1);
            break;
          }
        }
        staticOrders[districtId] = arrOrder;
      }
    }
    if (tag === 'all') {
      let orders = [];
      for (const districtId in staticOrders) {
        if (Object.prototype.hasOwnProperty.call(staticOrders, districtId)) {
          orders = orders.concat(staticOrders[districtId]);
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
        orders = orders.concat(staticOrders[district]);
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
            {orderEachDistrict[districtId][0].sender.district.name}
            ({orderEachDistrict[districtId].length})
          </CheckableTag>
        );
      }
    }
    return result;
  }
  render() {
    const {
      selectList,
      stateOrderEachDistrict } = this.state;
    return (
      <div>
        <div>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select a person"
            optionFilterProp="children"
            onChange={this.handleSelectShipper}
            filterOption={
              (input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {this.renderShippers()}
          </Select>
          <Button style={{ float: 'right' }} type="primary" onClick={this.createRefund}>Tạo</Button>
          <Search
            placeholder="Mã Vận Đơn"
            style={{ width: 200, float: 'right', marginRight: '10px' }}
          />
        </div>
        <div className={style.tagDistrict}>
          {this.renderCheckableTag()}
        </div>
        <div style={{ background: '#ECECEC', padding: '20px', overflow: 'hidden' }}>
          <OrderCard
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
      </div>
    );
  }
}
export default AddRefund;
