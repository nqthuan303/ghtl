import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input, Select, notification } from 'antd';
import { paymentMethods } from '../../constants/status';
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


class FormPaymentMethod extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    action: PropTypes.string.isRequired,
    onDataSaved: PropTypes.func.isRequired,
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { form, data, action, onDataSaved } = this.props;
    form.validateFields(async (err, values) => {
      if (!err) {
        const body = {
          method: values.method,
          money: data.money,
        };
        if (values.method === paymentMethods.TRANSFER.value) {
          body.bank = values.bank;
          body.bill = values.bill;
        }
        let description = 'Cập nhật bảng kê thành công!!!';
        let url = `/payment/update/${data.paymentId}`;
        if (action === 'donePayment') {
          url = `/payment/payment-done/${data.paymentId}`;
          description = 'Bảng kê đã được thanh toán thành công!!!';
        }
        const result = await request(url, { method: 'POST', body });
        if (result.status === 'success') {
          notification.success({
            message: 'Thành Công',
            description,
          });
          onDataSaved(result.data);
        } else {
          notification.error({
            message: 'Lỗi',
            description: result.data.msg,
          });
        }
      }
    });
  }
  render() {
    const { form: { getFieldDecorator, getFieldValue }, data } = this.props;
    const method = getFieldValue('method') ? getFieldValue('method') : paymentMethods.TRANSFER.value;
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="Tổng tiền" >
          {data.money}
        </FormItem>
        <FormItem {...formItemLayout} label="Hình thức" >
          {getFieldDecorator('method', {
            rules: [{ required: true }],
            initialValue: paymentMethods.TRANSFER.value,
          })(
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={this.filterOption}
            >
              <Option key={paymentMethods.TRANSFER.value} value={paymentMethods.TRANSFER.value}>
                {paymentMethods.TRANSFER.name}
              </Option>
              <Option key={paymentMethods.CASH.value} value={paymentMethods.CASH.value}>
                {paymentMethods.CASH.name}
              </Option>
            </Select>
          )}
        </FormItem>
        { method === paymentMethods.TRANSFER.value ?
          <FormItem {...formItemLayout} label="Mã giao dịch" >
            {getFieldDecorator('bill', {
              rules: [{ required: true }],
            })(
              <Input />
            )}
          </FormItem> : ''}
        { method === paymentMethods.TRANSFER.value ?
          <FormItem {...formItemLayout} label="Ngân hàng" >
            {getFieldDecorator('bank', {
              rules: [{ required: true }],
            })(
              <Select
                showSearch
                placeholder="Chọn ngân hàng"
                optionFilterProp="children"
                filterOption={this.filterOption}
              >
                <Option key="Techcombank" value="Techcombank">Techcombank - Ngân hàng TMCP Kỹ thương Việt Nam</Option>
                <Option key="VPBank" value="VpBank">VPBank - Ngân hàng VN Thịnh Vượng</Option>
              </Select>
            )}
          </FormItem> : '' }
        <FormItem {...tailFormItemLayout}>
          <Button htmlType="submit" type="primary">Xác Nhận</Button>
          <Button style={{ marginLeft: 8 }}>Hủy</Button>
        </FormItem>
      </Form>
    );
  }
}

const componentWithForm = Form.create({
  mapPropsToFields(props) {
    const { data } = props;
    const result = {};
    if (data.method) {
      result.method = Form.createFormField({ value: data.method });
    }
    if (data.method === paymentMethods.TRANSFER.value) {
      result.bill = Form.createFormField({ value: data.bill });
      result.bank = Form.createFormField({ value: data.bank });
    }
    return result;
  },
})(FormPaymentMethod);
export default componentWithForm;
