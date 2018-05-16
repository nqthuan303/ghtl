import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Row, Col } from 'antd';
import moment from 'moment';
import { order as orderStatus, orderPayBy } from '../../constants/status';

class PaymentInfo extends Component {
    static propTypes = {
      payment: PropTypes.object.isRequired,
      closeShowModal: PropTypes.func.isRequired,
    }
    renderMoney = (order) => {
      let money = 0;
      if (order.orderstatus === orderStatus.DELIVERED.value) {
        money = order.goodsMoney;
        if (order.payBy === orderPayBy.RECEIVER.value) {
          money += order.shipFee;
        }
      }
      return money;
    }
    renderOrderStatus = ({ orderstatus }) => {
      let result = '';
      for (const key in orderStatus) {
        if (orderStatus[key]) {
          const objStatus = orderStatus[key];
          if (objStatus.value === orderstatus) {
            result = objStatus.name;
            break;
          }
        }
      }
      return result;
    }
    renderShipFee = (record) => {
      const { orderstatus, shipFee } = record;
      let result = 0;
      if (
        orderstatus === orderStatus.DELIVERED.value ||
        orderstatus === orderStatus.RETURNFEESTORAGE.value ||
        orderstatus === orderStatus.RETURNEDFEE.value ||
        orderstatus === orderStatus.RETURNFEEPREPARE.value
      ) {
        result = shipFee;
      }
      return result;
    }
    render() {
      const { payment: { client, orders } } = this.props;
      const columns = [{
        title: 'MVĐ',
        key: 'id',
        render: record => (
          <div>{record ? record.id : ''}</div>
        ),
      },
      {
        title: 'Ngày tạo',
        key: 'date',
        render: record => moment(record.createdAt).format('DD-MM HH:mm'),
      }, {
        title: 'Địa chỉ nhận',
        key: 'receiver',
        dataIndex: 'receiver.address',
      }, {
        title: 'Đã thu khách',
        key: 'money',
        render: this.renderMoney,
      }, {
        title: 'Cước phí',
        key: 'shipFee',
        render: this.renderShipFee,
      }, {
        title: 'Trạng thái',
        key: 'status',
        render: this.renderOrderStatus,
      }];
      return (
        <div>
          <div style={{ fontSize: '16px' }}>
            <b> Tổng tiền thanh toán: {this.props.payment.money}</b>
          </div>
          <Row gutter={8}>
            <Col span={12}>
              <div> Thông Tin Shop</div>
              <ul>
                <li>{client.name}</li>
                <li>{client.phone}</li>
                <li>{client.address}</li>
              </ul>
            </Col>
            <Col span={12}>
              <div>Thông tin tài khoản</div>
              <ul>
                <li>Ngân hàng: {client.bankName ? client.bankName : 'N/A'}</li>
                <li>Chi Nhánh: {client.bankBranch ? client.bankBranch : 'N/A'}</li>
                <li>Tài khoản: {client.bankAccount ? client.bankAccount : 'N/A'}</li>
                <li>Số Tài khoản: {client.bankNumber ? client.bankNumber : 'N/A'}</li>
              </ul>
            </Col>
          </Row>
          <Table
            pagination={false}
            bordered
            columns={columns}
            dataSource={orders}
            rowKey={record => record._id}
          />
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Button
              onClick={() => this.props.closeShowModal()}
            > Đóng
            </Button>
          </div>
        </div>
      );
    }
}

export default PaymentInfo;
