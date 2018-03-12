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
        name: 'Shop',
        showOnSideBar: true,
        icon: 'shop',
        path: 'shop',
        children: [
          {
            name: 'Danh sách',
            showOnSideBar: true,
            path: 'list',
            component: dynamicWrapper(app, ['shop'], () => import('../routes/Shop/List')),
          },
          {
            name: 'Thông tin Shop',
            showOnSideBar: false,
            path: 'info/:id',
            component: dynamicWrapper(app, ['shop'], () => import('../routes/Shop/Info')),
          },
        ],
      },
      {
        name: 'Đơn hàng',
        showOnSideBar: true,
        icon: 'shop',
        path: 'order',
        children: [
          {
            name: 'Danh sách',
            showOnSideBar: true,
            path: 'list',
            component: dynamicWrapper(app, ['order'], () => import('../routes/Order/List')),
          },
          {
            name: 'Thêm đơn hàng',
            showOnSideBar: true,
            path: 'add',
            component: dynamicWrapper(app, ['order'], () => import('../routes/Order/Add')),
          },
        ],
      },
      {
        name: 'Chuyến đi lấy',
        showOnSideBar: true,
        icon: 'shop',
        path: 'pickup',
        children: [
          {
            name: 'Danh sách',
            showOnSideBar: true,
            path: 'list',
            component: dynamicWrapper(app, ['order'], () => import('../routes/Pickup/List')),
          },
          {
            name: 'Thêm đơn hàng',
            showOnSideBar: true,
            path: 'add',
            component: dynamicWrapper(app, ['order'], () => import('../routes/Order/Add')),
          },
        ],
      },
      {
        name: 'Chuyến Đi Giao',
        showOnSideBar: true,
        icon: 'car',
        path: 'delivery',
        children: [
          {
            name: 'Danh sách',
            showOnSideBar: true,
            path: 'list',
            component: dynamicWrapper(app, ['delivery'], () => import('../routes/Delivery/ListDelivery')),
          },
          {
            name: 'Thêm Chuyến Đi Giao',
            showOnSideBar: false,
            path: 'add',
            component: dynamicWrapper(app, ['delivery'], () => import('../routes/Delivery/AddDelivery')),
          },
          {
            name: 'Cập Nhật Chuyến Đi Giao',
            showOnSideBar: false,
            path: 'update/:id',
            component: dynamicWrapper(app, ['delivery'], () => import('../routes/Delivery/UpdateDelivery')),
          },
        ],
      },
      {
        name: 'Chuyến Đi Trả',
        showOnSideBar: true,
        icon: 'car',
        path: 'refund',
        children: [
          {
            name: 'Danh sách',
            showOnSideBar: true,
            path: 'list',
            component: dynamicWrapper(app, ['refund'], () => import('../routes/Refund/ListRefund')),
          },
          {
            name: 'Thêm Chuyến Đi Trả',
            showOnSideBar: false,
            path: 'add',
            component: dynamicWrapper(app, ['refund'], () => import('../routes/Refund/AddRefund')),
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
