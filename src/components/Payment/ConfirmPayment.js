import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input, Select, notification } from 'antd';
import { withRouter } from 'react-router';
import { paymentType } from '../../constants/status';
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


class ConfirmPayment extends Component {
  static propTypes = {
    totalMoneyNeedToBePaid: PropTypes.number.isRequired,
    paymentId: PropTypes.string.isRequired,
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { form, totalMoneyNeedToBePaid, paymentId } = this.props;
    form.validateFields(async (err, values) => {
      if (!err) {
        const body = {
          paymentId,
          type: values.type,
          money: totalMoneyNeedToBePaid,
        };
        if (values.type === paymentType.TRANSFER.value) {
          body.bank = values.bank;
          body.bill = values.bill;
        }
        const result = await request(
          '/payment/payment-done',
          { method: 'POST', body },
        );
        if (result.status === 'success') {
          notification.success({
            message: 'Thành Công',
            description: result.data,
          });
          const { history } = this.props;
          history.push('/payment/list');
        } else {
          notification.error({
            message: 'Xãy ra lỗi',
            description: result.data.msg,
          });
        }
      }
    });
  }
  render() {
    const { form: { getFieldDecorator, getFieldValue }, totalMoneyNeedToBePaid } = this.props;
    const type = getFieldValue('type') ? getFieldValue('type') : paymentType.TRANSFER.value;
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="Tổng tiền" >
          {totalMoneyNeedToBePaid}
        </FormItem>
        <FormItem {...formItemLayout} label="Hình thức" >
          {getFieldDecorator('type', {
            rules: [{ required: true }],
            initialValue: paymentType.TRANSFER.value,
          })(
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={this.filterOption}
            >
              <Option key={paymentType.TRANSFER.value} value={paymentType.TRANSFER.value}>
                {paymentType.TRANSFER.name}
              </Option>
              <Option key={paymentType.CASH.value} value={paymentType.CASH.value}>
                {paymentType.CASH.name}
              </Option>
            </Select>
          )}
        </FormItem>
        { type === paymentType.TRANSFER.value ?
          <FormItem {...formItemLayout} label="Mã giao dịch" >
            {getFieldDecorator('bill', {
              rules: [{ required: true }],
            })(
              <Input />
            )}
          </FormItem> : ''}
        { type === paymentType.TRANSFER.value ?
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
  mapPropsToFields() {
    return { };
  },
})(ConfirmPayment);
const componentWithRouter = withRouter(componentWithForm);
export default componentWithRouter;
