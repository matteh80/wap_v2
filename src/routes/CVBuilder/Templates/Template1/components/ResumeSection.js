import React from 'react'

import {
  Row,
  Col,
} from 'reactstrap'

export default class ResumeSection extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    // this.setPicture(this.props.picPath)
  }

  render () {
    let { profile } = this.props

    return (
      <section>
        {this.props.visible &&
        <Row id='header' className='align-items-center'>
            <blockquote>
              {this.props.profile.personal_info}
            </blockquote>
        </Row>
        }
      </section>
    )
  }
}
