import React from 'react'
import PropTypes from 'prop-types'
import './PageLayout.scss'
import Sidemenu from '../Sidemenu/Sidemenu'
import Header from '../Header/Header'
import UserIsAuthenticated from '../../routes/auth'
import { connect } from 'react-redux'
import Breadcrumbs from 'react-breadcrumbs'
import { getTranslate, getActiveLanguage } from 'react-localize-redux'

class PageLayout extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    let { dispatch, translate, currentLanguage } = this.props
    let activeRouteItem = Object.assign([], this.props.routes).reverse()
    document.title = activeRouteItem[0].name + ' | wap card'

    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, {
        translate: translate
      })
    )

    return (
      <div>
        <Sidemenu translate={translate} />
        <Header translate={translate} currentLanguage={currentLanguage} />

        <div className='container-fluid'>
          <div className='page-layout__viewport'>
            <Breadcrumbs
              setDocumentTitle
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

const mapStateToProps = state => ({
  translate: getTranslate(state.localeReducer),
  currentLanguage: getActiveLanguage(state.localeReducer) ? getActiveLanguage(state.localeReducer).code : 'sv',
  ...state
})

export default UserIsAuthenticated(connect(mapStateToProps)(PageLayout))
