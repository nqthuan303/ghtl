import React from 'react';
import { Select } from 'antd';

import request from '../../utils/request';
import { FormOrderRenderer } from './FormOrderRenderer';

const { Option } = Select;
const clients = {};
class FormOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientOption: [],
      districts: [],
      shipFee: 0,
    };
    this.currentClient = '';
    this.currentDistrict = '';
    this.priceList = [];
  }

  componentDidMount() {
    this.getClientList();
    this.getDistrictList();
  }
  onFormChange = (values) => {
    const { client, receiver } = values;
    if (client && this.currentClient !== client.value) {
      this.currentClient = client.value;
      this.getPrice(this.currentClient);
    }
    if (receiver) {
      const { district } = receiver;
      if (district && this.currentDistrict !== district.value) {
        this.currentDistrict = district.value;
        if (this.currentClient !== '') {
          this.calculateShipFee();
        }
      }
    }
  }

  async getPrice(shopId) {
    const result = await request(`/price/list/${shopId}`);
    if (result.status === 'success') {
      const { data } = result;
      this.priceList = data;
      if (this.currentDistrict !== '') {
        this.calculateShipFee();
      }
    }
  }

  async getDistrictList() {
    const result = await request('/district/listForSelect');
    this.setState({ districts: result });
  }

  async getClientList() {
    const result = await request('/client/listForSelect');
    const clientOption = [];
    for (let i = 0; i < result.length; i++) {
      const data = result[i];
      clients[data.key] = data;
      clientOption.push({
        key: data.key,
        value: data.value,
        text: data.text,
      });
    }
    this.setState({ clientOption });
  }

  calculateShipFee() {
    let shipFee = 0;
    for (let i = 0; i < this.priceList.length; i++) {
      const objPrice = this.priceList[i];
      const districtInPrice = objPrice.districts;
      if (districtInPrice.indexOf(this.currentDistrict) !== -1) {
        shipFee = objPrice.price;
        break;
      }
    }
    this.setState({ shipFee });
  }

  handleSubmit = () => {}

  renderClientOption = () => {
    const { clientOption } = this.state;
    return clientOption.map((client) => {
      return (
        <Option key={client.value} value={client.value}>{client.text}</Option>
      );
    });
  }

  renderDistrictOption = () => {
    const { districts } = this.state;
    return districts.map((district) => {
      return (
        <Option key={district.value} value={district.value}>{district.text}</Option>
      );
    });
  }

  render() {
    const { shipFee } = this.state;
    return (
      <FormOrderRenderer
        shipFee={shipFee}
        onFormChange={this.onFormChange}
        renderDistrictOption={this.renderDistrictOption}
        renderClientOption={this.renderClientOption}
        handleSubmit={this.handleSubmit}
      />
    );
  }
}
export default FormOrder;

