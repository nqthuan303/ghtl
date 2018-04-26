import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete';
import { Form, Button, Input, notification, Select } from 'antd';
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

class FormEmployee extends Component {
    static propTypes = {
      closeShowModal: PropTypes.func.isRequired,
    }
    constructor(props) {
      super(props);
      this.state = {
        roles: [],
      };
    }
    componentDidMount() {
      this.getRolo();
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
    async getRolo() {
      const result = await request('/role/list');
      if (result.status === 'success') {
        this.setState({ roles: result.data });
      }
    }
    handleSubmit = (e) => {
      e.preventDefault();
      const { form, onDataSaved } = this.props;
      form.validateFields(async (err, values) => {
        if (!err) {
          const method = 'POST';
          const postData = Object.assign({}, values);
          postData.username = values.phone;
          const result = await request('/user/add', { method, body: postData });
          if (result.status === 'success') {
            notification.success({
              message: 'Thành Công',
              description: result.data,
            });
            onDataSaved();
          }
        }
      });
    }
    renderRole() {
      const { roles } = this.state;
      const result = [];
      for (let i = 0; i < roles.length; i += 1) {
        result.push(
          <Option key={i} value={roles[i]._id}>{roles[i].name}</Option>
        );
      }
      return result;
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
          <FormItem {...formItemLayout} label="Tên">
            {getFieldDecorator('name', { rules: [{ required: true }] })(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="SĐT">
            {getFieldDecorator('phone', { rules: [{ required: true }] })(
              <Input placeholder="user đăng nhập" />
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
          <FormItem {...formItemLayout} label="Email">
            {getFieldDecorator('email', { rules: [{ required: true }] })(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="Vai Trò">
            {getFieldDecorator('role', { rules: [{ required: true }] })(
              <Select
                showSearch
                placeholder="Chọn vai trò"
                optionFilterProp="children"
                filterOption={
                  (input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {this.renderRole()}
              </Select>
            )}
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
})(FormEmployee);
export default x;
