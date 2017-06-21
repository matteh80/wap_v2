import React from 'react'
import ProfilePicture from '../../../../../components/Misc/ProfilePicture/ProfilePicture'

import {
  Row,
  Col,
} from 'reactstrap'

export default class HeaderSection extends React.Component {
  constructor (props) {
    super(props)

    this.setPicture = this.setPicture.bind(this)
  }

  componentDidMount () {
    // this.setPicture(this.props.picPath)
  }

  setPicture (picPath) {
    let mCanvas = document.getElementById('mCanvas')
    console.log(mCanvas)
    mCanvas.width = 500
    mCanvas.height = 500
    let mContext = mCanvas.getContext('2d')
    let mImage = new Image()
    mImage.src = picPath.picPath

    mImage.onload = function () {
      mContext.drawImage(mImage, 0, 0, 500, 500)
    }
  }

  render () {
    let { profile } = this.props

    return (
      <section>
        <Row id='header' style={{ display: 'flex', alignItems: 'center' }}>
          <Col xs={2} style={{ position: 'relative', padding: '4% 0 4% 8%' }}>
            {/*<canvas id='mCanvas' width={500} height={500} className='img-responsive' />*/}
            <ProfilePicture />
            {/* <div style={{boxShadow: "inset 0 -5px 0 rgba(0,0,0,0.2)", height: '100%', width: '100%'}} /> */}
            {/* <img src={this.props.picPath.picPath} style={{padding: '5%', position: 'absolute', top: 0, left: 0}} className="img-responsive img-circle" /> */}
            {/* <div className="img-circle" id="CVprofilePic" style={{background: 'url('+this.props.picPath.picPath+')', width: '100%', backgroundSize: 'cover'}}/> */}
          </Col>
          <Col xs={4} id='info'>
            <h3 id='first_name'>{profile && profile.first_name}</h3>
            <h3 id='last_name'>{profile && profile.last_name}</h3>
            <h6 id='title'>{profile && profile.title}</h6>
          </Col>
          <Col xs={6} id='contact'>
            <Row>
              <Col xs={4} className='leftColumn'>Epost</Col><Col xs={8} className='rightColumn'>{profile && profile.email}</Col>
            </Row>
            <Row>
              <Col xs={4} className='leftColumn'>Telefon</Col><Col xs={8} className='rightColumn'>+46 (0){profile && profile.mobile_phone_number}</Col>
            </Row>
            <Row>
              <Col xs={4} className='leftColumn'>Hemsida</Col><Col xs={8} className='rightColumn'>{profile && profile.home_page}</Col>
            </Row>
          </Col>
        </Row>
      </section>
    )
  }
}
