import React from 'react'
import { connect } from 'react-redux'
import ProfilePicture from '../../../components/Misc/ProfilePicture'
import '../Profile.scss'
import classNames from 'classnames'

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

class InfoCard extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      editMode: false
    }

    this.toggleEditMode = this.toggleEditMode.bind(this)
  }

  toggleEditMode () {
    this.state.editMode && this.props.onSave()
    this.setState({
      editMode: !this.state.editMode
    })
  }

  render () {
    let { profile } = this.props

    let editBtnClass = classNames('edit-btn fa', this.state.editMode ? 'fa-check editing' : 'fa-pencil')

    return (
      <Col xs={12} sm={6} md={4} xl={3}>
        <Card className='profileCard'>
          <i className={editBtnClass} onClick={() => this.toggleEditMode()} />
          <ProfilePicture profile={profile} />
          {!this.state.editMode &&
          <CardBlock>
            <CardTitle className='text-center'>{profile.first_name} {profile.last_name}</CardTitle>
            <CardSubtitle className='text-center'>{profile.title}</CardSubtitle>
            <Row>
              <Col xs={12}>
                <i className='fa fa-envelope'/> {profile.email} <br />
                {profile.mobile_phone_number && <div><i className='fa fa-phone'/> {profile.mobile_phone_number}</div>}
                {profile.phone_number && <div><i className='fa fa-phone'/> {profile.phone_number}</div>}
                {profile.homepage && <div><i className='fa fa-link'/> {profile.homepage}</div>}
              </Col>
            </Row>
          </CardBlock>
          }

          {this.state.editMode &&
          <CardBlock>
            <Form>
              <FormGroup>
                <Label for='first_name'>Förnamn</Label>
                <Input type='first_name' name='first_name' id='first_name' defaultValue={profile.first_name}
                       ref={(input) => this.first_name = input} onChange={this.props.onChange} />
              </FormGroup>
              <FormGroup>
                <Label for='last_name'>Efternamn</Label>
                <Input type='last_name' name='last_name' id='last_name' defaultValue={profile.last_name}
                       ref={(input) => this.last_name = input} onChange={this.props.onChange} />
              </FormGroup>

              <FormGroup>
                <Label for='email'>Epost</Label>
                <Input type='email' name='email' id='email' defaultValue={profile.email}
                       ref={(input) => this.email = input} onChange={this.props.onChange} />
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
                <Label for='homepage'>Hemsida</Label>
                <Input type='homepage' name='homepage' id='homepage' defaultValue={profile.homepage}
                       ref={(input) => this.homepage = input} onChange={this.props.onChange} />
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
