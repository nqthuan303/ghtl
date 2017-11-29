import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Button, Icon, Alert } from 'antd';
import styles from './Login.less';

const FormItem = Form.Item;

@connect(state => ({
  login: state.login,
}))
@Form.create()
export default class Login extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.login.status === 'ok') {
      this.props.dispatch(routerRedux.push('/'));
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields({ force: true },
      (err, values) => {
        if (!err) {
          this.props.dispatch({
            type: 'login/AccountSubmit',
            payload: values,
          });
        }
      }
    );
  }

  renderMessage = (message) => {
    return (
      <Alert
        style={{ marginBottom: 24 }}
        message={message}
        type="error"
        showIcon
      />
    );
  }

  render() {
    const { form, login } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
          {
            login.status === 'error' &&
            login.submitting === false &&
            this.renderMessage('Tài khoản hoặc mật khẩu không đúng!')
          }
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
