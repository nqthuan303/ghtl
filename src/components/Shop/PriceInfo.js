import React from 'react';
import { Table, Divider, Modal } from 'antd';
import { withRouter } from 'react-router';
import request from '../../utils/request';
import FormPrice from './FormPrice';

class PriceInfo extends React.Component {
  constructor(props) {
    super(props);
    this.shopId = props.match.params.id;
    this.state = {
      districts: [],
      showModal: false,
    };
  }

  componentDidMount() {
    this.getPrice();
    this.getDistrictList();
  }

  onClickDelete() {
    // console.log(123123);
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
      objData: {
        districts: item.districts,
        area: item.area,
        price: item.price,
      },
      showModal: true,
    });
  }

  async getDistrictList() {
    const result = await request('/district/listForSelect');
    this.districts = result;
    this.setState({ districts: result.data });
  }

  async getPrice() {
    const result = await request(`/price/list/${this.shopId}`);
    if (result.status === 'success') {
      this.setState({ items: result.data });
    }
  }

  render() {
    const { items, showModal, districts, objData } = this.state;
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
        <Table
          rowKey={record => record._id}
          dataSource={items}
          columns={columns}
        />
        <Modal
          title="Basic Modal"
          visible={showModal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <FormPrice data={objData} districts={districts} />
        </Modal>
      </div>
    );
  }
}

export default withRouter(PriceInfo);
