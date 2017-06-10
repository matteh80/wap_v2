import React from 'react'
import $ from 'jquery'
import Menuitem from './Menuitem'
import './Sidemenu.scss'

export default class Sidemenu extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    $('.sidemenuWrapper').mouseenter(function () {
      let $body = $('body')
      $body.addClass('menu-expanded')
    })
    $('.sidemenuWrapper').mouseleave(function () {
      let $body = $('body')
      $body.removeClass('menu-expanded')
    })
  }

  render () {
    return (
      <div className='sidemenuWrapper'>
        <div className='sidemenu'>
          <ul className='menu-items'>
            <Menuitem to='/' icon='fa-home' title='Dashboard' />
            <Menuitem to='/profile' icon='fa-user' title='Profil' />
          </ul>
        </div>
      </div>
    )
  }
}
