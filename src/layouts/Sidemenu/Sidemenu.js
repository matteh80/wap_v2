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
            <Menuitem icon='fa-building' title='Work'>
              <Menuitem to='/employments' icon='fa-briefcase' title='Anställningar' />
              <Menuitem to='/educations' icon='fa-graduation-cap' title='Utbildningar' />
              <Menuitem to='/skills' icon='fa-flash' title='Kompetenser' />
            </Menuitem>
            <Menuitem icon='fa-rocket' title='Passion'>
              <Menuitem to='/employments' icon='fa-briefcase' title='Anställningar' />
              <Menuitem to='/educations' icon='fa-graduation-cap' title='Utbildningar' />
              <Menuitem to='/skills' icon='fa-briefcase' title='Kompetenser' />
            </Menuitem>
          </ul>
        </div>
      </div>
    )
  }
}
