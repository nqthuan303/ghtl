import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { notification, Button, Row, Col, Select } from 'antd';
import request from '../../utils/request';
import { order as objOrderStatus } from '../../constants/status';

const { Option } = Select;
const listOrderStatus = [];

for (const key in objOrderStatus) {
  if (key === 'STORAGE' || key === 'DELIVERYPREPARE' || key === 'DELIVERY' || key === 'RETURNFEESTORAGE') {
    const status = objOrderStatus[key];
    listOrderStatus.push(status);
  }
}

class OrderConvertStatus extends Component {
    static propTypes = {
      orderConvert: PropTypes.object.isRequired,
      closeShowModal: PropTypes.func.isRequired,
      onSaveData: PropTypes.func.isRequired,
    }
    constructor(props) {
      super(props);
      this.state = {
        selectStatus: this.props.orderConvert.orderstatus,
      };
    }
    componentWillReceiveProps(nextProps) {
      if (this.props.orderConvert &&
          this.props.orderConvert.orderstatus !== nextProps.orderConvert.orderstatus) {
        this.setState({
          selectStatus: nextProps.orderConvert.orderstatus,
        });
      }
    }
    onClickSave() {
      const { selectStatus } = this.state;
      const order = this.props.orderConvert;
      if (order.orderstatus !== selectStatus) {
        order.orderstatus = selectStatus;
        request(`/order/update/${order._id}`, { method: 'PUT', body: order }).then((result) => {
          if (result.message === 'Success') {
            this.props.onSaveData(order);
          } else {
            notification.error({
              message: 'Đã xãy ra lỗi',
              description: result.data.msg,
            });
          }
        });
      } else {
        notification.warning({
          message: 'Chú ý về trạng thái đơn hàng',
          description: 'Bạn cần phải thay đổi trạng thái đơn hàng.',
        });
      }
      this.props.closeShowModal();
    }
    handleSelectOrderStatus = (value) => {
      this.setState({
        selectStatus: value,
      });
    }
    renderOrder() {
      const order = this.props.orderConvert;
      const createdAt = new Date(order.createdAt);
      const orderCreatedAt = `${createdAt.getDate()}/${
        createdAt.getMonth()} ${
        createdAt.getHours()}:${
        createdAt.getMinutes()}`;
      return (
        <div>
          <Row gutter={16}>
            <Col span={12}>ID:</Col>
            <Col span={12}>{order.id}</Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>Ngày Tạo:</Col>
            <Col span={12}>{orderCreatedAt}</Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>Tên Người Nhận:</Col>
            <Col span={12}>{order.receiver.name}</Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}> Quận: </Col>
            <Col span={12}> {order.receiver.district.name}</Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}> Trạng Thái: </Col>
            <Col span={12}>
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select a person"
                optionFilterProp="children"
                value={this.state.selectStatus}
                onChange={this.handleSelectOrderStatus}
                filterOption={
                  (input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {this.renderOrderStatus()}
              </Select>
            </Col>
          </Row>
        </div>);
    }
    renderOrderStatus() {
      const result = [];
      for (let i = 0; i < listOrderStatus.length; i += 1) {
        result.push(
          <Option key={i} value={listOrderStatus[i].value}>{listOrderStatus[i].name}</Option>
        );
      }
      return result;
    }
    render() {
      return (
        <div>
          {this.renderOrder()}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button type="primary" onClick={() => this.onClickSave()}> Xác Nhận </Button>
            <Button style={{ marginLeft: '20px' }} onClick={() => this.props.closeShowModal()}> Hủy </Button>
          </div>
        </div>
      );
    }
}

export default OrderConvertStatus;
