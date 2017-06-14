import React from 'react'
import { Route, IndexRoute } from 'react-router'

import CoreLayout from '../layouts/PageLayout/PageLayout'
import Dashboard from './Dashboard/Dashboard'
import Login from './Login/Login'
import Employments from './Employments/Employments'
import Educations from './Educations/Educations'
import Occupations from './Occupations/Occupations'

import 'pace-progress'

export const routes = (store) => (
  <Route>
    <Route path='/' component={CoreLayout} name='Dashboard'>
      <IndexRoute component={Dashboard} />
      <Route path='/work/employments' component={Employments} />
      <Route path='/work/educations' component={Educations} />
      <Route path='/work/occupations' component={Occupations} />
    </Route>
    <Route path='/login' component={Login} name='Login' />
    <Route path='/login/facebook' component={Login} />
    <Route path='/login/linkedin' component={Login} />
  </Route>
)
export default routes
