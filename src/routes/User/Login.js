import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Icon, notification } from 'antd';
import styles from './Login.less';
import request from '../../utils/request';

const FormItem = Form.Item;

@connect(state => ({
  login: state.login,
}))
@Form.create()
export default class Login extends Component {
  componentWillMount() {
    const token = localStorage.getItem('token');
    if (token) {
      const { history } = this.props;
      history.push('');
    }
  }
  async onLogin(data) {
    const opt = {
      method: 'POST',
      body: data,
    };
    const { history } = this.props;
    const result = await request('/user/login', opt);
    const { data: resData } = result;
    if (result.status === 'success') {
      const { token } = resData;
      const { info } = resData;
      localStorage.setItem('info', JSON.stringify(info));
      localStorage.setItem('token', token);
      history.push('');
    } else {
      notification.error({
        message: 'Đăng nhập không thành công!',
        description: resData.msg,
      });
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields({ force: true },
      (err, values) => {
        if (!err) {
          this.onLogin(values);
        }
      }
    );
  }

  render() {
    const { form, login } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('username', {
              rules: [{
                required: true, message: 'Vui lòng nhập tên đăng nhập!',
              }],
            })(
              <Input
                size="large"
                prefix={<Icon type="user" className={styles.prefixIcon} />}
                placeholder="admin"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: 'Vui lòng nhập mật khẩu!',
              }],
            })(
              <Input
                size="large"
                prefix={<Icon type="lock" className={styles.prefixIcon} />}
                type="password"
                placeholder="888888"
              />
            )}
          </FormItem>
          <FormItem className={styles.additional}>
            <a className={styles.forgot} href="">Quên mật khẩu</a>
            <Button size="large" loading={login.submitting} className={styles.submit} type="primary" htmlType="submit">
              Xác nhận
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
