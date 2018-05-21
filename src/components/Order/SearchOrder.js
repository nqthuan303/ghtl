import React from 'react';
import {
  Button, Form,
  Input, DatePicker,
} from 'antd';
import moment from 'moment';

import { withRouter } from 'react-router';

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
    const { form, onSearch } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const objQuery = Object.assign({}, values);
        if (values.createdDate) {
          const createdDate = this.generateDate(values.createdDate);
          objQuery.createdDate = createdDate;
        }
        const queryStr = this.serialize(objQuery);
        this.props.history.push({
          pathname: '/order/list',
          search: queryStr,
        });
        onSearch();
      }
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
  serialize(obj) {
    const str = [];
    for (const p in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, p)) {
        if (obj[p]) {
          const url = `${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`;
          str.push(url);
        }
      }
    }
    return str.join('&');
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
        </FormItem>
        <FormItem>
          {getFieldDecorator('senderNameOrPhone', {
            rules: [{ required: false }],
          })(
            <Input placeholder="Tên/SĐT người gửi" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('senderAddress', {
            rules: [{ required: false }],
          })(
            <Input placeholder="Địa chỉ lấy hàng" />
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
      senderNameOrPhone: Form.createFormField({ value: '' }),
      senderAddress: Form.createFormField({ value: '' }),
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

