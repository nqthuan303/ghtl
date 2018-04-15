
import React from 'react';
import { Form, Input, Col, Button, Select, Row } from 'antd';
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete';
import globalStyle from '../../index.less';
import request from '../../utils/request';
import { orderPayBy } from '../../constants/status';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 6 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 14, offset: 6 },
  },
};

const autocompleteOptions = {
  componentRestrictions: { country: 'vn' },
};

const cssClasses = {
  input: 'ant-input',
};

const myStyles = {
  autocompleteContainer: {
    position: 'absolute',
    zIndex: 100,
    width: '100%',
  },
};

class CreateForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client: {},
      clients: [],
      districts: [],
      wards: [],
    };
  }

  componentDidMount() {
    this.getClientList();
    this.getDistrictList();
  }

  onChangeClient = (value) => {
    const { setFieldsValue } = this.props.form;
    const { clients } = this.state;
    this.setState({
      client: clients[value],
    });
    setFieldsValue({
      client: value,
    });
  }

  onChangeDistrict = async (value) => {
    const result = await request(`/ward/listForSelect?districtId=${value}`);
    if (result.status === 'success') {
      const { form } = this.props;
      const { setFieldsValue } = form;
      setFieldsValue({
        'receiver.ward': null,
      });
      this.setState({ wards: result.data });
    }
  }

  onChangeReceiverAddress = (address) => {
    this.props.form.setFieldsValue({
      'receiver.address': address,
    });
  }

  onSelectReceiverAddress = (address) => {
    geocodeByAddress(address, (err) => {
      if (err) { return; }
      this.props.form.setFieldsValue({
        'receiver.address': address,
      });
    });
  }

  onClickBtnEnd = () => {
    const { onClickBtnEnd } = this.props;
    onClickBtnEnd();
  }
  async getClientList() {
    const result = await request('/client/list');
    if (result.status === 'success') {
      const { data } = result;
      const clients = {};
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        clients[item._id] = item;
      }
      this.setState({
        clients,
      });
    }
  }
  async getDistrictList() {
    const result = await request('/district/listForSelect');
    this.setState({ districts: result });
  }


  handleSubmit = (e) => {
    e.preventDefault();
    const { onFormSubmit, form } = this.props;
    const { validateFields } = form;
    validateFields(async (err, values) => {
      if (!err) {
        onFormSubmit(values);
      }
    });
  }

  renderDistrictOption() {
    const { districts } = this.state;
    return districts.map((district) => {
      return (
        <Option key={district.value} value={district.value}>{district.text}</Option>
      );
    });
  }
  renderWardOption() {
    const { wards } = this.state;
    return wards.map((ward) => {
      return (
        <Option key={ward.value} value={ward.value}>{ward.text}</Option>
      );
    });
  }
  renderClientOption() {
    const { clients } = this.state;
    const result = [];
    for (const key in clients) {
      if (Object.prototype.hasOwnProperty.call(clients, key)) {
        const client = clients[key];
        result.push(
          <Option key={client._id} value={client._id}>{client.name}</Option>
        );
      }
    }
    return result;
  }
  render() {
    const { form, shipFee } = this.props;
    const { client } = this.state;
    const clientDistrict = client.district;

    const districtName = clientDistrict ? `${clientDistrict.type} ${clientDistrict.name}` : '';

    const { getFieldDecorator, getFieldValue } = form;
    const receiverAddress = getFieldValue('receiver.address');

    const receiverProps = {
      value: receiverAddress || '',
      onChange: this.onChangeReceiverAddress,
      type: 'search',
      placeholder: 'Địa chỉ người nhận',
    };

    const totalMoney = Number(getFieldValue('goodsMoney')) + Number(shipFee);

    return (
      <Form onSubmit={this.handleSubmit} className={globalStyle.appContent}>
        <Row gutter={12}>
          <Col span={6}>
            <FormItem>
              {getFieldDecorator('client', {
                rules: [{ required: true }],
              })(
                <Select
                  onChange={this.onChangeClient}
                  showSearch
                  placeholder="Người gửi"
                  optionFilterProp="children"
                >
                  {this.renderClientOption()}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem>
              <Input value={client.phone} disabled placeholder="SĐT người gửi" />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem>
              <Input value={client.address} placeholder="Địa chỉ" disabled />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem>
              <Input value={districtName} placeholder="Quận/Huyện" disabled />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={12}>
            <p style={{ fontWeight: 'bold' }}>1. Người nhận</p>
            <FormItem {...formItemLayout} label="Số điện thoại">
              {getFieldDecorator('receiver.phone', {
                rules: [{ required: true }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Họ tên">
              {getFieldDecorator('receiver.name', {
                rules: [{ required: true }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Địa chỉ">
              {getFieldDecorator('receiver.address', {
                rules: [{ required: true }],
              })(
                <PlacesAutocomplete
                  options={autocompleteOptions}
                  classNames={cssClasses}
                  styles={myStyles}
                  inputProps={receiverProps}
                  onSelect={this.onSelectReceiverAddress}
                />
              )}
            </FormItem>
            <FormItem colon={false} {...formItemLayout} label=" ">
              <Row gutter={12}>
                <Col span={12}>
                  <FormItem>
                    {getFieldDecorator('receiver.district', {
                      rules: [{ required: true }],
                    })(
                      <Select
                        showSearch
                        onChange={this.onChangeDistrict}
                        placeholder="Quận/Huyện"
                        optionFilterProp="children"
                      >
                        {this.renderDistrictOption()}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem>
                    {getFieldDecorator('receiver.ward', {
                      rules: [{ required: true }],
                    })(
                      <Select
                        showSearch
                        placeholder="Phường/Xã"
                        optionFilterProp="children"
                      >
                        {this.renderWardOption()}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </FormItem>
            <p style={{ fontWeight: 'bold' }}>2. Hàng hóa</p>
            <FormItem {...formItemLayout} label="Yêu cầu">
              {getFieldDecorator('require', {
                rules: [{ required: false }],
                initialValue: 'notAllowSeeGoods',
              })(
                <Select>
                  <Option value="notAllowSeeGoods">Không được xem hàng</Option>
                  <Option value="allowSeeGoods">Được xem hàng</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Ghi chú">
              {getFieldDecorator('note', {
                rules: [{ required: false }],
              })(
                <TextArea rows={4} />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <p style={{ fontWeight: 'bold' }}>4. Thu tiền</p>
            <FormItem {...formItemLayout} label="Tiền hàng">
              {getFieldDecorator('goodsMoney', {
                rules: [{ required: true }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Cước phí">
              {shipFee}
            </FormItem>
            <FormItem {...formItemLayout} label="Trả cước">
              {getFieldDecorator('payBy', {
                rules: [{ required: true }],
                initialValue: orderPayBy.SENDER.value,
              })(
                <Select>
                  <Option value={orderPayBy.SENDER.value}>Người gửi</Option>
                  <Option value={orderPayBy.RECEIVER.value}>Người nhận</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Thu khách">
              {totalMoney}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button style={{ marginRight: 5 }} type="primary" htmlType="submit">Tạo tiếp</Button>
              <Button onClick={this.onClickBtnEnd}>Kết thúc</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

const createFormOpt = {
  onFieldsChange(props, changedFields) {
    props.onFormChange(changedFields);
  },
};

export default Form.create(createFormOpt)(CreateForm);
