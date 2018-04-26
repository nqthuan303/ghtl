import dynamic from 'dva/dynamic';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component,
});

// nav data
export const getNavData = app => [
  {
    component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    layout: 'BasicLayout',
    name: '首页', // for breadcrumb
    path: '/',
    children: [
      {
        name: 'Đơn hàng',
        showOnSideBar: true,
        icon: 'copy',
        path: 'order/list',
        component: dynamicWrapper(app, ['shop'], () => import('../routes/Order/List')),
      },
      {
        name: 'Thêm đơn hàng',
        showOnSideBar: false,
        path: 'order/add',
        component: dynamicWrapper(app, ['order'], () => import('../routes/Order/Add')),
      },
      {
        name: 'Chuyến đi lấy',
        showOnSideBar: true,
        icon: 'shrink',
        path: 'pickup/list',
        component: dynamicWrapper(app, ['order'], () => import('../routes/Pickup/List')),
      },
      {
        name: 'Chi tiết chuyến đi lấy',
        showOnSideBar: false,
        path: 'pickup/:id',
        component: dynamicWrapper(app, ['order'], () => import('../routes/Pickup/Detail')),
      },
      {
        name: 'Chuyến đi giao',
        showOnSideBar: true,
        icon: 'arrows-alt',
        path: 'delivery/list',
        component: dynamicWrapper(app, ['delivery'], () => import('../routes/Delivery/List')),
      },
      {
        name: 'Thêm Chuyến Đi Giao',
        showOnSideBar: false,
        path: 'delivery/add',
        component: dynamicWrapper(app, ['delivery'], () => import('../routes/Delivery/Add')),
      },
      {
        name: 'Cập Nhật Chuyến Đi Giao',
        showOnSideBar: false,
        path: 'delivery/update/:id',
        component: dynamicWrapper(app, ['delivery'], () => import('../routes/Delivery/Update')),
      },
      {
        name: 'Chuyến đi trả',
        showOnSideBar: true,
        icon: 'rollback',
        path: 'refund/list',
        component: dynamicWrapper(app, ['refund'], () => import('../routes/Refund/ListRefund')),
      },
      {
        name: 'Thêm Chuyến Đi Trả',
        showOnSideBar: false,
        path: 'refund/add',
        component: dynamicWrapper(app, ['refund'], () => import('../routes/Refund/AddRefund')),
      },
      {
        name: 'Thu tiền',
        showOnSideBar: true,
        icon: 'wallet',
        path: 'money/list',
        component: dynamicWrapper(app, ['money'], () => import('../routes/Money/List')),
      },
      {
        name: 'Lịch Sử',
        showOnSideBar: false,
        path: 'money/history',
        component: dynamicWrapper(app, ['money'], () => import('../routes/Money/History')),
      },
      {
        name: 'Thanh toán',
        showOnSideBar: true,
        icon: 'bank',
        path: 'payment/list',
        component: dynamicWrapper(app, ['payment'], () => import('../routes/Payment/List')),
      },
      {
        name: 'Tạo bảng',
        showOnSideBar: false,
        path: 'payment/add/:id',
        component: dynamicWrapper(app, ['payment'], () => import('../routes/Payment/Add')),
      },
      {
        name: 'Xác Nhận Thanh Toán',
        showOnSideBar: false,
        path: 'pay/:id',
        component: dynamicWrapper(app, ['payment'], () => import('../routes/Payment/Pay')),
      },
      {
        name: 'Lịch Sử',
        showOnSideBar: false,
        path: 'payment/history',
        component: dynamicWrapper(app, ['payment'], () => import('../routes/Payment/History')),
      },
      {
        name: 'Khách hàng',
        showOnSideBar: true,
        icon: 'shop',
        path: 'shop/list',
        component: dynamicWrapper(app, ['shop'], () => import('../routes/Shop/List')),
      },
      {
        name: 'Thông tin Shop',
        showOnSideBar: false,
        path: 'shop/info/:id',
        component: dynamicWrapper(app, ['shop'], () => import('../routes/Shop/Info')),
      },
      {
        name: 'Nhân Viên',
        showOnSideBar: true,
        icon: 'user',
        path: 'employee',
        children: [
          {
            name: 'Danh sách',
            showOnSideBar: true,
            path: 'list',
            component: dynamicWrapper(app, ['employee'], () => import('../routes/Employee/List')),
          },
        ],
      },
      {
        name: 'Exception',
        showOnSideBar: false,
        path: 'exception',
        icon: 'warning',
        children: [
          {
            name: '403',
            showOnSideBar: false,
            path: '403',
            component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
          },
          {
            name: '404',
            showOnSideBar: false,
            path: '404',
            component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
          },
          {
            name: '500',
            showOnSideBar: false,
            path: '500',
            component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
          },
        ],
      },
    ],
  },
  {
    component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    path: '/user',
    layout: 'UserLayout',
    children: [
      {
        name: 'Quản lý user',
        showOnSideBar: false,
        icon: 'user',
        path: 'user',
        children: [
          {
            name: '登录',
            showOnSideBar: false,
            path: 'login',
            component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
          },
          {
            name: '注册',
            showOnSideBar: false,
            path: 'register',
            component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
          },
          {
            name: '注册结果',
            showOnSideBar: false,
            path: 'register-result',
            component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
          },
        ],
      },
    ],
  },
];
