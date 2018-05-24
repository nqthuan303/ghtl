import React from 'react';
import {
  Button, Form,
  Input, DatePicker,
} from 'antd';
import moment from 'moment';
import { withRouter } from 'react-router';

import { generateQueryString } from '../../utils/utils';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class SearchOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  handleSearch= (e) => {
    e.preventDefault();
    const { form: { validateFields } } = this.props;
    validateFields((err, values) => {
      if (!err) {
        const objQuery = Object.assign({}, values);
        if (values.createdDate) {
          const createdDate = this.generateDate(values.createdDate);
          objQuery.createdDate = createdDate;
        }
        const queryStr = generateQueryString(objQuery);
        this.props.history.push({
          pathname: '/order/list',
          search: queryStr,
        });
      }
    });
  }
  clearSearch = () => {
    this.props.history.push({
      pathname: '/order/list',
      search: 'orderstatus=all',
    });
  }
  generateDate(dates) {
    const result = [];
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const strDate = date.format('YYYY-MM-DD');
      result.push(strDate);
    }
    return result;
  }
  render() {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Form layout="inline" onSubmit={this.handleSearch}>
        <FormItem>
          {getFieldDecorator('orderId', {
            rules: [{ required: false }],
          })(
            <Input placeholder="Mã vận đơn" />
          )}
          {getFieldDecorator('orderstatus', {
            rules: [{ required: false }],
          })(
            <Input type="hidden" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('senderNameOrPhone', {
            rules: [{ required: false }],
          })(
            <Input placeholder="Tên/SĐT người gửi" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('receiverNameOrPhone', {
            rules: [{ required: false }],
          })(
            <Input placeholder="Tên/SĐT người nhận" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('createdDate', {
            rules: [{ required: false }],
          })(
            <RangePicker
              format="DD-MM-YYYY"
              placeholder={['Từ ngày', 'Đến ngày']}
            />
          )}
        </FormItem>
        <FormItem>
          <Button style={{ marginRight: 8 }} htmlType="submit" type="primary" icon="search">Tìm</Button>
          <Button onClick={this.clearSearch} style={{ marginRight: 8 }} type="danger" icon="close">Hủy tìm</Button>
          <Button htmlType="button" icon="export">Xuất file</Button>
        </FormItem>
      </Form>
    );
  }
}

export default withRouter(Form.create({
  mapPropsToFields(props) {
    const { objSearch } = props;
    const result = {
      orderId: Form.createFormField({ value: '' }),
      orderStatus: Form.createFormField({ value: '' }),
      senderNameOrPhone: Form.createFormField({ value: '' }),
      receiverNameOrPhone: Form.createFormField({ value: '' }),
      createdDate: Form.createFormField({ value: '' }),
    };
    if (Object.keys(objSearch).length > 0) {
      for (const key in objSearch) {
        if (Object.prototype.hasOwnProperty.call(objSearch, key) && objSearch[key]) {
          let value = objSearch[key];
          if (key === 'createdDate') {
            value = [];
            const arrCreatedDate = objSearch[key].split(',');
            for (let i = 0; i < arrCreatedDate.length; i++) {
              const objDate = moment(arrCreatedDate[i]);
              value.push(objDate);
            }
          }
          result[key] = Form.createFormField({ value });
        }
      }
    }
    return result;
  },
})(SearchOrder));

