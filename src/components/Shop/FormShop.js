import React from 'react';
import { Form, Input, Col, Select, Card, Row, Button } from 'antd';
import request from '../../utils/request';
import styles from './FormShop.less';
import globalStyle from '../../index.less';


const { Option } = Select;

const FormItem = Form.Item;

class FormShop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      districts: [],
    };
  }

  componentDidMount() {
    this.getDistricts();
  }

  async getDistricts() {
    const districts = await request('/district/listForSelect');
    this.setState({ districts });
  }

  filterOption = (input, option) => {
    const { props: { children } } = option;
    return children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { form, onDataSaved, data } = this.props;
    form.validateFields(async (err, values) => {
      if (!err) {
        const opt = {
          method: 'POST',
          body: { ...values, _id: data._id },
        };
        const url = data._id ? `/client/update/${data._id}` : '/client/add';
        const result = await request(url, opt);
        const { data: resData } = result;
        let notice = {
          type: 'success',
          message: 'Lưu thông tin shop thành công!',
        };
        if (result.status !== 'success') {
          notice = {
            type: 'error',
            message: resData.message,
          };
        }
        onDataSaved(notice, resData);
      }
    });
  }

  renderOption() {
    const { districts } = this.state;
    return districts.map((district) => {
      return (
        <Option key={district.value} value={district.value}>{district.text}</Option>
      );
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form className={globalStyle.appContent} onSubmit={this.handleSubmit}>
        <Row gutter={16}>
          <Col span={12}>
            <Card className={styles.shopCardContainer01} title={<h4>Thông tin liên hệ</h4>}>
              <FormItem>
                <Col span={11}>
                  <FormItem>
                    {getFieldDecorator('name', {
                      rules: [{ required: true }],
                    })(
                      <Input placeholder="Tên shop" />
                    )}
                  </FormItem>
                </Col>
                <Col span={2}>
                  <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }} />
                </Col>
                <Col span={11}>
                  <FormItem>
                    {getFieldDecorator('contactName', {
                      rules: [{ required: true }],
                    })(
                      <Input placeholder="Người đại diện" />
                    )}
                  </FormItem>
                </Col>
              </FormItem>
              <FormItem>
                {getFieldDecorator('phone', {
                  rules: [{ required: true }],
                })(
                  <Input placeholder="Số điện thoại" />
                )}
              </FormItem>
              <FormItem>
                <Col span={11}>
                  <FormItem>
                    {getFieldDecorator('address', {
                      rules: [{ required: true }],
                    })(
                      <Input placeholder="Địa chỉ" />
                    )}
                  </FormItem>
                </Col>
                <Col span={2}>
                  <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }} />
                </Col>
                <Col span={11}>
                  <FormItem>
                    {getFieldDecorator('district', {
                      rules: [{ required: true }],
                    })(
                      <Select
                        showSearch
                        placeholder="Quận/Huyện"
                        optionFilterProp="children"
                        filterOption={this.filterOption}
                      >
                        {this.renderOption()}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </FormItem>
              <FormItem>
                {getFieldDecorator('descriptionOfGoods', {
                  rules: [{ required: false }],
                })(
                  <Input placeholder="Mô tả hàng" />
                )}
              </FormItem>
            </Card>
          </Col>
          <Col span={12}>
            <Card className={styles.shopCardContainer01} title={<h4>Thông tin tài khoản</h4>}>
              <FormItem>
                <Col span={11}>
                  <FormItem>
                    {getFieldDecorator('username', {
                      rules: [{ required: true }],
                    })(
                      <Input placeholder="Tên đăng nhập" />
                    )}
                  </FormItem>
                </Col>
                <Col span={2}>
                  <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }} />
                </Col>
                <Col span={11}>
                  <FormItem>
                    {getFieldDecorator('password', {
                      rules: [{ required: true }],
                    })(
                      <Input type="password" placeholder="Mật khẩu" />
                    )}
                  </FormItem>
                </Col>
              </FormItem>

              <FormItem>
                {getFieldDecorator('status', {
                  rules: [{ required: true }],
                })(
                  <Select>
                    <Option value="active">Hoạt động</Option>
                    <Option value="inactive">Không hoạt động</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem>
                <Col span={11}>
                  <FormItem>
                    {getFieldDecorator('email', {
                      rules: [{
                        required: true,
                        pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$',
                      }],
                    })(
                      <Input placeholder="Email" />
                    )}
                  </FormItem>
                </Col>
                <Col span={2}>
                  <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }} />
                </Col>
                <Col span={11}>
                  <FormItem>
                    {getFieldDecorator('website', {
                      rules: [{ required: false }],
                    })(
                      <Input placeholder="Website" />
                    )}
                  </FormItem>
                </Col>
              </FormItem>
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Card className={styles.shopCardContainer01} title={<h4>Tài khoản ngân hàng</h4>}>
              <FormItem>
                <Col span={11}>
                  <FormItem>
                    {getFieldDecorator('bankName', {
                      rules: [{ required: false }],
                    })(
                      <Input placeholder="Ngân hàng" />
                    )}
                  </FormItem>
                </Col>
                <Col span={2}>
                  <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }} />
                </Col>
                <Col span={11}>
                  <FormItem>
                    {getFieldDecorator('bankBranch', {
                      rules: [{ required: false }],
                    })(
                      <Input placeholder="Chi nhánh" />
                    )}
                  </FormItem>
                </Col>
              </FormItem>

              <FormItem>
                <Col span={11}>
                  <FormItem>
                    {getFieldDecorator('bankAccount', {
                      rules: [{ required: false }],
                    })(
                      <Input placeholder="Chủ tài khoản" />
                    )}
                  </FormItem>
                </Col>
                <Col span={2}>
                  <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }} />
                </Col>
                <Col span={11}>
                  <FormItem>
                    {getFieldDecorator('bankNumber', {
                      rules: [{ required: false }],
                    })(
                      <Input placeholder="Số tài khoản" />
                    )}
                  </FormItem>
                </Col>
              </FormItem>
            </Card>
          </Col>
          <Col span={12}>
            <Card className={styles.shopCardContainer01} title={<h4>Hình thức thanh toán</h4>} />
            <div style={{ paddingLeft: '5px' }}>
              <FormItem>
                <Button style={{ marginRight: '10px' }} type="primary" htmlType="submit">Lưu lại</Button>
                <Button htmlType="submit">Quay lại</Button>
              </FormItem>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}
const x = Form.create({
  mapPropsToFields(props) {
    const { data } = props;
    let result = {
      name: Form.createFormField({ value: '' }),
      username: Form.createFormField({ value: '' }),
      email: Form.createFormField({ value: '' }),
      password: Form.createFormField({ value: '' }),
      website: Form.createFormField({ value: '' }),
      contactName: Form.createFormField({ value: '' }),
      phone: Form.createFormField({ value: '' }),
      address: Form.createFormField({ value: '' }),
      district: Form.createFormField({ value: '' }),
      descriptionOfGoods: Form.createFormField({ value: '' }),
      bankName: Form.createFormField({ value: '' }),
      bankBranch: Form.createFormField({ value: '' }),
      bankAccount: Form.createFormField({ value: '' }),
      bankNumber: Form.createFormField({ value: '' }),
      status: Form.createFormField({ value: '' }),
    };
    if (data) {
      result = {
        name: Form.createFormField({ value: data.name }),
        username: Form.createFormField({ value: data.username }),
        email: Form.createFormField({ value: data.email }),
        password: Form.createFormField({ value: data.password }),
        website: Form.createFormField({ value: data.website }),
        contactName: Form.createFormField({ value: data.contactName }),
        phone: Form.createFormField({ value: data.phone }),
        address: Form.createFormField({ value: data.address }),
        district: Form.createFormField({ value: data.district }),
        descriptionOfGoods: Form.createFormField({ value: data.descriptionOfGoods }),
        bankName: Form.createFormField({ value: data.bankName }),
        bankBranch: Form.createFormField({ value: data.bankBranch }),
        bankAccount: Form.createFormField({ value: data.bankAccount }),
        bankNumber: Form.createFormField({ value: data.bankNumber }),
        status: Form.createFormField({ value: data.status }),
      };
    }
    return result;
  },
})(FormShop);
export default x;
