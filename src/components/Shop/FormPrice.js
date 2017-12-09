import React from 'react';
import { Form } from 'antd';

class FormPrice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        xx
      </Form>
    );
  }
}
const x = Form.create({
  mapPropsToFields(props) {
    const { data } = props;
    let result = {
      name: Form.createFormField({ value: '' }),
      userName: Form.createFormField({ value: '' }),
    };
    if (data) {
      result = {
        name: Form.createFormField({ value: data.name }),
        userName: Form.createFormField({ value: data.userName }),
      };
    }
    return result;
  },
})(FormPrice);
export default x;
