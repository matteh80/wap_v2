import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'
import Menuitem from './Menuitem'
import './Sidemenu.scss'

class Sidemenu extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      employmentCount: 0
    }
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

    this.setState({
      employmentCount: this.props.employments.employments.length
    })
  }

  render () {
    return (
      <div className='sidemenuWrapper'>
        <div className='sidemenu'>
          <ul className='menu-items'>
            <Menuitem to='/' icon='fa-home' title='Dashboard' onlyActiveOnIndex />
            <Menuitem to='/profile' icon='fa-user' title='Profil' />
            <Menuitem icon='fa-building' title='Work'>
              <Menuitem to='/work/employments' icon='fa-briefcase' title='Anställningar' details={this.state.employmentCount + ' anställningar'} />
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

export default connect((state) => state)(Sidemenu)
