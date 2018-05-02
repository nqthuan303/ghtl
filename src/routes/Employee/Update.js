import React from 'react';
import {
  Row,
  Col,
  Button,
  Input,
  Form,
  DatePicker,
  // Modal,
  // Badge,
  notification,
} from 'antd';
import moment from 'moment';
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import globalStyle from '../../index.less';
// import { order as orderStatus, orderPayBy } from '../../constants/status';
import request from '../../utils/request';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 6 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
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
const dateFormat = 'YYYY-MM-DD';

class Update extends React.Component {
  constructor(props) {
    super(props);
    this.employeeId = this.props.match.params.id;
  }

  componentDidMount() {
    this.getEmployee();
  }
  onClickBlack = () => {
    const { history } = this.props;
    history.push('/employee/list');
  }
  onChangeAddress = (address) => {
    this.props.form.setFieldsValue({ address });
  }
  onSelectReceiverAddress = (address) => {
    geocodeByAddress(address, (err) => {
      if (err) { return; }
      this.props.form.setFieldsValue({ address });
    });
  }
  async getEmployee() {
    const data = await request(`/user/findOne/${this.employeeId}`);
    if (data && data.data) {
      const employee = data.data;
      this.props.form.setFieldsValue({
        name: employee.name,
        username: employee.username,
        password: employee.password,
        birthday: moment(employee.birthday),
        identityCard: employee.identityCard,
        identityCardDate: moment(employee.identityCardDate),
        address: employee.address,
        email: employee.email,
        phone: employee.phone,
        status: employee.status,
        bankNumber: employee.bankNumber,
        bankAccount: employee.bankAccount,
        bankBranch: employee.bankBranch,
        bankName: employee.bankName,
      });
    } else {
      const { history } = this.props;
      history.push('/employee/list');
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields(async (err, values) => {
      if (!err) {
        const method = 'PUT';
        const postData = Object.assign({}, values);
        const result = await request(`/user/update/${this.employeeId}`, { method, body: postData });
        if (result.status === 'success') {
          notification.success({
            message: 'Thành Công',
            description: result.data,
          });
          const { history } = this.props;
          history.push('/employee/list');
        }
      }
    });
  }
  render() {
    const { form } = this.props;

    const { getFieldDecorator, getFieldValue } = form;
    const receiverAddress = getFieldValue('address');

    const receiverProps = {
      value: receiverAddress || '',
      onChange: this.onChangeAddress,
      type: 'search',
      placeholder: 'Địa chỉ người nhận',
    };
    return (
      <PageHeaderLayout title="Tạo bảng">
        <Form onSubmit={this.handleSubmit} className={globalStyle.appContent}>
          <Row gutter={12}>
            <Col span={12}>
              <p style={{ fontWeight: 'bold' }}>1. Thông tin liên hệ</p>
              <FormItem {...formItemLayout} label="Họ Tên">
                {getFieldDecorator('name', {
                  rules: [{ required: true }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="Số điện thoại">
                {getFieldDecorator('phone', {
                  rules: [{ required: true }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="Địa chỉ">
                {getFieldDecorator('address', {
                  rules: [{ required: true }],
                })(
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
                {getFieldDecorator('email', {
                  rules: [{ required: true }],
                })(
                  <Input />
                )}
              </FormItem>
              <p style={{ fontWeight: 'bold' }}>2. Thông tin cá nhân</p>
              <FormItem
                {...formItemLayout}
                label="Ngày sinh"
              >
                {getFieldDecorator('birthday')(
                  <DatePicker format={dateFormat} />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="CMND">
                {getFieldDecorator('identityCard', {
                  rules: [{ required: false }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="Ngày cấp"
              >
                {getFieldDecorator('identityCardDate')(
                  <DatePicker format={dateFormat} />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <p style={{ fontWeight: 'bold' }}>3. Thông tin tài khoản</p>
              <FormItem {...formItemLayout} label="Username">
                {getFieldDecorator('username', {
                  rules: [{ required: true }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="Password">
                {getFieldDecorator('password', {
                  rules: [{ required: false }],
                })(
                  <Input type="password" />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="Trạng thái">
                {getFieldDecorator('status', {
                  rules: [{ required: true }],
                })(
                  <Input />
                )}
              </FormItem>
              <p style={{ fontWeight: 'bold' }}>4. Tài khoản ngân hàng</p>
              <FormItem {...formItemLayout} label="Ngân hàng">
                {getFieldDecorator('bankName', {
                  rules: [{ required: false }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="Chi nhánh">
                {getFieldDecorator('bankBranch', {
                  rules: [{ required: false }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="Chủ tài khoản">
                {getFieldDecorator('bankAccount', {
                  rules: [{ required: false }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="Số tài khoản">
                {getFieldDecorator('bankNumber', {
                  rules: [{ required: false }],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
          </Row>
          <FormItem style={{ textAlign: 'center' }}>
            <Button style={{ marginRight: 5 }} onClick={this.onClickBlack}>Quay Lại</Button>
            <Button type="primary" htmlType="submit">Cập Nhật</Button>
          </FormItem>
        </Form>
      </PageHeaderLayout>
    );
  }
}

const x = Form.create({
  mapPropsToFields() {
    return {};
  },
})(Update);
export default x;
