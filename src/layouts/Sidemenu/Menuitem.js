import React from 'react'
import { IndexLink, Link } from 'react-router'
import classnames from 'classnames'

import './Menuitem.scss'

import { Collapse } from 'reactstrap'

class Menuitem extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      collapsed: false,
      hasChildren: !!props.children,
      count: this.props.count
    }

    this._handleClick = this._handleClick.bind(this)
  }

  _handleClick (e) {
    // e.preventDefault();
    this.setState({ collapsed: !this.state.collapsed })
    return false
  }

  render () {
    let chevronClass = classnames('has-children fa', this.state.collapsed ? 'fa-chevron-down' : 'fa-chevron-left')
    let doneClass = classnames('icon-thumbnail', this.props.count === 0 && 'undone')

    return (
      <li className='menu-item-wrapper'>
        <Link to={this.props.to}
          className='menu-item'
          activeClassName='menu-item--active'
          onClick={(e) => this._handleClick(e)}
          onlyActiveOnIndex={this.props.onlyActiveOnIndex}>
          <div className='text-wrapper'>
            <span className='title'>{this.props.title}</span>
            <span className='details'>{this.props.details}</span>
          </div>

          <span className={doneClass}><i className={'fa ' + this.props.icon} /></span>
          {this.state.hasChildren && <span className={chevronClass} />}
        </Link>
        {this.state.hasChildren &&
        <Collapse isOpen={this.state.collapsed}>
          <ul className='sub-menu'>
            {this.props.children}
          </ul>
        </Collapse>
        }
      </li>
    )
  }
}

export default Menuitem
