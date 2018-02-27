import React, { Component } from 'react';
// import { Table, Icon, notification, Modal } from 'antd';
// import { withRouter } from 'react-router';
// import moment from 'moment';
// import Refund from './Refund';
// import request from '../../utils/request';

class RefundUnComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
    //   listRefund: [],
    //   showModal: false,
    //   selectRefund: '',
    };
  }
  componentDidMount() {
    // this.getRefund();
  }
  // onClickEditRefund(refund) {
  //   const { history } = this.props;
  //   history.push(`/refund/update/${refund._id}`);
  // }
  // onSaveData =() => {
  //   this.getRefund();
  //   this.props.onSaveData();
  //   this.setState({
  //     showModal: false,
  //   });
  // }
  // onClickDeleteRefund(refund) {
  //   request(`/refund/delete/${refund._id}`, { method: 'DELETE' }).then((result) => {
  //     if (result.status === 'success') {
  //       notification.success({
  //         message: 'Thành Công',
  //         description: 'Bạn đã xóa chuyến đi giao',
  //       });
  //       this.getRefund();
  //     } else {
  //       notification.error({
  //         message: 'Xãy ra lỗi',
  //         description: result.data.msg,
  //       });
  //     }
  //   });
  // }
  // onClickChangeStatus(record) {
  //   const { countOrders, name } = record;
  //   if (countOrders <= 0 || !name || name === '') {
  //     notification.error({
  //       message: 'Xãy ra lỗi',
  //       description: 'Chuyến đi giao cần chọn shiper và đơn hàng!!!!',
  //     });
  //     return;
  //   }
  //   request(`/refund/changeStatusRefund/${record._id}`, { method: 'PUT' }).then((result) => {
  //     if (result.status === 'success') {
  //       this.getRefund();
  //       notification.success({
  //         message: 'Thành Công',
  //         description: 'Bạn đã lưu Chuyến Đi Giao thành công.',
  //       });
  //     } else {
  //       notification.error({
  //         message: 'Xãy ra lỗi',
  //         description: result.data.msg,
  //       });
  //     }
  //   });
  // }
  // onClickChangeRefund(record) {
  //   this.setState({
  //     showModal: true,
  //     selectRefund: record._id,
  //   });
  // }
  // async getRefund() {
  //   const data = await request('/refund/list');
  //   if (data && data.data) {
  //     const deliveries = data.data;
  //     const listRefund = [];
  //     for (let i = 0; i < deliveries.length; i += 1) {
  //       const refund = deliveries[i];
  //       if (refund.status === 'unCompleted' || refund.status === 'refund') {
  //         listRefund.push({
  //           _id: refund._id,
  //           key: i,
  //           id: refund.id,
  //           name: refund.user ? refund.user.name : '',
  //           countOrders: refund.orders.length,
  //           startTime: refund.startTime ? moment(refund.startTime).format('DD-MM HH:mm') : '',
  //           status: refund.status,
  //         });
  //       }
  //     }
  //     this.setState({ listRefund });
  //   }
  // }
  // closeShowModal =() => {
  //   this.setState({
  //     showModal: false,
  //   });
  // }
  render() {
    // const { listRefund, selectRefund, showModal } = this.state;
    // const columns = [{
    //   title: 'Chuyến Giao',
    //   dataIndex: 'id',
    //   key: 'id',
    // }, {
    //   title: 'Bắt Đầu',
    //   dataIndex: 'startTime',
    //   key: 'startTime',
    // }, {
    //   title: 'Nhân Viên Giao',
    //   dataIndex: 'name',
    //   key: 'name',
    // }, {
    //   title: 'Số Đơn',
    //   dataIndex: 'countOrders',
    //   key: 'countOrders',
    // }, {
    //   title: 'Tổng Thu',
    //   key: 'monney',
    // }, {
    //   title: 'Chỉnh Sửa',
    //   key: 'edit',
    //   render: (text, record) => (
    //     record.status === 'unCompleted' ?
    //       <div style={{ fontSize: '16px' }} >
    //         <a onClick={() => this.onClickEditRefund(record)}>
    //           <Icon type="edit" />
    //         </a>
    //         <a style={{ marginLeft: '10px' }} onClick={() => this.onClickDeleteRefund(record)}>
    //           <Icon type="delete" />
    //         </a>
    //       </div>
    //       : ''
    //   ),
    // }, {
    //   title: 'Trạng Thái',
    //   key: 'status',
    //   render: record => (
    //     <div>
    //       {record.status === 'unCompleted' ?
    //         <a onClick={() => this.onClickChangeStatus(record)}>
    //           {record.status}
    //         </a>
    //     :
    //         <a onClick={() => this.onClickChangeRefund(record)}>
    //           {record.status}
    //         </a>
    //     }
    //     </div>

    //   ),
    // }, {
    //   title: 'In',
    //   key: 'print',
    //   render: () => (
    //     <span >
    //       <Icon style={{ cursor: 'pointer' }} type="printer" />
    //     </span>
    //   ),
    // }];
    return (
      <div>
        {/* <Table dataSource={listRefund} columns={columns} />
          <Modal
            title="Refund"
            visible={showModal}
            onCancel={this.closeShowModal}
            width={1000}
            footer={null}
          >
            <Refund
              refundId={selectRefund}
              closeShowModal={this.closeShowModal}
              onSaveDataRefund={this.onSaveData}
            />
          </Modal> */}
      </div>
    );
  }
}
// export default withRouter(RefundUnComplete)
export default RefundUnComplete;
