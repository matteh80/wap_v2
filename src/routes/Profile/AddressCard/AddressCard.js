import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import ProfilePicture from '../../../components/Misc/ProfilePicture'
import '../Profile.scss'
import classNames from 'classnames'
import GoogleMapReact from 'google-map-react'
import $ from 'jquery'

import {
  Row,
  Col,
  Card,
  CardBlock,
  CardTitle,
  CardSubtitle,
  Form,
  FormGroup,
  Input,
  Label
} from 'reactstrap'
import ThreeDButton from '../../../components/buttons/ThreeDButton'

let map = null
let maps = null

class AddressCard extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      editMode: false,
      center:{ lat: 59.95, lng: 30.33 },
      zoom: 11,
    }

    this.toggleEditMode = this.toggleEditMode.bind(this)
    this.createMapOptions = this.createMapOptions.bind(this)
    this.geoCodeDestination = this.geoCodeDestination.bind(this)
    this.setMap = this.setMap.bind(this)
    this.onChange = this.onChange.bind(this)
    this._resizeMapWrapper = this._resizeMapWrapper.bind(this)
  }

  componentDidMount () {
    $(window).on("resize", this._resizeMapWrapper())
    this._resizeMapWrapper()
  }

  componentWillUnmount () {
    $(window).off("resize", this._resizeMapWrapper())
  }

  _resizeMapWrapper () {
      let $mapWrapper = $('#mapWrapper')
      $mapWrapper.height($mapWrapper.width() * 0.5)
  }

  toggleEditMode () {
    if (this.state.editMode) {
      this.props.onSave()

      let newAddress = ReactDOM.findDOMNode(this.address).value
      let newZip = ReactDOM.findDOMNode(this.zip_code).value
      let newCity = ReactDOM.findDOMNode(this.city).value
      let newAddressString = newAddress + ' ' + newZip + ' ' + newCity
      this.geoCodeDestination(newAddressString)
    }

    this.setState({
      editMode: !this.state.editMode,
    })
  }

  createMapOptions (maps) {
    return {
      gestureHandling: 'greedy',
      panControl: false,
      mapTypeControl: false,
      scrollwheel: false,
      styles: [{ stylers: [{ 'saturation': -100 }, { 'gamma': 0.8 }, { 'lightness': 4 }, { 'visibility': 'on' }] }]
    }
  }

  geoCodeDestination (address) {
    console.log(address)
    let _self = this
    let geocoder = new maps.Geocoder()
    geocoder.geocode({ 'address': address }, function (results, status) {
      if (status === maps.GeocoderStatus.OK) {
        _self.setState({ center: { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() } })
        map.setCenter({ lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() })
      } else {
        alert('The address could not be found for the following reason: ' + status)
      }
    })
  }

  onChange (event) {
    this.props.onChange(event)
  }

  setMap (apiMap, apiMaps) {
    let { profile } = this.props
    map = apiMap
    maps = apiMaps
    this.geoCodeDestination(profile.address + ' ' + profile.zip_code + ' ' + profile.city)
  }

  render () {
    let { profile } = this.props

    let editBtnClass = classNames('edit-btn fa', this.state.editMode ? 'fa-check editing' : 'fa-pencil')

    return (
      <Col xs={12} sm={6} lg={4} xl={3}>
        <Card className='profileCard'>
          <i className={editBtnClass} onClick={() => this.toggleEditMode()} />
          <div id='mapWrapper'>
            <GoogleMapReact
              onGoogleApiLoaded={({ map, maps }) => this.setMap(map, maps)}
              yesIWantToUseGoogleMapApiInternals
              bootstrapURLKeys={{
                key: 'AIzaSyBitEKDDU5IpjCk81W0PP11obSiy68KEVM',
                language: 'en',
              }}
              center={this.state.center}
              defaultZoom={this.state.zoom}
              // options={this.createMapOptions}
            />
          </div>
          {!this.state.editMode &&
          <CardBlock>
            <CardTitle className='text-center'>{profile.address}</CardTitle>
            <CardSubtitle className='text-center'>{profile.zip_code} {profile.city}</CardSubtitle>
          </CardBlock>
          }

          {this.state.editMode &&
          <CardBlock>
            <Form>
              <FormGroup>
                <Label for='address'>Förnamn</Label>
                <Input type='address' name='address' id='address' defaultValue={profile.address}
                  ref={(input) => { this.address = input }} onChange={this.onChange} />
              </FormGroup>
              <FormGroup>
                <Label for='zip_code'>Efternamn</Label>
                <Input type='zip_code' name='zip_code' id='zip_code' defaultValue={profile.zip_code}
                  ref={(input) => { this.zip_code = input }} onChange={this.onChange} />
              </FormGroup>

              <FormGroup>
                <Label for='city'>Epost</Label>
                <Input type='city' name='city' id='city' defaultValue={profile.city}
                  ref={(input) => { this.city = input }} onChange={this.onChange} />
              </FormGroup>

            </Form>
          </CardBlock>
          }
        </Card>
      </Col>
    )
  }
}

export default connect((state) => state)(AddressCard)
