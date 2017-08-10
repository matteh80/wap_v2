import React from 'react'
import { withRouter } from 'react-router'
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

    !this.props.profile.tos_accepted && this.props.router.push('/signup')
  }

  render () {
    let { dispatch } = this.props
    let { translate, currentLanguage } = this.context
    let activeRouteItem = Object.assign([], this.props.routes).reverse()
    document.title = activeRouteItem[0].name + ' | wap card'

    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, {
        translate: translate,
        currentlanguage: currentLanguage
      })
    )

    return (
      <div>
        <Header translate={translate} currentLanguage={currentLanguage} />

        <div className='container-fluid'>
          <Sidemenu translate={translate} />
          <div className='page-layout__viewport'>
            <Breadcrumbs
              separator={<i className='fa fa-chevron-right' style={{ margin: '0 5px' }} />}
              routes={this.props.routes}
              params={this.props.params}
            />
            {childrenWithProps}
          </div>
        </div>
      </div>
    )
  }
}

PageLayout.propTypes = {
  children: PropTypes.node,
}

PageLayout.contextTypes = {
  translate: PropTypes.func,
  currentLanguage: PropTypes.string
}

// const mapStateToProps = state => ({
//   translate: getTranslate(state.localeReducer),
//   currentLanguage: getActiveLanguage(state.localeReducer) ? getActiveLanguage(state.localeReducer).code : 'sv',
//   ...state
// })

export default UserIsAuthenticated(withRouter(connect((state) => state)(PageLayout)))
