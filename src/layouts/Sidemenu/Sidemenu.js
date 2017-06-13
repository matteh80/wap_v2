import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'
import Menuitem from './Menuitem'
import './Sidemenu.scss'

class Sidemenu extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      employmentCount: 0,
      educationCount: 0
    }
  }

  componentDidMount () {
    let $sidemenu = $('.sidemenuWrapper')
    let $navbarToggle = $('.navbar-toggle ')
    let $body = $('body')

    $sidemenu.mouseenter(function () {
      $body.addClass('menu-expanded')
      $navbarToggle.removeClass('collapsed')
    })
    $sidemenu.mouseleave(function () {
      $body.removeClass('menu-expanded')
      $navbarToggle.addClass('collapsed')
    })

    this.setState({
      employmentCount: this.props.employments.employments ? this.props.employments.employments.length : 0,
      educationCount: this.props.educations.educations ? this.props.educations.educations.length : 0,
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
              <Menuitem to='/work/educations' icon='fa-graduation-cap' title='Utbildningar' details={this.state.educationCount + ' utbildningar'} />
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
