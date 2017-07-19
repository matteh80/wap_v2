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
      <section id='languages' className='row'>
        <Col xs={12}>
          <Col xs={3} style={{ textAlign: 'right' }}>
            <h3 className='sectionTitle'>Språk</h3>
          </Col>
        </Col>
        {languages && languages.map((language) => {
          return <CVLanguageItem key={language.id} language={language} />
        })}
      </section>
    )
  }
}

class CVLanguageItem extends React.Component {
  render () {
    let { language } = this.props
    return (
      <Col key={language.id} xs={6} className='progressItem'>
        <Col xs={12} className='progressName'><h6>{language.name}</h6></Col>
        <Col xs={12} className='progressProgressWrapper'>
          <Progress
            min={1}
            max={5}
            value={language.spoken === 1 ? 1.25 : language.spoken}
            color='#ff0000' />
        </Col>
      </Col>
    )
  }
}
