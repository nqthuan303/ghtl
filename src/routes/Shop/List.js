import React, { Component } from 'react';
import { Card, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './List.less';
import StandardTable from '../../components/StandardTable';
// import request from '../../utils/request';


const columns = [
  {
    title: 'STT',
    dataIndex: 'no',
  },
  {
    title: 'Tên shop',
    dataIndex: 'name',
  },
  {
    title: 'SĐT',
    dataIndex: 'phone',
    sorter: true,
    align: 'right',
  },
  {
    title: 'Địa chỉ',
    dataIndex: 'address',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    sorter: true,
  },
  {
    title: 'Ngày đăng ký',
    dataIndex: 'createdAt',
    sorter: true,
  },
  {
    title: 'Hoạt động',
    render: () => (
      <div>
        <a href="">配置</a>
        <Divider type="vertical" />
        <a href="">订阅警报</a>
      </div>
    ),
  },
];

class ShopList extends Component {
  componentDidMount() {
    // this.getList();
  }

  // async getList() {
  //   // const result = await request('/client/list');
  //   // result;
  // }

  render() {
    return (
      <PageHeaderLayout title="Danh sách shop">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <StandardTable
              columns={columns}
              selectedRows={[]}
              data={[]}
            />
          </div>
        </Card>


      </PageHeaderLayout>

    );
  }
}

export default ShopList;
