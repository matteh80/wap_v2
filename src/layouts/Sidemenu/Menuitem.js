import React from 'react'
import { IndexLink, Link } from 'react-router'

import './Menuitem.scss'

class Menuitem extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <li className='menu-item'>
        <Link to={this.props.to} activeClassName='menu-item--active'>
          <div className='text-wrapper'>
            <span className='title'>{this.props.title}</span>
            <span className='details'>12 New Updates</span>
          </div>
          <span className='icon-thumbnail'><i className={'fa ' + this.props.icon} /></span>
        </Link>
      </li>
    )
  }
}

export default Menuitem
