import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete';
import { Form, Button, Input, notification, Select, Row, Col } from 'antd';
import request from '../../utils/request';

const { Option } = Select;
const FormItem = Form.Item;
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

class FormAddShop extends Component {
    static propTypes = {
      closeShowModal: PropTypes.func.isRequired,
      onDataSaved: PropTypes.func.isRequired,
    }
    constructor(props) {
      super(props);
      this.state = {
        districts: [],
        wards: [],
      };
    }
    componentDidMount() {
      this.getDistrictList();
    }
    onChangeDistrict = async (value) => {
      const result = await request(`/ward/listForSelect?districtId=${value}`);
      if (result.status === 'success') {
        const { form } = this.props;
        const { setFieldsValue } = form;
        setFieldsValue({
          ward: null,
        });
        this.setState({ wards: result.data });
      }
    }
    onSelectReceiverAddress = (address) => {
      geocodeByAddress(address, (err) => {
        if (err) { return; }
        this.props.form.setFieldsValue({ address });
      });
    }
    onChangeReceiverAddress = (address) => {
      this.props.form.setFieldsValue({ address });
    }
    async getDistrictList() {
      const result = await request('/district/listForSelect');
      this.setState({ districts: result });
    }
    handleSubmit = (e) => {
      e.preventDefault();
      const { form, onDataSaved } = this.props;
      form.validateFields(async (err, values) => {
        if (!err) {
          const method = 'POST';
          const postData = Object.assign({}, values);
          postData.username = values.phone;
          const result = await request('/client/add', { method, body: postData });
          if (result.status === 'success') {
            notification.success({
              message: 'Thành Công',
              description: 'Thêm shop thành công',
            });
            onDataSaved();
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
    render() {
      const { form: { getFieldDecorator, getFieldValue } } = this.props;
      const receiverAddress = getFieldValue('address');
      const receiverProps = {
        value: receiverAddress || '',
        onChange: this.onChangeReceiverAddress,
        type: 'search',
        placeholder: 'Địa chỉ người nhận',
      };
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="Tên Shop">
            {getFieldDecorator('name', { rules: [{ required: true }] })(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="Người liên hệ">
            {getFieldDecorator('contactName', { rules: [{ required: true }] })(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="SĐT">
            {getFieldDecorator('phone', { rules: [{ required: true }] })(
              <Input placeholder="User đăng nhập" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="Mật khẩu">
            {getFieldDecorator('password', { rules: [{ required: true }] })(
              <Input type="password" placeholder="Mật khẩu đăng nhập" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="Email">
            {getFieldDecorator('email', { rules: [{ required: true }] })(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="Địa chỉ">
            {getFieldDecorator('address', { rules: [{ required: true }] })(
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
                  {getFieldDecorator('district', {
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
                  {getFieldDecorator('ward', {
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
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">Tạo</Button>
            <Button
              onClick={() => this.props.closeShowModal()}
              style={{ marginLeft: 8 }}
              type="danger"
            >
              Hủy
            </Button>
          </FormItem>
        </Form>
      );
    }
}

const x = Form.create({
  mapPropsToFields() {
    return {};
  },
})(FormAddShop);
export default x;
