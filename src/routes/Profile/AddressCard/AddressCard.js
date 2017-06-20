import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import '../Profile.scss'
import classNames from 'classnames'
import GoogleMapReact from 'google-map-react'
import $ from 'jquery'

import {
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

let map = null
let maps = null

const MarkerComponent = () => <div>
  <i className='fa fa-map-marker' style={{ fontSize: 30, marginTop: -60, color: '#3fa5c5' }} />
</div>

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
    this.revertChanges = this.revertChanges.bind(this)
  }

  componentDidMount () {
    $(window).on('resize', this._resizeMapWrapper)
    this._resizeMapWrapper()
  }

  componentWillUnmount () {
    $(window).off('resize', this._resizeMapWrapper)
  }

  _resizeMapWrapper () {
    console.log('resize')
    let $mapWrapper = $('#mapWrapper')
    $mapWrapper.height($mapWrapper.width() * 0.555555)
    if (map) {
      map.setCenter(this.state.center)
    }
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
    this.props.onOpen()
  }

  createMapOptions (maps) {
    return {
      gestureHandling: 'greedy',
      panControl: false,
      mapTypeControl: false,
      scrollwheel: false,
      styles: [{ stylers: [{ 'saturation': -20 }, { 'gamma': 0.8 }, { 'lightness': 4 }, { 'visibility': 'on' }] }]
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

  revertChanges () {
    this.setState({
      editMode: !this.state.editMode
    })
    this.props.revertChanges()
  }

  render () {
    let { profile } = this.props

    let wrapperClass = classNames('btn-wrapper', this.state.editMode && 'editing')
    let editBtnClass = classNames('edit-btn fa', this.state.editMode ? 'fa-check editing' : 'fa-pencil')

    return (
      <Col xs={12} sm={6} md={8} lg={4} xl={3}>
        <Card className='profileCard'>
          <div className={wrapperClass}>
            <i className={editBtnClass} onClick={() => this.toggleEditMode()} />
            <i className='fa fa-times cancel-btn' onClick={() => this.revertChanges()} />
          </div>
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
              options={this.createMapOptions}
            >
              <MarkerComponent
                lat={this.state.center.lat}
                lng={this.state.center.lng}
              />
            </GoogleMapReact>
          </div>
          {!this.state.editMode &&
          <CardBlock>
            {profile.care_of && <CardSubtitle className='text-center'>c/o {profile.care_of}</CardSubtitle>}
            <CardTitle className='text-center'>{profile.address}</CardTitle>
            <CardSubtitle className='text-center'>{profile.zip_code} {profile.city}</CardSubtitle>
          </CardBlock>
          }

          {this.state.editMode &&
          <CardBlock>
            <Form>
              <FormGroup>
                <Label for='care_of'>C/o</Label>
                <Input type='care_of' name='care_of' id='care_of' defaultValue={profile.care_of}
                       ref={(input) => { this.care_of = input }} onChange={this.onChange} />
              </FormGroup>
              <FormGroup>
                <Label for='address'>Adress</Label>
                <Input type='address' name='address' id='address' defaultValue={profile.address}
                  ref={(input) => { this.address = input }} onChange={this.onChange} />
              </FormGroup>
              <FormGroup>
                <Label for='zip_code'>Postnummer</Label>
                <Input type='zip_code' name='zip_code' id='zip_code' defaultValue={profile.zip_code}
                  ref={(input) => { this.zip_code = input }} onChange={this.onChange} />
              </FormGroup>

              <FormGroup>
                <Label for='city'>Postort</Label>
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
