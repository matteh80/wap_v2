import React from 'react'
import { connect } from 'react-redux'
import LicenseForm from './LicenseForm/LicenseForm'
import LicenseItem from './LicenseItem/LicenseItem'
import { getAllLicenses, getMyLicenses, saveLicensesToServer } from '../../store/actions/drivinglicenses'
import update from 'react-addons-update'
import ThreeDButton from '../../components/buttons/ThreeDButton'
import Masonry from 'react-masonry-component'
import './DrivingLicenses.scss'

import {
  Collapse,
  Container,
  Row,
  Col,
} from 'reactstrap'

class DrivingLicenses extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      userLicenses: this.props.drivinglicenses.userLicenses ? this.props.drivinglicenses.userLicenses : [],
      changes: false
    }

    let { dispatch } = this.props
    Promise.all([
      dispatch(getAllLicenses()),
      dispatch(getMyLicenses()),
    ]).then(() => {
      this.setState({
        userLicenses: this.props.drivinglicenses.userLicenses ? this.props.drivinglicenses.userLicenses : []
      })
    }).catch((error) => {
      console.log(error)
    })

    this.onLicenseChange = this.onLicenseChange.bind(this)
    this.onAdd = this.onAdd.bind(this)
    this.onRemove = this.onRemove.bind(this)
    this._saveToServer = this._saveToServer.bind(this)
    this.layout = this.layout.bind(this)
  }

  componentWillUpdate (nextProps, nextState) {
    if (this.state.userLicenses !== nextState.userLicenses) {
      this.setState({ changes: true })
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.userLicenses !== prevState.userLicenses) {
      this._saveToServer()
    }
  }

  onLicenseChange (license) {
    let _self = this
    let index = this.state.userLicenses.findIndex(licenses => licenses.id === license.id)
    if (index === -1) return false

    this.setState({
      userLicenses: update(this.state.userLicenses, { [index]: { spoken: { $set: license.spoken }, written: { $set: license.written } } })
    })
  }

  onAdd (item) {
    let mLicense = Object.assign({}, item, { spoken: item.spoken ? item.spoken : 1, written: item.written ? item.written : 1 })
    this.setState({
      userLicenses: update(this.state.userLicenses, { $push: [mLicense] })
    })
  }

  onRemove (id) {
    let index = this.state.userLicenses.findIndex(licenses => licenses.id === id)
    if (index === -1) return false
    const items = Object.assign([], this.state.userLicenses)
    items.splice(index, 1)

    this.setState({ userLicenses : items })
  }

  _saveToServer () {
    let { dispatch } = this.props
    dispatch(saveLicensesToServer(this.state.userLicenses)).then(() => {
      this.setState({ changes: false })
    })
  }

  layout () {
    this.masonry.layout()
  }

  render () {
    let { userLicenses } = this.props.drivinglicenses
    let notEmpty = userLicenses && userLicenses.length > 0

    return (
      <Container fluid>
        <Row>
          <Col xs={12} sm={12} md={6} xl={5}>
            <LicenseForm notEmpty={notEmpty} onAdd={this.onAdd} userLicenses={this.state.userLicenses} />
          </Col>
        </Row>
        <Masonry
          onClick={this.handleClick}
          className='row'
          ref={function (c) {
            this.masonry = this.masonry || c.masonry
          }.bind(this)}
        >
          {this.state.userLicenses && this.state.userLicenses.map((license) => {
            return <LicenseItem key={license.id} license={license} onChange={this.onLicenseChange} onRemove={this.onRemove} layout={this.layout} />
          })}
        </Masonry>
      </Container>
    )
  }
}

export default connect((state) => state)(DrivingLicenses)
