import React from 'react'
import { Route, IndexRoute } from 'react-router'

import CoreLayout from '../layouts/PageLayout/PageLayout'
import Dashboard from './Dashboard/Dashboard'
import Login from './Login/Login'
import Employments from './Employments/Employments'
import Educations from './Educations/Educations'
import Occupations from './Occupations/Occupations'
import Skills from './Skills/Skills'
import Languages from './Languages/Languages'
import Profile from './Profile/Profile'
import Motivations from './Motivations/Motivations'
import Personalities from './Personalities/Personalities'
import WapFilm from './WapFilm/WapFilm'
import CVBuilder from './CVBuilder/CVBuilder'
import DrivingLicenses from './DrivingLicenses/DrivingLicenses'

import 'pace-progress'

export const routes = (store) => (
  <Route>
    <Route path='/' component={CoreLayout} name='Dashboard'>
      <IndexRoute component={Dashboard} name='Dashboard' />
      <Route path='/profile' component={Profile} name='Profil' />
      <Route path='work' name='Work'>
        <Route path='/work/employments' component={Employments} name='Anställningar' />
        <Route path='/work/educations' component={Educations} name='Utbildningar' />
        <Route path='/work/skills' component={Skills} name='Kompetenser' />
        <Route path='/work/languages' component={Languages} name='Språk' />
        <Route path='/work/drivinglicenses' component={DrivingLicenses} name='Körkort' />
      </Route>
      <Route path='passion' name='Passion'>
        <Route path='/passion/occupations' component={Occupations} name='Befattningar' />
        <Route path='/passion/motivations' component={Motivations} name='Drivkrafter' />
        <Route path='/passion/personalities' component={Personalities} name='Personlighet' />
      </Route>
      <Route path='/wapfilm' component={WapFilm} name='Wap film' />
      <Route path='/cvbuilder' component={CVBuilder} name='CV Builder' />
    </Route>
    <Route path='/login' component={Login} name='Login' />
    <Route path='/login/facebook' component={Login} />
    <Route path='/login/linkedin' component={Login} />
  </Route>
)
export default routes
