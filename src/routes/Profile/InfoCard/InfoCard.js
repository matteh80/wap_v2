import React from 'react'
import { connect } from 'react-redux'
import ProfilePicture from '../../../components/Misc/ProfilePicture/ProfilePicture'
import '../Profile.scss'
import classNames from 'classnames'
import DatePicker from 'react-datepicker'
import moment from 'moment'

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

class InfoCard extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      editMode: false,
      birthday: moment(this.props.profile.birthday)
    }

    this.toggleEditMode = this.toggleEditMode.bind(this)
    this.revertChanges = this.revertChanges.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
  }

  toggleEditMode () {
    this.state.editMode && this.props.onSave()
    this.setState({
      editMode: !this.state.editMode
    })
    this.props.onOpen()
  }

  revertChanges () {
    this.setState({
      editMode: !this.state.editMode
    })
    this.props.revertChanges()
  }

  handleDateChange (date) {
    this.setState({
      birthday: date
    })
    this.props.onDateChange(date)
  }

  render () {
    let { profile } = this.props

    let wrapperClass = classNames('btn-wrapper', this.state.editMode && 'editing')
    let editBtnClass = classNames('edit-btn fa', this.state.editMode ? 'fa-check editing' : 'fa-pencil')
    let genderClass = classNames('gender-icon fa', profile.gender === 'male' && 'fa-mars', profile.gender === 'female' && 'fa-venus', profile.gender === 'other' && 'fa-venus-mars')

    return (
      <Col xs={12} sm={6} md={4} xl={3}>
        <Card className='profileCard'>
          <div className={wrapperClass}>
            <i className={editBtnClass} onClick={() => this.toggleEditMode()} />
            <i className='fa fa-times cancel-btn' onClick={() => this.revertChanges()} />
          </div>
          <ProfilePicture profile={profile} editMode={this.state.editMode} />
          {!this.state.editMode &&
          <CardBlock>
            <CardTitle className='text-center'>{profile.first_name} {profile.last_name}</CardTitle>
            <CardSubtitle className='text-center'>{profile.title}</CardSubtitle>
            <CardTitle className='text-center'><i className={genderClass} /></CardTitle>
            <Row>
              <Col xs={12}>
                <i className='fa fa-envelope' /> {profile.email} <br />
                {profile.mobile_phone_number && <div><i className='fa fa-phone' /> {profile.mobile_phone_number}</div>}
                {profile.phone_number && <div><i className='fa fa-phone' /> {profile.phone_number}</div>}
                {profile.home_page && <div><i className='fa fa-link' /> {profile.home_page}</div>}
              </Col>
            </Row>
          </CardBlock>
          }

          {this.state.editMode &&
          <CardBlock>
            <Form>
              <FormGroup>
                <Label for='first_name'>Förnamn *</Label>
                <Input type='first_name' name='first_name' id='first_name' defaultValue={profile.first_name}
                  ref={(input) => this.first_name = input} onChange={this.props.onChange} required />
              </FormGroup>
              <FormGroup>
                <Label for='last_name'>Efternamn *</Label>
                <Input type='last_name' name='last_name' id='last_name' defaultValue={profile.last_name}
                  ref={(input) => this.last_name = input} onChange={this.props.onChange} required />
              </FormGroup>

              <FormGroup>
                <Label for='title'>Titel *</Label>
                <Input type='title' name='title' id='title' defaultValue={profile.title}
                  ref={(input) => this.title = input} onChange={this.props.onChange} required />
              </FormGroup>

              <FormGroup>
                <Label for='email'>Epost *</Label>
                <Input type='email' name='email' id='email' defaultValue={profile.email}
                  ref={(input) => this.email = input} onChange={this.props.onChange} required />
              </FormGroup>

              <FormGroup>
                <Label for='mobile_phone_number'>Telefon</Label>
                <Input type='mobile_phone_number' name='mobile_phone_number' id='mobile_phone_number' defaultValue={profile.mobile_phone_number}
                  ref={(input) => this.mobile_phone_number = input} onChange={this.props.onChange} />
              </FormGroup>

              <FormGroup>
                <Label for='phone_number'>Telefon 2</Label>
                <Input type='phone_number' name='phone_number' id='phone_number' defaultValue={profile.phone_number}
                  ref={(input) => this.phone_number = input} onChange={this.props.onChange} />
              </FormGroup>

              <FormGroup>
                <Label for='home_page'>Hemsida</Label>
                <Input type='home_page' name='home_page' id='home_page' defaultValue={profile.home_page}
                  ref={(input) => this.home_page = input} onChange={this.props.onChange} />
              </FormGroup>
              <FormGroup>
                <Label for='gender'>Kön</Label>
                <Input type='select' name='gender' id='gender' defaultValue={profile.gender} onChange={this.props.onChange}>
                  <option value='female'>Kvinna</option>
                  <option value='male'>Man</option>
                  <option value='other'>Annat / okänt</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label>Födelsedatum</Label>
                <DatePicker
                  selected={this.state.birthday}
                  onChange={this.handleDateChange}
                  locale='sv-se'
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode='select'
                  required
                  // withPortal
                />
              </FormGroup>
            </Form>
          </CardBlock>
          }
        </Card>
      </Col>
    )
  }
}

export default connect((state) => state)(InfoCard)
