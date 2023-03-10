export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/doc',
    layout: false,
    component: './ApiDoc',
    // routes: [
    //   {
    //     name: '',
    //     path: '/user/login',
    //     component: './user/Login',
    //   },
    // ],
  },
  {
    path: '/edit',
    layout: false,
    component: './ApiDoc/apiTemplate',
    // routes: [
    //   {
    //     name: '',
    //     path: '/user/login',
    //     component: './user/Login',
    //   },
    // ],
  },
  {
    path: '/control',
    layout: true,
    component: './ApiDoc/systemControl',
  },
  {
    path: '/sgt',
    layout: false,
    component: './SGT',
  },
  {
    path: '/',
    redirect: '/sgt',
  },
  {
    component: './404',
  },
];
