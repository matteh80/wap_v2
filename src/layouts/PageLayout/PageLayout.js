import React from 'react'
import PropTypes from 'prop-types'
import './PageLayout.scss'
import Sidemenu from '../Sidemenu/Sidemenu'
import Header from '../Header/Header'
import UserIsAuthenticated from '../../routes/auth'
import { connect } from 'react-redux'
import Breadcrumbs from 'react-breadcrumbs'

class PageLayout extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    document.title = this.props.routes[2].name + ' | wap card'
    return (
      <div style={{ background: 'rgb(171, 185, 195)' }}>
        <Sidemenu />
        <Header />
        <Breadcrumbs
          setDocumentTitle={true}
          separator={<i className='fa fa-chevron-right' style={{ margin: '0 5px' }} />}
          routes={this.props.routes}
          params={this.props.params}
        />
        <div className='container-fluid'>
          <div className='page-layout__viewport'>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

PageLayout.propTypes = {
  children: PropTypes.node,
}

export default UserIsAuthenticated(connect((state) => state)(PageLayout))
