
import React from 'react';
import { Form, Input, Col, Button, Select, Row, Radio } from 'antd';
import globalStyle from '../../index.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

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

const createFormOpt = {
  onFieldsChange(props, changedFields) {
    props.onFormChange(changedFields);
  },
};

function onSubmit(e, props) {
  e.preventDefault();
  const { validateFields } = props.form;
  validateFields(async (err, values) => {
    if (!err) {
      props.handleSubmit(values);
    }
  });
}

function createForm(props) {
  const { getFieldDecorator } = props.form;
  return (
    <Form onSubmit={e => onSubmit(e, props)} className={globalStyle.appContent}>
      <Row gutter={12}>
        <Col span={4}>
          <FormItem>
            {getFieldDecorator('client', {
              rules: [{ required: true }],
            })(
              <Select
                showSearch
                placeholder="Người gửi"
                optionFilterProp="children"
              >
                {props.renderClientOption()}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem>
            {getFieldDecorator('sender.phoneNumbers', {
              rules: [{ required: true }],
            })(
              <Input placeholder="SĐT người gửi" />
            )}
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem>
            {getFieldDecorator('sender.address', {
              rules: [{ required: true }],
            })(
              <Input placeholder="Địa chỉ người gửi" />
            )}
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem>
            {getFieldDecorator('sender.district', {
              rules: [{ required: true }],
            })(
              <Select
                showSearch
                placeholder="Quận/Huyện"
                optionFilterProp="children"
              >
                {props.renderDistrictOption()}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem>
            {getFieldDecorator('sender.paymentMethod', {
              rules: [{ required: true }],
            })(
              <Select
                placeholder="Hình thức"
                optionFilterProp="children"
              >
                <Option key="cod" value="cod">COD</Option>
                <Option key="ung" value="ung">Ứng</Option>
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem>
            <Button>Kết thúc</Button>
          </FormItem>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col span={12}>
          <p style={{ fontWeight: 'bold' }}>1. Người nhận</p>
          <FormItem {...formItemLayout} label="Số điện thoại">
            {getFieldDecorator('receiver.phone', {
              rules: [{ required: true }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="Họ tên">
            {getFieldDecorator('receiver.name', {
              rules: [{ required: true }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="Địa chỉ">
            {getFieldDecorator('receiver.address', {
              rules: [{ required: true }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem colon={false} {...formItemLayout} label=" ">
            <Row gutter={12}>
              <Col span={12}>
                <FormItem>
                  {getFieldDecorator('receiver.district', {
                    rules: [{ required: true }],
                  })(
                    <Select
                      showSearch
                      placeholder="Quận/Huyện"
                      optionFilterProp="children"
                    >
                      {props.renderDistrictOption()}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem>
                  {getFieldDecorator('receiver.ward', {
                    rules: [{ required: true }],
                  })(
                    <Select
                      showSearch
                      placeholder="Phường/Xã"
                      optionFilterProp="children"
                    >
                      {props.renderDistrictOption()}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
          </FormItem>
          <p style={{ fontWeight: 'bold' }}>2. Hàng hóa</p>
          <FormItem {...formItemLayout} label="Khối lượng">
            {getFieldDecorator('goods.weight', {
              rules: [{ required: false }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="Qui đổi">
            <Row gutter={12}>
              <Col span={8}>
                <FormItem>
                  {getFieldDecorator('goods.length', {
                    rules: [{ required: false }],
                  })(
                    <Input placeholder="Dài" />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  {getFieldDecorator('goods.width', {
                    rules: [{ required: false }],
                  })(
                    <Input placeholder="Rộng" />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  {getFieldDecorator('goods.height', {
                    rules: [{ required: false }],
                  })(
                    <Input placeholder="Cao" />
                  )}
                </FormItem>
              </Col>
            </Row>
          </FormItem>
          <FormItem {...formItemLayout} label="Yêu cầu">
            {getFieldDecorator('require', {
              rules: [{ required: false }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="Ghi chú">
            {getFieldDecorator('note', {
              rules: [{ required: false }],
            })(
              <TextArea rows={4} />
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <p style={{ fontWeight: 'bold' }}>3. Cước phí</p>
          <FormItem {...formItemLayout} label="Phí phụ">
            {getFieldDecorator('bonusFee', {
              rules: [{ required: false }],
            })(
              <Input />
            )}
          </FormItem>
          <Row gutter={8}>
            <Col style={{ textAlign: 'right', color: '#000000' }} span={6}>Phí vận chuyển:</Col>
            <Col span={18}> {props.shipFee}</Col>
          </Row>
          <Row gutter={8}>
            <Col style={{ textAlign: 'right', color: '#000000' }} span={6}>Cước phí: </Col>
            <Col span={18}> 0</Col>
          </Row>
          <br />
          <p style={{ fontWeight: 'bold' }}>4. Thu tiền</p>
          <FormItem {...formItemLayout} label="Tiền hàng">
            {getFieldDecorator('require', {
              rules: [{ required: false }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="Trả cước">
            <Row gutter={12}>
              <Col span={8}>
                <FormItem>
                  {getFieldDecorator('require', {
                    rules: [{ required: false }],
                  })(
                    <Radio>Người gửi</Radio>
                  )}
                </FormItem>
              </Col>
              <Col span={16}>
                <FormItem>
                  {getFieldDecorator('require', {
                    rules: [{ required: false }],
                  })(
                    <Radio>Người nhận</Radio>
                  )}
                </FormItem>
              </Col>
            </Row>
          </FormItem>
          <FormItem {...formItemLayout} label="Thu khách">
            0
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button style={{ marginRight: 5 }} type="primary" htmlType="submit">Tạo vận đơn</Button>
            <Button>Quay lại</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  );
}

export const FormOrderRenderer = Form.create(createFormOpt)(createForm);
