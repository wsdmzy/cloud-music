// 配置？ 
import React from 'react';
import Home from '../application/Home';
import Recommend from '../application/Recommend';
import Singers from '../application/Singers';
import Rank from '../application/Rank';
import Album from '../application/Album';

import { Redirect } from 'react-router-dom';
export default [{
  path: "/",
  component: Home,
  routes: [
    {
      path: "/",
      exact: true,
      render: () => (
        <Redirect to={"/recommend"}/>
      )
    },
    {
      path: "/recommend",
      component: Recommend,
      routes: [
        {
          path: "/recommend/:id",
          component: Album
        }
      ]
    },
    {
      path: "/singers",
      component: Singers
    },
    {
      path: "/rank",
      component: Rank
    },
  ]
}]