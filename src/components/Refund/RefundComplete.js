import React, { Component } from 'react';
// import { Table, Icon } from 'antd';
// import moment from 'moment';
// import request from '../../utils/request';

class RefundComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // listRefund: [],
    };
  }
  componentDidMount() {
    // this.getRefund();
  }

  // async getRefund() {
  //   const data = await request('/refund/list');
  //   if (data && data.data) {
  //     const refunds = data.data;
  //     const listRefund = [];
  //     for (let i = 0; i < refunds.length; i += 1) {
  //       const refund = refunds[i];
  //       if (refund.status === 'completed') {
  //         refund.key = i;
  //         listRefund.push(refund);
  //       }
  //     }
  //     this.setState({ listRefund });
  //   }
  // }
  // expandedRowRender = (record) => {
  //   const columns = [
  //     { title: 'Id', dataIndex: 'id', key: 'id' },
  //     { title: 'Địa Chỉ', dataIndex: 'address', key: 'address' },
  //     { title: 'Quận', dataIndex: 'district', key: 'district' },
  //   ];

  //   const data = [];
  //   for (let i = 0; i < record.orders.length; i += 1) {
  //     const order = record.orders[i];
  //     data.push({
  //       key: i,
  //       id: order.id,
  //       address: order.receiver.address,
  //       district: order.receiver.district.name,
  //     });
  //   }
  //   return (
  //     <Table
  //       showHeader={false}
  //       columns={columns}
  //       dataSource={data}
  //       pagination={false}
  //     />
  //   );
  // };
  render() {
    // const { listRefund } = this.state;
    // const columns = [{
    //   title: 'Chuyến Giao',
    //   key: 'id',
    //   render: record => (
    //     <div>
    //       {record.id}
    //     </div>
    //   ),
    // }, {
    //   title: 'Kết Thúc',
    //   key: 'endTime',
    //   render: record => (
    //     <div>
    //       {moment(record.endTime).format('DD-MM HH:mm')}
    //     </div>
    //   ),
    // }, {
    //   title: 'Nhân Viên Giao',
    //   key: 'name',
    //   render: record => (
    //     <div>
    //       {record.user.name}
    //     </div>
    //   ),
    // }, {
    //   title: 'Số Đơn',
    //   key: 'countOrders',
    //   render: record => (
    //     <div>
    //       {record.orders.length}
    //     </div>
    //   ),
    // }, {
    //   title: 'Tổng Thu',
    //   key: 'monney',
    // }, {
    //   title: 'Trạng Thái',
    //   key: 'status',
    //   render: record => (
    //     <div>
    //       {record.status}
    //     </div>
    //   ),
    // }, {
    //   title: 'In',
    //   key: 'print',
    //   render: () => (
    //     <div>
    //       <Icon style={{ cursor: 'pointer' }} type="printer" />
    //     </div>
    //   ),
    // }];
    return (
      <div>
        {/* <Table
          dataSource={listRefund}
          columns={columns}
          expandedRowRender={this.expandedRowRender}
        /> */}
      </div>
    );
  }
}

export default RefundComplete;
