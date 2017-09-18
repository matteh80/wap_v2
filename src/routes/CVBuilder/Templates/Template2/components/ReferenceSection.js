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
      <section id='references' className='cvSection'>
        <Row>
          <Col className='titleWrapper'>
            <h4 className='sectionTitle'>Referenser</h4>
          </Col>
          <Col className='line' />
        </Row>
        <Row>
        {references && references.map((reference) => {
          return <CVReferenceItem key={reference.id} reference={reference} />
        })}
        </Row>
      </section>
    )
  }
}

class CVReferenceItem extends React.Component {
  render () {
    let { reference } = this.props
    return (
      <Col xs='4' className='mb-5'>
        <Row className='cvItem referenceItem'>
          <Col xs={12}>
            <h5 className='mb-1'>{reference.name}</h5>
            <h6>{reference.relation} {reference.employer}</h6>
            {reference.phone &&
              <Row className='align-items-center mb-1'>
                <Col>
                  <i className='fa fa-phone contactIcon' />{' '} {reference.phone}
                </Col>
              </Row>
              }
            <Row className='align-items-center'>
              <Col>
                <i className='fa fa-envelope contactIcon' />{' '} {reference.email}
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    )
  }
}
