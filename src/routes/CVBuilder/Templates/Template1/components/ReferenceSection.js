import React from 'react'

import {
  Row,
  Col,
  Progress,
} from 'reactstrap'

export default class ReferenceSection extends React.Component {
  render () {
    let { references } = this.props
    return (
      <section id='references' className='row'>
        <Col xs={12}>
          <Col xs={3} style={{ textAlign: 'right' }}>
            <h3 className='sectionTitle'>Referenser</h3>
          </Col>
        </Col>
        {references && references.map((reference) => {
          return <CVReferenceItem key={reference.id} reference={reference} />
        })}
      </section>
    )
  }
}

class CVReferenceItem extends React.Component {
  render () {
    let { reference } = this.props
    return (
      <Col xs='6' className='mb-5'>
        <Row className='cvItem'>
          <Col xs={12}>
            <h5 className='fg-themecolor'>{reference.name}</h5>
            <h6>{reference.relation} {reference.employer}</h6>
            {reference.phone &&
              <Row className='align-items-center'>
                <i className='fa fa-phone' />{' '} {reference.phone}
              </Row>
              }
            <Row className='align-items-center'>
              <i className='fa fa-envelope' />{' '}            {reference.email}
            </Row>
          </Col>
        </Row>
      </Col>
    )
  }
}
