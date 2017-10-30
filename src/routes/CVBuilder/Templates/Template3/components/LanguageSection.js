import React from 'react'

import {
  Row,
  Col,
  Progress,
} from 'reactstrap'

export default class LanguageSection extends React.Component {
  constructor (props) {
    super(props)
  }

  componentWillReceiveProps (newProps) {

  }

  render () {
    let { languages } = this.props
    return (
      <section id='languages' className='cvSection mb-5'>
        <Row>
          <Col className='titleWrapper'>
            <h2 className='sectionTitle font-italic'>Språk</h2>
          </Col>
        </Row>
        <Row>
          {languages && languages.map((language) => {
            return <CVLanguageItem key={language.id} language={language} />
          })}
        </Row>
      </section>
    )
  }
}

class CVLanguageItem extends React.Component {
  render () {
    let { language } = this.props
    return (
      <Col key={language.id} xs={6} className='progressItem mb-0'>
        <Row>
          <Col xs={12} className='progressName'><small className='mb-0'>{language.name}</small></Col>
          <Col xs={12} className='progressProgressWrapper'>
            <Progress
              min={1}
              max={5}
              value={language.spoken === 1 ? 1.25 : language.spoken}
              color='#ff0000' />
          </Col>
        </Row>
      </Col>
    )
  }
}
