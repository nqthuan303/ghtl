
import React from 'react';
import { Form, Input, Col, Button, Select, Row, Radio } from 'antd';
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete';
import globalStyle from '../../index.less';
import request from '../../utils/request';


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

const clients = {};
class CreateForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientOption: [],
      districts: [],
      wards: [],
    };
  }

  componentDidMount() {
    this.getClientList();
    this.getDistrictList();
  }

  onChangeClient = (value) => {
    const clientSelected = clients[value];
    const { setFieldsValue } = this.props.form;

    setFieldsValue({
      client: value,
      sender: {
        phone: clientSelected.phone,
        address: clientSelected.address,
        district: clientSelected.district,
        paymentMethod: clientSelected.paymentMethod,
      },
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

  onChangeSenderAddress = (address) => {
    this.props.form.setFieldsValue({
      'sender.address': address,
    });
  }

  onChangeReceiverAddress = (address) => {
    this.props.form.setFieldsValue({
      'receiver.address': address,
    });
  }

  onSelectSenderAddress = (address) => {
    geocodeByAddress(address, (err) => {
      if (err) { return; }
      this.props.form.setFieldsValue({
        'sender.address': address,
      });
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
    const { clientOption } = this.state;
    return clientOption.map((client) => {
      return (
        <Option key={client.value} value={client.value}>{client.text}</Option>
      );
    });
  }
  render() {
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const senderAddress = getFieldValue('sender.address');
    const receiverAddress = getFieldValue('receiver.address');

    const inputProps = {
      value: senderAddress || '',
      onChange: this.onChangeSenderAddress,
      type: 'search',
      placeholder: 'Địa chỉ người gửi',
    };

    const receiverProps = {
      value: receiverAddress || '',
      onChange: this.onChangeReceiverAddress,
      type: 'search',
      placeholder: 'Địa chỉ người nhận',
    };

    return (
      <Form onSubmit={this.handleSubmit} className={globalStyle.appContent}>
        <Row gutter={12}>
          <Col span={4}>
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
          <Col span={4}>
            <FormItem>
              {getFieldDecorator('sender.phone', {
                rules: [{ required: true }],
              })(
                <Input placeholder="SĐT người gửi" />
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem>
              {getFieldDecorator('sender.address', {
                rules: [{ required: true }],
              })(
                <PlacesAutocomplete
                  options={autocompleteOptions}
                  classNames={cssClasses}
                  styles={myStyles}
                  inputProps={inputProps}
                  onSelect={this.onSelectSenderAddress}
                />
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem>
              {getFieldDecorator('sender.district', {
                rules: [{ required: true }],
              })(
                <Select
                  showSearch
                  placeholder="Quận/Huyện"
                  optionFilterProp="children"
                >
                  {this.renderDistrictOption()}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem>
              {getFieldDecorator('sender.paymentMethod', {
                rules: [{ required: true }],
              })(
                <Select
                  placeholder="Hình thức"
                  optionFilterProp="children"
                >
                  <Option key="cod" value="cod">COD</Option>
                  <Option key="ung" value="ung">Ứng</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem>
              <Button onClick={this.onClickBtnEnd}>Kết thúc</Button>
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
            <FormItem {...formItemLayout} label="Khối lượng">
              {getFieldDecorator('goods.weight', {
                rules: [{ required: false }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Qui đổi">
              <Row gutter={12}>
                <Col span={8}>
                  <FormItem>
                    {getFieldDecorator('goods.length', {
                      rules: [{ required: false }],
                    })(
                      <Input placeholder="Dài" />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    {getFieldDecorator('goods.width', {
                      rules: [{ required: false }],
                    })(
                      <Input placeholder="Rộng" />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    {getFieldDecorator('goods.height', {
                      rules: [{ required: false }],
                    })(
                      <Input placeholder="Cao" />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </FormItem>
            <FormItem {...formItemLayout} label="Yêu cầu">
              {getFieldDecorator('require', {
                rules: [{ required: false }],
              })(
                <Input />
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
            <p style={{ fontWeight: 'bold' }}>3. Cước phí</p>
            <FormItem {...formItemLayout} label="Phí phụ">
              {getFieldDecorator('bonusFee', {
                rules: [{ required: false }],
              })(
                <Input />
              )}
            </FormItem>
            <Row gutter={8}>
              <Col style={{ textAlign: 'right', color: '#000000' }} span={6}>Phí vận chuyển:</Col>
              <Col span={18}>
                {this.props.shipFee}
              </Col>
            </Row>
            <Row gutter={8}>
              <Col style={{ textAlign: 'right', color: '#000000' }} span={6}>Cước phí: </Col>
              <Col span={18}> 0</Col>
            </Row>
            <br />
            <p style={{ fontWeight: 'bold' }}>4. Thu tiền</p>
            <FormItem {...formItemLayout} label="Tiền hàng">
              {getFieldDecorator('goodsMoney', {
                rules: [{ required: true }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Trả cước">
              <Row gutter={12}>
                <Col span={8}>
                  <FormItem>
                    {getFieldDecorator('require', {
                      rules: [{ required: false }],
                    })(
                      <Radio>Người gửi</Radio>
                    )}
                  </FormItem>
                </Col>
                <Col span={16}>
                  <FormItem>
                    {getFieldDecorator('require', {
                      rules: [{ required: false }],
                    })(
                      <Radio>Người nhận</Radio>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </FormItem>
            <FormItem {...formItemLayout} label="Thu khách">
              0
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button style={{ marginRight: 5 }} type="primary" htmlType="submit">Tạo vận đơn</Button>
              <Button>Quay lại</Button>
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
