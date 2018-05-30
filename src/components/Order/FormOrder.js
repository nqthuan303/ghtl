
import React from 'react';
import { Form, Input, Col, Button, Select, Row, notification, Spin } from 'antd';
import { withRouter } from 'react-router';
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

function hasErrors(fieldsError) {
  let result = false;
  for (const key in fieldsError) {
    if (Object.prototype.hasOwnProperty.call(fieldsError, key)) {
      const error = fieldsError[key];
      if (error) {
        if (Array.isArray(error)) {
          result = true;
          break;
        } else {
          for (const childKey in error) {
            if (Object.prototype.hasOwnProperty.call(error, childKey)) {
              const childError = error[childKey];
              if (Array.isArray(childError)) {
                result = true;
                break;
              }
            }
          }
          if (result) {
            break;
          }
        }
      }
    }
  }
  return result;
}

class FormOrder extends React.Component {
  constructor(props) {
    super(props);
    if (props.match.params.id) {
      this.orderId = props.match.params.id;
    }
    this.state = {
      loading: false,
      clients: [],
      districts: [],
      wards: [],
    };
    this.priceList = [];
  }

  componentDidMount() {
    const { orderId, form: { validateFields } } = this.props;
    if (this.orderId) {
      this.getOrder(this.orderId);
    }
    if (orderId && orderId !== '') {
      this.getOrder(orderId);
    }
    validateFields();
    this.getClientList();
    this.getDistrictList();
  }
  componentWillReceiveProps(nextProps) {
    const { match: { params: { id } }, orderId } = this.props;
    const { match: { params: { id: nextId } }, orderId: nextOrderId } = nextProps;
    if (orderId !== nextOrderId) {
      this.getOrder(nextOrderId);
    }
    if (id !== nextId) {
      this.getOrder(nextId);
    }
  }
  onChangeClient = (value) => {
    const { form: { setFieldsValue } } = this.props;
    const { clients } = this.state;
    const client = clients[value];
    const clientDistrict = client.district;
    const districtName = clientDistrict ? `${clientDistrict.type} ${clientDistrict.name}` : '';
    setFieldsValue({
      client: value,
      senderAddress: client.address,
      senderPhone: client.phone,
      senderDistrict: districtName,
    });
    this.getPrice(value);
  }
  onChangeDistrict = async (value) => {
    const { form: { getFieldValue, setFieldsValue } } = this.props;
    setFieldsValue({ 'receiver.ward': undefined });
    const clientId = getFieldValue('client');
    this.getWardList(value);
    if (this.priceList.length > 0) {
      this.calculateShipFee();
    } else if (clientId) {
      this.getPrice(clientId);
    }
  }

  onClickBtnEnd = () => {
    const { saveOrder } = this.props;
    saveOrder();
  }
  async getWardList(districtId) {
    const result = await request(`/ward/listForSelect?districtId=${districtId}`);
    if (result.status === 'success') {
      this.setState({ wards: result.data });
    }
  }
  async getPrice(shopId) {
    const result = await request(`/price/list/${shopId}`);
    if (result.status === 'success') {
      const { data } = result;
      this.priceList = data;
      const { form: { getFieldValue } } = this.props;
      const receiverDistrict = getFieldValue('receiver.district');
      if (receiverDistrict) {
        this.calculateShipFee();
      }
    }
  }
  async getOrder(orderId) {
    const { form: { resetFields } } = this.props;
    resetFields();
    this.setState({ loading: true });
    const result = await request(`/order/findOne/${orderId}`);
    if (result.status === 'success') {
      const { data } = result;
      this.setFieldsData(data);
    }
  }
  setFieldsData(data) {
    const { form: { setFieldsValue } } = this.props;
    const { client, receiver } = data;
    const clientDistrict = client.district;
    const districtName = clientDistrict ? `${clientDistrict.type} ${clientDistrict.name}` : '';
    this.getWardList(receiver.district);
    setFieldsValue({
      client: client._id,
      senderPhone: client.phone,
      senderAddress: client.address,
      senderDistrict: districtName,
      'receiver.phone': receiver.phone,
      'receiver.name': receiver.name,
      'receiver.address': receiver.address,
      'receiver.district': receiver.district,
      'receiver.ward': receiver.ward,
      require: data.require,
      note: data.note,
      goodsMoney: data.goodsMoney,
      shipFee: data.shipFee,
      payBy: data.payBy,
    });
    this.setState({
      loading: false,
    });
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

  calculateShipFee() {
    let shipFee = 0;
    const { form: { getFieldValue, setFieldsValue } } = this.props;
    const receiverDistrict = getFieldValue('receiver.district');
    for (let i = 0; i < this.priceList.length; i++) {
      const objPrice = this.priceList[i];
      const districtInPrice = objPrice.districts;
      if (districtInPrice.indexOf(receiverDistrict) !== -1) {
        shipFee = objPrice.price;
        break;
      }
    }
    setFieldsValue({ shipFee });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { form: { validateFields } } = this.props;
    validateFields(async (err, values) => {
      if (!err) {
        const { onSave } = this.props;
        let id = '';
        if (this.props.orderId && this.props.orderId !== '') {
          id = this.props.orderId;
        }
        if (this.orderId) {
          id = this.orderId;
        }
        const url = id !== '' ? `/order/update/${id}` : '/order/add';
        const message = id ? 'Cập nhật đơn hàng thành công!!!' : 'Thêm đơn hàng thành công!!!';
        const result = await request(url, {
          method: 'POST',
          body: values,
        });
        if (result.status === 'success') {
          notification.success({
            message: 'Thành công',
            description: message,
          });
          onSave(result.data);
        } else {
          notification.error({
            message: 'Thất bại',
            description: 'Thêm đơn hàng thất bại!',
          });
        }
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
    const { form, showEndButton } = this.props;
    const {
      getFieldDecorator,
      getFieldValue,
      getFieldsError,
      isFieldTouched,
      getFieldError,
    } = form;
    const shipFee = getFieldValue('shipFee');
    const payBy = getFieldValue('payBy');
    const goodsMoney = getFieldValue('goodsMoney') ? Number(getFieldValue('goodsMoney')) : 0;
    const totalMoney = (payBy === orderPayBy.RECEIVER.value) ?
      goodsMoney + Number(shipFee) : goodsMoney;

    const receiverPhoneError = isFieldTouched('receiver.phone') && getFieldError('receiver.phone');
    const receiverNameError = isFieldTouched('receiver.name') && getFieldError('receiver.name');
    const receiverAddressError = isFieldTouched('receiver.address') && getFieldError('receiver.address');
    const receiverDistrictError = isFieldTouched('receiver.district') && getFieldError('receiver.district');
    const receiverWardError = isFieldTouched('receiver.ward') && getFieldError('receiver.ward');
    const clientError = isFieldTouched('client') && getFieldError('client');

    const errors = getFieldsError();
    const { loading } = this.state;
    return (
      <Spin tip="Loading..." spinning={loading}>
        <Form onSubmit={this.handleSubmit} className={globalStyle.appContent}>
          <Row gutter={12}>
            <Col span={6}>
              <FormItem
                validateStatus={clientError ? 'error' : ''}
                help={clientError || ''}
              >
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
                {getFieldDecorator('senderPhone', {
                  rules: [{ required: false }],
                })(
                  <Input disabled placeholder="SĐT người gửi" />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem>
                <FormItem>
                  {getFieldDecorator('senderAddress', {
                    rules: [{ required: false }],
                  })(
                    <Input placeholder="Địa chỉ" disabled />
                  )}
                </FormItem>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem>
                {getFieldDecorator('senderDistrict', {
                  rules: [{ required: false }],
                })(
                  <Input placeholder="Quận/Huyện" disabled />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <p style={{ fontWeight: 'bold' }}>1. Người nhận</p>
              <FormItem
                validateStatus={receiverPhoneError ? 'error' : ''}
                help={receiverPhoneError || ''}
                {...formItemLayout}
                label="Số ĐT"
              >
                {getFieldDecorator('receiver.phone', {
                  rules: [{ required: true }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem
                validateStatus={receiverNameError ? 'error' : ''}
                help={receiverNameError || ''}
                {...formItemLayout}
                label="Họ tên"
              >
                {getFieldDecorator('receiver.name', {
                  rules: [{ required: true }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem
                validateStatus={receiverAddressError ? 'error' : ''}
                help={receiverAddressError || ''}
                {...formItemLayout}
                label="Địa chỉ"
              >
                {getFieldDecorator('receiver.address', {
                  rules: [{ required: true }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem
                validateStatus={receiverDistrictError ? 'error' : ''}
                help={receiverDistrictError || ''}
                {...formItemLayout}
                label="Quận"
              >
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
              <FormItem
                validateStatus={receiverWardError ? 'error' : ''}
                help={receiverWardError || ''}
                {...formItemLayout}
                label="Phường"
              >
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
                  initialValue: 0,
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="Cước phí">
                {getFieldDecorator('shipFee', {
                  rules: [{ required: true }],
                  initialValue: 0,
                })(
                  <Input type="hidden" />
                )}
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
                <Button
                  disabled={hasErrors(errors)}
                  style={{ marginRight: 5 }}
                  type="primary"
                  htmlType="submit"
                >
                  Lưu lại
                </Button>
                {showEndButton ? <Button type="danger" onClick={this.onClickBtnEnd}>Kết thúc</Button> : ''}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Spin>
    );
  }
}

export default withRouter(Form.create()(FormOrder));
