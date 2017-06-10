import React from 'react'
import $ from 'jquery'

export default class Loader extends React.Component {
  componentDidMount () {
    $('#loaderContainer').parent().css('position', 'relative')
  }

  componentWillRecieveNewProps (newProps) {
    // console.log(newProps);
  }

  render () {
    let { type } = this.props
    let { active } = this.props

    return (
      <div id='loaderContainer' style={active ? loaderContainer : hidden}>
        <div id='loader' className={type}><div /><div /><div /></div>
      </div>
    )
  }
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
