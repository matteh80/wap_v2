import React from 'react'
import classNames from 'classnames'

export default class ThreeDButton extends React.Component {
  shadeColor (color, percent) {
    let f = parseInt(color.slice(1), 16), t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent, R = f >> 16, G = f >> 8 & 0x00FF, B = f & 0x0000FF
    return '#' + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1)
  }

  blendColors (c0, c1, p) {
    let f = parseInt(c0.slice(1), 16), t = parseInt(c1.slice(1), 16), R1 = f >> 16, G1 = f >> 8 & 0x00FF, B1 = f & 0x0000FF, R2 = t >> 16, G2 = t >> 8 & 0x00FF, B2 = t & 0x0000FF
    return '#' + (0x1000000 + (Math.round((R2 - R1) * p) + R1) * 0x10000 + (Math.round((G2 - G1) * p) + G1) * 0x100 + (Math.round((B2 - B1) * p) + B1)).toString(16).slice(1)
  }

  colorLuminance (hex, lum) {
// validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '')
    if (hex.length < 6) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    }
    lum = lum || 0
// convert to decimal and change luminosity
    let rgb = '#', c, i
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i * 2, 2), 16)
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16)
      rgb += ('00' + c).substr(c.length)
    }
    return rgb
  }

  render () {
    let boxshadowDown = this.props.xsmall ? '3px' : '5px'

    const style = {
      padding: this.props.small && '7px 20px' || this.props.xsmall && '2px 10px',
      // textTransform: this.props.small && 'none' || this.props.xsmall && 'none',
      width: this.props.fluid ? '100%' : 'auto',
      marginLeft: this.props.center && 'auto',
      marginRight: this.props.center && 'auto',
    }

    let btnClass = classNames({
      't3Button':true,
      'block': this.props.block || this.props.center,
      'inline': this.props.inline,
    }, this.props.className)

    return (
      <button id={this.props.id}
        disabled={this.props.loading}
        type={this.props.type}
        onClick={this.props.onClick}
        onTouchEnd={this.props.onTouchEnd}
        className={btnClass}
        style={style}>
        {this.props.text ? this.props.text : this.props.children}
        {this.props.loading &&
          <i className='fa fa-spinner fa-spin' style={{ marginLeft: 5 }} />
        }
      </button>
    )
  }
}
