import React from 'react';
import { Table, Divider, Modal, Button, notification } from 'antd';
import { withRouter } from 'react-router';
import request from '../../utils/request';
import FormPrice from './FormPrice';

const { confirm } = Modal;

class PriceInfo extends React.Component {
  constructor(props) {
    super(props);
    this.shopId = props.match.params.id;
    this.state = {
      districts: [],
      objData: {
        area: '',
        price: '',
        districts: [],
      },
      isEditMode: false,
      showModal: false,
    };
  }

  componentDidMount() {
    this.getPrice();
    this.getDistrictList();
  }

  onClickDelete(record, index) {
    this.selectedItem = {
      id: record._id,
      index,
    };
    confirm({
      title: 'Xác nhận xóa?',
      content: 'Bạn có chắc muốn xóa gói cước này?',
      okText: 'Xác nhận',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: this.onConfirm,
      onCancel() {
        // console.log('Cancel');
      },
    });
  }

  onConfirm = async () => {
    const result = await request(`/price/delete/${this.selectedItem.id}`, {
      method: 'DELETE',
    });
    if (result.status === 'success') {
      const { items } = this.state;
      items.splice(this.selectedItem.index, 1);
      this.setState({ items });
      notification.success({
        message: 'Thành công',
        description: 'Xóa cước phí thành công!',
      });
    } else {
      const resData = result.data;
      notification.error({
        message: 'Lỗi!',
        description: resData.msg,
      });
    }
  }

  onClickEdit(item, index) {
    const { items } = this.state;
    this.selectedItem = { id: item._id, index };

    const selectedDistricts = [];
    for (let i = 0; i < items.length; i++) {
      const price = items[i];
      if (price._id === item._id) {
        continue;
      }
      const { districts } = price;
      for (let j = 0; j < districts.length; j++) {
        selectedDistricts.push(districts[j]);
      }
    }

    const tempDistricts = [];
    for (let i = 0; i < this.districts.length; i++) {
      const district = this.districts[i];
      if (selectedDistricts.indexOf(district.value) === -1) {
        tempDistricts.push(district);
      }
    }
    this.setState({
      districts: tempDistricts,
      isEditMode: true,
      objData: {
        districts: item.districts,
        area: item.area,
        price: item.price,
      },
      showModal: true,
    });
  }
  onClickAddPrice = () => {
    const { items } = this.state;
    const selectedDistricts = [];

    for (let i = 0; i < items.length; i++) {
      const price = items[i];
      const { districts } = price;
      for (let j = 0; j < districts.length; j++) {
        selectedDistricts.push(districts[j]);
      }
    }

    const tempDistricts = [];
    for (let i = 0; i < this.districts.length; i++) {
      const district = this.districts[i];
      if (selectedDistricts.indexOf(district.value) === -1) {
        tempDistricts.push(district);
      }
    }

    this.selectedItem = null;

    this.setState({
      showModal: true,
      districts: tempDistricts,
      isEditMode: false,
      objData: {
        districts: [],
        area: '',
        price: 0,
      },
    });
  }
  onCancelModal = () => {
    this.setState({ showModal: false });
  }

  onFormSubmit = async (formData) => {
    const { isEditMode } = this.state;
    const client = this.shopId;
    let url = '/price/add';
    const data = { ...formData, client };

    if (isEditMode) {
      url = `/price/update/${this.selectedItem.id}`;
    }

    const result = await request(url, {
      method: 'POST',
      body: data,
    });

    const { data: resData } = result;

    if (result.status === 'success') {
      const { items } = this.state;
      let message = '';
      if (this.selectedItem) {
        message = 'Cập nhật thành công!';
        items[this.selectedItem.index] = resData;
      } else {
        message = 'Thêm gói cước thành công';
        items.unshift(resData);
      }
      this.setState({ items, objData: formData });
      notification.success({
        message: 'Thành công',
        description: message,
      });
    } else {
      notification.error({
        message: 'Lỗi',
        description: resData.msg,
      });
    }
    this.setState({ showModal: false });
  }

  async getDistrictList() {
    const result = await request('/district/listForSelect');
    this.districts = result;
    this.setState({ districts: result });
  }

  async getPrice() {
    const result = await request(`/price/list/${this.shopId}`);
    if (result.status === 'success') {
      this.setState({ items: result.data });
    }
  }
  render() {
    const { items, showModal, districts, objData, isEditMode } = this.state;
    const columns = [
      {
        title: 'Khu vực',
        sorter: (a, b) => a.id.length - b.id.length,
        dataIndex: 'area',
      },
      {
        title: 'Cước phí',
        sorter: (a, b) => a.name - b.name,
        dataIndex: 'price',
      },
      {
        title: 'Quận',
        dataIndex: 'strDistrict',
      },
      {
        title: 'Hoạt động',
        render: (text, record, index) => (
          <div>
            <a onClick={() => this.onClickDelete(record, index)}>Xóa</a>
            <Divider type="vertical" />
            <a onClick={() => this.onClickEdit(record, index)}>Sửa</a>
          </div>
        ),
      },
    ];

    return (
      <div>
        <Button onClick={this.onClickAddPrice} style={{ marginBottom: 10 }} type="primary">Thêm khu vực</Button>
        <Table
          rowKey={record => record._id}
          dataSource={items}
          columns={columns}
        />
        <Modal
          title={isEditMode ? 'Sửa gói cước' : 'Thêm gói cước'}
          visible={showModal}
          onCancel={this.onCancelModal}
          footer={null}
        >
          <FormPrice
            onFormSubmit={this.onFormSubmit}
            data={objData}
            onCancelModal={this.onCancelModal}
            districts={districts}
          />
        </Modal>
      </div>
    );
  }
}

export default withRouter(PriceInfo);
