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
      <div id='languages' className='row mt-5'>
        <Col xs={12} className='d-flex'>
          <Col className='titleWrapper'>
            <h4 className='sectionTitle'>Språk</h4>
          </Col>
          <Col className='line' />
        </Col>
        {languages && languages.map((language) => {
          return <CVLanguageItem key={language.id} language={language} />
        })}
      </div>
    )
  }
}

class CVLanguageItem extends React.Component {
  render () {
    let { language } = this.props
    return (
      <Col key={language.id} xs={12} className='progressItem mb-0'>
        <Col xs={12} className='progressName'><small className='mb-0'>{language.name}</small></Col>
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
