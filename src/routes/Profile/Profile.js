import React from 'react'
import { connect } from 'react-redux'
import Masonry from 'react-masonry-component'
import { updateProfile } from '../../store/actions/profile'

import {
  Container,
} from 'reactstrap'

import InfoCard from './InfoCard/InfoCard'
import AddressCard from './AddressCard/AddressCard'
import SalaryCard from './SalaryCard/SalaryCard'

class Profile extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      profile: this.props.profile
    }

    this.onProfileChange = this.onProfileChange.bind(this)
    this.onProfileSave = this.onProfileSave.bind(this)
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

  onProfileSave () {
    let { dispatch } = this.props
    dispatch(updateProfile(this.state.profile))
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
          <InfoCard onChange={this.onProfileChange} onSave={this.onProfileSave} />
          <AddressCard onChange={this.onProfileChange} onSave={this.onProfileSave} />
          <SalaryCard onChange={this.onProfileChange} onSave={this.onProfileSave} />
        </Masonry>
      </Container>
    )
  }
}

export default connect((state) => state)(Profile)
