import React from 'react';
import { Form, Button, Col, Input, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

const tailFormItemLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 18, offset: 3 },
  },
};

class FormPrice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  onCancelModal = () => {
    const { onCancelModal } = this.props;
    onCancelModal();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { form, onFormSubmit } = this.props;
    form.validateFields(async (err, values) => {
      if (!err) {
        onFormSubmit(values);
      }
    });
  }

  filterOption = (input, option) => {
    const { props: { children } } = option;
    return children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

  renderOption() {
    const { districts } = this.props;
    return districts.map((district) => {
      return (
        <Option key={district.value} value={district.value}>{district.text}</Option>
      );
    });
  }

  render() {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...tailFormItemLayout}>
          <Col span={11}>
            <FormItem>
              {getFieldDecorator('area', {
                rules: [{ required: true }],
              })(
                <Input placeholder="Khu vực" />
              )}
            </FormItem>
          </Col>
          <Col span={2}>
            <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }} />
          </Col>
          <Col span={11}>
            <FormItem>
              {getFieldDecorator('price', {
                rules: [{ required: true }],
              })(
                <Input placeholder="Gói cước" />
              )}
            </FormItem>
          </Col>
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          {getFieldDecorator('districts', {
            rules: [{ required: true }],
          })(
            <Select
              showSearch
              mode="multiple"
              placeholder="Quận/Huyện"
              optionFilterProp="children"
              filterOption={this.filterOption}
            >
              {this.renderOption()}
            </Select>
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">Lưu lại</Button>
          <Button
            onClick={this.onCancelModal}
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
    const { data } = props;
    return {
      area: Form.createFormField({ value: data.area }),
      price: Form.createFormField({ value: data.price }),
      districts: Form.createFormField({ value: data.districts }),
    };
  },
})(FormPrice);
export default x;
