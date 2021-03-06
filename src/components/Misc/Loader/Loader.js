import React from 'react'
import $ from 'jquery'
import PropTypes from 'prop-types'

export default class Loader extends React.Component {
  componentDidMount () {
    $('#loaderContainer').parent().css('position', 'relative')
  }

  componentWillRecieveNewProps (newProps) {
    // console.log(newProps);
  }

  render () {
    let { active } = this.props

    return (
      <div id='loaderContainer' style={active ? loaderContainer : hidden}>
        <div id='loader' className='ball-scale-ripple-multiple'><div /><div /><div /></div>
      </div>
    )
  }
}

Loader.propTypes = {
  active: PropTypes.bool.isRequired
}

const loaderContainer = {
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 999,
  backgroundColor: 'rgba(255,255,255,0.9)',
  display: 'flex',
  textAlign: 'center',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
}

const hidden = {
  display: 'none'
}
