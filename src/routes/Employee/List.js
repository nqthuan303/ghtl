import React from 'react';
import {
  Table,
  Button,
  Modal,
  // notification
} from 'antd';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import FormEmployee from '../../components/Employee/FormEmployee';
// import { delivery as deliveryStatus } from '../../constants/status';
import request from '../../utils/request';

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      showModal: false,
    };
  }

  componentDidMount() {
    this.getList();
  }
  onClickUpdateUser(employee) {
    const { history } = this.props;
    history.push(`/employee/update/${employee}`);
  }
  onClickAddUser = () => {
    this.setState({ showModal: true });
  }
  onDataSaved = () => {
    this.setState({ showModal: false });
    this.getList();
  }
  async getList() {
    const data = await request('/user/list');
    if (data && data.data) {
      this.setState({ users: data.data });
    }
  }
  closeShowModal = () => {
    this.setState({ showModal: false });
  }

  render() {
    const { users, showModal } = this.state;
    const columns = [{
      title: 'MNV',
      key: 'id',
      render: record => (
        <a onClick={() => this.onClickUpdateUser(record._id)}>{record.id}</a>
      ),
    },
    {
      title: 'Tên nhân viên',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: 'SĐT',
      key: 'phone',
      dataIndex: 'phone',
    }, {
      title: 'Chức vụ',
      key: 'role',
      render: record => (
        record.role ?
          <div>{record.role.name}</div>
          : ''
      ),
    }, {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
    },
    {
      title: 'Thời gian bắt đầu',
      key: 'startTIme',
      render: record => moment(record.createdAt).format('DD-MM HH:mm'),
    }];
    return (
      <PageHeaderLayout title="Danh sách nhân viên">
        <div>
          <Button type="primary" onClick={this.onClickAddUser}> Tạo mới</Button>
        </div>
        <br />
        <div>
          <Table
            bordered
            dataSource={users}
            rowKey={record => record._id}
            columns={columns}
          />
        </div>
        <Modal
          title="Thêm nhân viên"
          visible={showModal}
          onCancel={this.closeShowModal}
          width={450}
          footer={null}
        >
          <FormEmployee
            closeShowModal={this.closeShowModal}
            onDataSaved={this.onDataSaved}
          />
        </Modal>
      </PageHeaderLayout>
    );
  }
}
export default List;
