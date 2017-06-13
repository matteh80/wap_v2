import React from 'react'
import PropTypes from 'prop-types'
import './PageLayout.scss'
import Sidemenu from '../Sidemenu/Sidemenu'
import Header from '../Header/Header'
import UserIsAuthenticated from '../../routes/auth'
import { connect } from 'react-redux'

export const PageLayout = ({ children }) => (
  <div style={{background: 'rgb(171, 185, 195)' }}>
    <Sidemenu />
    <Header />
    <div className='container-fluid'>
      <div className='page-layout__viewport'>
        {children}
      </div>
    </div>
  </div>
)
PageLayout.propTypes = {
  children: PropTypes.node,
}

export default UserIsAuthenticated(connect((state) => state)(PageLayout))
