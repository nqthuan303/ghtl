import React, { Component } from 'react';
import { Input, Button, Select, Tag, Modal, notification } from 'antd';
import StorageOrderCard from '../../components/Delivery/StorageOrderCard';
import SelectOrderList from '../../components/Delivery/SelectOrderList';
import EachDeliveryTable from '../../components/Delivery/EachDeliveryTable';
import request from '../../utils/request';
import style from './AddDelivery.less';

const { Search } = Input;
const { Option } = Select;
const { CheckableTag } = Tag;

let orderEachDistrict = {};

class AddDelivery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shippers: [],
      selectedShipper: '',
      selectedTags: [],
      // districts: [],
      selectList: [],
      stateOrderEachDistrict: [],
      showModal: false,
      // confirmSave: false,
    };
  }

  componentDidMount() {
    this.getOrderList();
    this.getShipperList();
  }
  onSaveData =() => {
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
  closeShowModal =() => {
    this.setState({
      showModal: false,
    });
  }
  openShowModal =() => {
    const { selectedShipper, selectList } = this.state;

    if (selectedShipper && selectList.length > 0) {
      this.setState({
        showModal: true,
      });
    } else {
      notification.warning({
        message: 'Chú ý',
        description: 'Bạn phải chọn người giao hàng và đơn hàng.',
      });
    }
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
      // orderInDistrict,
      // showModal,
      // confirmSave,
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
          <Button style={{ float: 'right' }} type="primary" onClick={this.openShowModal}>Tạo</Button>
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
          title="Chuyện Đi Giao"
          visible={this.state.showModal}
          onCancel={this.closeShowModal}
          width={1100}
          footer={null}
        >
          <EachDeliveryTable
            selectList={selectList}
            selectedShipper={selectedShipper}
            closeShowModal={this.closeShowModal}
            onSaveData={this.onSaveData}
          />
        </Modal>
      </div>
    );
  }
}
export default AddDelivery;
