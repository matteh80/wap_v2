import React from 'react'

import {
  Row,
  Col,
} from 'reactstrap'

export default class DrivingLicenseSection extends React.Component {

  render () {
    let { drivinglicenses } = this.props
    return (
      <section id='drivinglicenses'>
        <Row>
          <Col>
            <h5 className='sectionTitle'>Körkort</h5>
          </Col>
        </Row>
        <Row>
          {drivinglicenses && drivinglicenses.map((drivinglicense) => {
            return <CVDrivinglicenseItem key={drivinglicense.id} drivinglicense={drivinglicense} />
          })}
        </Row>
      </section>
    )
  }
}

class CVDrivinglicenseItem extends React.Component {
  render () {
    let { drivinglicense } = this.props

    return (
      <Col key={drivinglicense.id} xs={2} className='licenseItem'>
        <div
          className={'licenseicon-korkort-' + drivinglicense.name.replace(' ', '-').replace(' ', '-').replace('å', 'a').toLowerCase() + ' licenseIcon'} />
        <h6 className='licenseName' style={{ display: 'block' }}>{drivinglicense.name}</h6>
      </Col>
    )
  }
}
