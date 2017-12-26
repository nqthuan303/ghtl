import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, notification, Button } from 'antd';
import request from '../../utils/request';

class EachDeliveryTable extends Component {
    static propTypes = {
      selectList: PropTypes.array.isRequired,
      selectedShipper: PropTypes.string.isRequired,
      closeShowModal: PropTypes.func.isRequired,
      onSaveData: PropTypes.func.isRequired,
    }
    constructor(props) {
      super(props);
      this.state = {
        shipper: {},
      };
    }


    componentDidMount() {
      this.getShipper(this.props.selectedShipper);
    }
    componentWillReceiveProps(nextProps) {
      if (this.props.selectedShipper !== nextProps.selectedShipper) {
        this.getShipper(nextProps.selectedShipper);
      }
    }
    onClickSave() {
      const { shipper } = this.state;
      const { selectList, deliveryId } = this.props;
      const arrOrderId = [];
      const delivery = {};
      for (let i = 0; i < selectList.length; i += 1) {
        arrOrderId.push(selectList[i]._id);
      }
      delivery.user = shipper._id;
      delivery.orders = arrOrderId;
      let url = '/delivery/add';
      let method = 'POST';
      if (deliveryId) {
        url = `/delivery/update/${deliveryId}`;
        method = 'PUT';
      }
      request(url, { method, body: delivery }).then((result) => {
        if (result.status === 'success') {
          this.props.closeShowModal();
          this.props.onSaveData();
          notification.success({
            message: 'Thành Công',
            description: 'Bạn đã lưu Chuyến Đi Giao thành công.',
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
    async getShipper(shipper) {
      const result = await request(`/user/findOne?id=${shipper}`);
      if (result) {
        this.setState({
          shipper: result,
        });
      }
    }
    renderOrder() {
      const { selectList } = this.props;
      const { shipper } = this.state;
      const result = [];
      for (let i = 0; i < selectList.length; i += 1) {
        const order = selectList[i];
        const createdAt = new Date(order.createdAt);
        const orderCreatedAt = `${createdAt.getDate()}/${
          createdAt.getMonth()} ${
          createdAt.getHours()}:${
          createdAt.getMinutes()}`;
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
          createAt: orderCreatedAt,
          name: order.receiver.name,
          address: order.receiver.address,
          district: order.receiver.district.name,
          phoneNumbers,
          order,
        });
      }
      const columns = [
        {
          title: `${shipper.name} - ${shipper.phone_number}`,
          children: [
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
          ],
        }, {
          title: 'Tổng Tiền',
          children: [
            {
              title: 'SĐT',
              dataIndex: 'phoneNumbers',
              key: 'phoneNumbers',
            },
          ],
        },
        {
          title: '893384',
          children: [
            {
              title: 'Tiền Thu',
              dataIndex: 'money',
              key: 'money',
            },
          ],
        }];

      return <Table columns={columns} dataSource={result} />;
    }
    render() {
      return (
        <div>
          {this.renderOrder()}
          <div style={{ textAlign: 'center' }}>
            <Button type="primary" onClick={() => this.onClickSave()}> Xác Nhận </Button>
            <Button style={{ marginLeft: '20px' }} onClick={() => this.props.closeShowModal()}> Hủy </Button>
          </div>
        </div>
      );
    }
}

export default EachDeliveryTable;
