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
