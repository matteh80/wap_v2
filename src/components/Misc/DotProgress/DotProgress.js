import React from 'react'
import PropTypes from 'prop-types'
import './DotProgress.scss'
import classNames from 'classnames'
import { Row, Col } from 'reactstrap'

class DotProgress extends React.Component {
  constructor (props) {
    super(props)
  }

  renderDots () {
    let { num } = this.props
    let dots = []
    console.log(num)
    for (let i = 0; i < 5; i++) {
      let dotClass = classNames(
        'dot',
        i < num && 'filled'
      )
      dots.push(<div key={i} className={dotClass} />)
    }
    return dots
  }

  render () {
    return (
      <Row className='dotProgressWrapper mb-1'>
        <Col xs='6' className='title'>
          <h6 className='mb-0'>{this.props.title}</h6>
        </Col>
        <Col xs='6' className='dotProgress'>
          {this.renderDots()}
        </Col>
      </Row>
    )
  }
}

DotProgress.propTypes = {
  num: PropTypes.number,
  title: PropTypes.string
}

export default DotProgress
