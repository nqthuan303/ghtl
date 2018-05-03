import React from 'react';
import { notification } from 'antd';
import request from '../../utils/request';
import FormOrderRenderer from './FormOrderRenderer';

class FormOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shipFee: 0,
    };
    this.currentClient = '';
    this.currentDistrict = '';
    this.priceList = [];
  }

  onFormChange = (values) => {
    const { client, receiver } = values;

    if (client && client.value && this.currentClient !== client.value) {
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

  onFormSubmit = async (data) => {
    const { shipFee } = this.state;
    const { onSave } = this.props;

    const result = await request('/order/add', {
      method: 'POST',
      body: { ...data, shipFee },
    });
    if (result.status === 'success') {
      notification.success({
        message: 'Thành công',
        description: 'Thêm đơn hàng thành công!',
      });
      onSave(result.data);
    } else {
      notification.error({
        message: 'Thất bại',
        description: 'Thêm đơn hàng thất bại!',
      });
    }
  }

  onClickBtnEnd = () => {
    const { saveOrder } = this.props;
    saveOrder();
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
  render() {
    const { shipFee } = this.state;
    const { showEndButton } = this.props;
    return (
      <FormOrderRenderer
        showEndButton={showEndButton}
        onClickBtnEnd={this.onClickBtnEnd}
        onFormSubmit={this.onFormSubmit}
        shipFee={shipFee}
        onFormChange={this.onFormChange}
      />
    );
  }
}
export default FormOrder;

