import React from 'react'
import { connect } from 'react-redux'
import Masonry from 'react-masonry-component'
import { getProfile, updateProfile } from '../../store/actions/profile'

import {
  Container,
} from 'reactstrap'

import InfoCard from './InfoCard/InfoCard'
import AddressCard from './AddressCard/AddressCard'
import SalaryCard from './SalaryCard/SalaryCard'
import AvailabilityCard from './AvailabilityCard/AvailabilityCard'

class Profile extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      profile: this.props.profile,
      open: 0
    }

    this.onProfileChange = this.onProfileChange.bind(this)
    this.onSalaryChange = this.onSalaryChange.bind(this)
    this.onProfileSave = this.onProfileSave.bind(this)
    this.onOpenCard = this.onOpenCard.bind(this)
    this.onRevertChanges = this.onRevertChanges.bind(this)
    this.onDateChange = this.onDateChange.bind(this)
    this.onAvailabilityChange = this.onAvailabilityChange.bind(this)
  }

  onProfileChange (event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({
      profile: {
        ...this.state.profile,
        [name]: value
      }
    })
  }

  onSalaryChange (values) {
    this.setState({
      profile: {
        ...this.state.profile,
        salary_expectations_min: values[0],
        salary_expectations_max: values[1]
      }
    })
  }

  onAvailabilityChange (value) {
    this.setState({
      profile: {
        ...this.state.profile,
        availability: value,
      }
    })
  }

  onProfileSave () {
    let { dispatch } = this.props
    dispatch(updateProfile(this.state.profile))
  }

  onRevertChanges () {
    let { dispatch } = this.props
    dispatch(getProfile()).then(() => {
      this.setState({
        profile: this.props.profile
      })
    })
  }

  onOpenCard () {
    this.setState({
      open: 1
    })
  }

  onDateChange (date) {
    this.setState({
      profile: {
        ...this.state.profile,
        birthday: date.format('L')
      }
    })
  }

  render () {
    let { profile } = this.props

    return (
      <Container fluid>
        <Masonry
          onClick={this.handleClick}
          className='row'
          ref={function (c) {
            this.masonry = this.masonry || c.masonry
          }.bind(this)}
        >
          <InfoCard onChange={this.onProfileChange} onSave={this.onProfileSave} onOpen={this.onOpenCard} revertChanges={this.onRevertChanges} onDateChange={this.onDateChange} />
          <AddressCard onChange={this.onProfileChange} onSave={this.onProfileSave} onOpen={this.onOpenCard} revertChanges={this.onRevertChanges} />
          <SalaryCard onChange={this.onSalaryChange} onSave={this.onProfileSave} onOpen={this.onOpenCard} revertChanges={this.onRevertChanges} />
          <AvailabilityCard onChange={this.onAvailabilityChange} onSave={this.onProfileSave} onOpen={this.onOpenCard} revertChanges={this.onRevertChanges} />
        </Masonry>
      </Container>
    )
  }
}

export default connect((state) => state)(Profile)
