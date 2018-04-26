import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input, notification } from 'antd';
import request from '../../utils/request';

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


class FormBill extends Component {
    static propTypes = {
      payment: PropTypes.object.isRequired,
      closeShowModalBill: PropTypes.func.isRequired,
    }
    handleSubmit = (e) => {
      e.preventDefault();
      const { form, onDataSaved, payment } = this.props;
      form.validateFields(async (err, values) => {
        if (!err) {
          const method = 'PUT';
          const result = await request(`/payment/update/${payment._id}`, { method, body: { bill: values.bill } });
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
    render() {
      const { form: { getFieldDecorator } } = this.props;
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="Mã giao dịch">
            {getFieldDecorator('bill', {
              rules: [{ required: true }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">Cập nhật</Button>
            <Button
              onClick={() => this.props.closeShowModalBill()}
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
  mapPropsToFields(props) {
    const { payment } = props;
    return {
      bill: Form.createFormField({ value: payment.bill }),
    };
  },
})(FormBill);
export default x;
