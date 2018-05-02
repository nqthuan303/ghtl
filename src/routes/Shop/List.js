import React from 'react';
import { Divider, Table, Alert, Modal, Button } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import globalStyles from '../../index.less';
import request from '../../utils/request';
import FormAddShop from '../../components/Shop/FormAddShop';

const { confirm } = Modal;

class ShopList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      showModal: false,
      notice: {
        type: 'success',
        message: '',
      },
    };
  }

  componentDidMount() {
    this.getList();
  }
  onClickAddShop = () => {
    this.setState({ showModal: true });
  }
  onDataSaved = () => {
    this.setState({ showModal: false });
    this.getList();
  }
  onClickDelete(record, index) {
    confirm({
      title: 'Xác nhận xóa?',
      content: 'Bạn có chắc muốn xóa shop này?',
      okText: 'Xác nhận',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => this.onOk(record, index),
      onCancel() {
        // console.log('Cancel');
      },
    });
  }
  async onOk(record, index) {
    const clientId = record._id;
    const delUrl = `/client/delete/${clientId}`;
    const result = await request(delUrl, { method: 'DELETE' });
    if (result.status === 'success') {
      const { items } = this.state;
      items.splice(index, 1);
      this.setState({
        items,
        notice: {
          type: 'success',
          message: 'Xóa shop thành công!',
        },
      });
    } else {
      this.setState({
        notice: {
          type: 'error',
          message: 'Đã xãy ra lỗi!',
        },
      });
    }
  }
  onClickShopName = (e) => {
    e.preventDefault();
    const { history } = this.props;
    const { target } = e;
    const shopId = target.getAttribute('shopid');
    history.push(`/shop/info/${shopId}`);
  }

  async getList() {
    const result = await request('/client/list');
    if (result.status === 'success') {
      const { data } = result;
      this.setState({ items: data });
    }
  }
  closeShowModal = () => {
    this.setState({ showModal: false });
  }
  render() {
    const { items, notice, showModal } = this.state;

    const columns = [
      {
        title: 'No',
        sorter: (a, b) => a.id - b.id,
        dataIndex: 'id',
      },
      {
        title: 'shop',
        sorter: (a, b) => a.name.length - b.name.length,
        dataIndex: 'name',
        render: (text, record) => (
          <a shopid={record._id} onClick={this.onClickShopName} href={`shop/info/${record._id}`}>{record.name}</a>
        ),
      },
      {
        title: 'SĐT',
        dataIndex: 'phone',
        sorter: (a, b) => a.phone - b.phone,
        align: 'right',
      },
      {
        title: 'Địa chỉ',
        dataIndex: 'address',
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        filters: [
          { text: 'Hoạt động', value: 1 },
          { text: 'Không hoạt động', value: 0 },
        ],
        sorter: (a, b) => a.status - b.status,
        onFilter: (value, record) => record.status === Number(value),
      },
      {
        title: 'Hoạt động',
        render: (text, record, index) => (
          <div>
            <a onClick={() => this.onClickDelete(record, index)}>Xóa</a>
            <Divider type="vertical" />
          </div>
        ),
      },
    ];
    return (
      <PageHeaderLayout title="Danh sách shop">
        <div>
          <Button type="primary" onClick={this.onClickAddShop}> Tạo mới</Button>
        </div>
        <br />
        <div className={globalStyles.tableList}>
          {notice.message !== '' ?
            <Alert closable style={{ marginBottom: 10 }} message={notice.message} type={notice.type} /> : ''}
          <Table
            rowKey={record => record._id}
            dataSource={items}
            columns={columns}
            pagination={{ showSizeChanger: true }}
          />
        </div>
        <Modal
          title="Thêm Khách Hàng"
          visible={showModal}
          onCancel={this.closeShowModal}
          width={500}
          footer={null}
        >
          <FormAddShop
            closeShowModal={this.closeShowModal}
            onDataSaved={this.onDataSaved}
          />
        </Modal>
      </PageHeaderLayout>

    );
  }
}

export default ShopList;
