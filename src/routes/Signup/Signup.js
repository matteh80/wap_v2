import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import moment from 'moment'
import ProfilePicture from '../../components/Misc/ProfilePicture/ProfilePicture'
import Select from 'react-select'
import $ from 'jquery'
import UserIsAuthenticated from '../../routes/auth'
import classNames from 'classnames'
import SpeechBubble from '../../components/Helpers/SpeechBubble/SpeechBubble'
import _ from 'lodash'
import axios from 'axios'

import { getProfile, updateProfile } from '../../store/actions/profile'
import { getAllEmployments, createEmployment } from '../../store/actions/employments'
import { getAllEducations } from '../../store/actions/educations'
import { getAllOccupations, getMyOccupations, saveOccupationsToServer } from '../../store/actions/occupations'
import { getAllSkills, getMySkills, saveSkillsToServer } from '../../store/actions/skills'
import { getAllLanguages, getMyLanguages } from '../../store/actions/languages'
import { getAllMotivations, getMyMotivations } from '../../store/actions/motivations'
import { getAllPersonalities, getMyPersonalities } from '../../store/actions/personalities'
import { getVideoInfo } from '../../store/actions/wapfilm'
import { getAllLicenses, getMyLicenses } from '../../store/actions/drivinglicenses'
import { getAllReferences } from '../../store/actions/references'
import { getAllQuestions, saveQuestions } from '../../store/actions/dreamjob'
import { getAllLocations } from '../../store/actions/locations'

import {
  Container,
  Row,
  Col,
  Card,
  CardTitle,
  CardSubtitle,
  CardBlock,
  Label,
  FormGroup,
  Collapse,
  Input
} from 'reactstrap'

import { AvForm, AvField, AvInput, AvRadioGroup, AvRadio, AvGroup } from 'availity-reactstrap-validation'
import DatePicker from 'react-datepicker'
import ThreeDButton from '../../components/buttons/ThreeDButton'
import StartEndDate from '../../components/Misc/StartEndDate/StartEndDate'

let occupationDefault
let redirect
class Signup extends React.Component {
  constructor (props) {
    super(props)

    redirect = this.props.routing.locationBeforeTransitions ? this.props.routing.locationBeforeTransitions.query.redirect : null

    document.title = 'Slutför registrering | wap card'

    let { occupations } = this.props.occupations
    let categoryitem = occupations[0]
    let item = occupations[0].occupations[0]

    occupationDefault = {
      label: item.name + ' (' + categoryitem.name + ')',
      value: item.id,
      name: item.name,
      id: item.id,
      parent_name: categoryitem.name,
    }

    this.state = {
      job: _.includes(_.words(redirect), 'jobs'),
      jobTitle: null,
      profile: {
        ...this.props.profile,
        gender: 'female',
        actively_searching: true,
        availability: 1,
        birthday: moment().format('YYYY-MM-DD'),
        salary_expectations_min: 20000,
        salary_expectations_max: 30000,
      },
      birthday: this.props.profile.birthday ? moment(this.props.profile.birthday) : moment(),
      selectValue: null,
      selectSkillValue: null,
      selectEmploymentValue: occupationDefault,
      employment: {
        start_date: moment().format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD'),
        occupation: occupationDefault.id,
        description: '',
        public: true
      },
      noEmployment: false,
      dreamjob: null,
      loadsave: false
    }

    this.handleBirthdayChange = this.handleBirthdayChange.bind(this)
    this._getOptions = this._getOptions.bind(this)
    this.onOccupationChange = this.onOccupationChange.bind(this)
    this.onSkillChange = this.onSkillChange.bind(this)
    this.onEmploymentOccupationChange = this.onEmploymentOccupationChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.handleNoEmployment = this.handleNoEmployment.bind(this)
    this.handleEmploymentInputChange = this.handleEmploymentInputChange.bind(this)
    this.handleEmploymentDateChange = this.handleEmploymentDateChange.bind(this)
    this.saveToServer = this.saveToServer.bind(this)
    this.finalize = this.finalize.bind(this)
  }

  componentDidMount () {
    if (this.state.job) {
      let jobId = _.words(redirect)[1]
      axios.get('https://api.wapcard.se/api/v1/jobs/' + jobId).then((result) => {
        this.setState({
          jobTitle: result.data.title
        })
      })
    }
  }

  handleBirthdayChange (date) {
    this.setState({
      birthday: date,
      profile: {
        ...this.state.profile,
        birthday: date ? date.format('L') : moment()
      }
    })
  }

  _getOptions (noUserOccupations) {
    let { occupations, userOccupations } = this.props.occupations
    let optiondata = []
    let index = -1

    $.each(occupations, function (i, categoryitem) {
      $.each(categoryitem.occupations, function (x, item) {
        if (!noUserOccupations) {
          index = userOccupations.findIndex(userOccupations => userOccupations.id === item.id)
        }

        if (index === -1) {
          optiondata.push({
            label: item.name + ' (' + categoryitem.name + ')',
            value: item.id,
            name: item.name,
            id: item.id,
            parent_name: categoryitem.name,
          })
        }
      })
    })

    optiondata.sort(function (a, b) {
      if (a.label < b.label) return -1
      if (a.label > b.label) return 1
      return 0
    })

    return optiondata
  }

  onOccupationChange (value) {
    this.setState({
      selectValue: value
    })
  }

  getSkillOptions () {
    let { skills, userSkills } = this.props.skills
    let optiondata = []
    let index = -1

    $.each(skills, function (i, categoryitem) {
      $.each(categoryitem.skills, function (x, item) {
        index = userSkills.findIndex(userSkills => userSkills.id === item.id)
        if (index === -1) {
          optiondata.push({
            label: item.name + ' (' + categoryitem.name + ')',
            value: item.id,
            name: item.name,
            id: item.id,
            parent_name: categoryitem.name,
          })
        }
      })
    })

    optiondata.sort(function (a, b) {
      if (a.label < b.label) return -1
      if (a.label > b.label) return 1
      return 0
    })

    return optiondata
  }

  onSkillChange (value) {
    this.setState({
      selectSkillValue: value
    })
  }

  onEmploymentOccupationChange (value) {
    // this.setState({ selectEmploymentValue: value })
    this.setState({
      selectEmploymentValue: value,
      employment: {
        ...this.state.employment,
        occupation: value.id
      }
    })
  }

  handleNoEmployment (event) {
    this.setState({ noEmployment: event.target.checked })
  }

  handleInputChange (event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    if (name === 'dreamjob') {
      this.setState({
        dreamjob: {
          id: this.props.dreamjob[0].id,
          answer: value
        }
      })
    } else {
      this.setState({
        profile: {
          ...this.state.profile,
          [name]: value
        }
      })
    }
  }

  handleEmploymentInputChange (event) {
    const target = event.target
    if (target) {
      const value = target.type === 'checkbox' ? target.checked : target.value
      const name = target.name

      this.setState({
        employment: {
          ...this.state.employment,
          [name]: value,
        }
      })
    }
  }

  handleEmploymentDateChange (startDate, endDate, hasError, current) {
    this.setState({
      employment: {
        ...this.state.employment,
        start_date: moment(startDate).format('YYYY-MM-DD'),
        end_date: moment(endDate).format('YYYY-MM-DD'),
        hasError: hasError,
        current: current
      }
    })
  }

  onSubmit () {
    this.setState({ loadsave: true })
    $('.hiddenBtn').each(function (el, i) {
      $(this).click()
    })
    if ($('form.av-invalid').not('.willNotValidate').length === 0) {
      console.log('valid')
      this.saveToServer()
    } else {
      console.log('invalid')
      this.setState({ loadsave: false })
      $('html, body').animate({
        scrollTop: $('.av-invalid').offset().top
      }, 1000)
    }
  }

  saveToServer () {
    let { dispatch } = this.props

    let mSkillList = []
    this.state.selectSkillValue.map((skill) => {
      let mSkill = Object.assign(skill, { experience: 0 })
      mSkillList.push(mSkill)
    })

    let mAnswer = [this.state.dreamjob]

    Promise.all([
      dispatch(updateProfile(this.state.profile)),
      dispatch(saveOccupationsToServer(this.state.selectValue)),
      dispatch(saveSkillsToServer(mSkillList)),
      !this.state.noEmployment && dispatch(createEmployment(this.state.employment)),
      dispatch(saveQuestions(mAnswer))
    ]).catch((error) => {
      console.log(error)
    }).then((result) => {
      console.log('DONE')
      this.finalize()
    })
  }

  finalize () {
    let { dispatch } = this.props
    this.props.auth.token && dispatch(getProfile(this.props.auth.token)).then((result) => {
      let redirect = this.props.routing.locationBeforeTransitions ? this.props.routing.locationBeforeTransitions.query.redirect : null

      Promise.all([
        dispatch(getAllEmployments()),
        dispatch(getAllEducations()),
        dispatch(getAllOccupations()),
        dispatch(getMyOccupations()),
        dispatch(getAllSkills()),
        dispatch(getMySkills()),
        dispatch(getAllLanguages()),
        dispatch(getMyLanguages()),
        dispatch(getAllMotivations()),
        dispatch(getMyMotivations()),
        dispatch(getAllPersonalities()),
        dispatch(getMyPersonalities()),
        dispatch(getVideoInfo()),
        dispatch(getAllLicenses()),
        dispatch(getMyLicenses()),
        dispatch(getAllReferences()),
        dispatch(getAllQuestions()),
        dispatch(getAllLocations())
      ]).then(() => {
        this.props.router.push(redirect || '/')
      }).catch((error) => {
        console.log(error)
        this.setState({
          loadsave: false
        })
      })
    })
  }

  render () {
    let { translate } = this.context

    return (
      <Container className='py-5'>
        <div className='flex-column'>
          <SpeechBubble xs='12'>
            {this.state.job && translate('signup.help_job', { jobName: this.state.jobTitle })}
            {!this.state.job && translate('signup.help')}
          </SpeechBubble>
          <Col xs='12'>
            <Row className='justify-content-center align-items-center mb-3'>
              <Col xs='12' sm='6' md='4' lg='3'>
                <Card>
                  <CardBlock>
                    <ProfilePicture editMode />
                  </CardBlock>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col xs='12'>
            <Card>
              <CardBlock>
                <CardTitle>{translate('signup.personal_info')}</CardTitle>
                <AvForm model={this.state.profile.first_name ? this.state.profile : null}>
                  <Row>
                    <Col xs='12' md='6'>
                      <AvField onChange={(e) => this.handleInputChange(e)} name='first_name' label={translate('signup.first_name')} type='text' required errorMessage={translate('error_msg.default')} />
                    </Col>
                    <Col xs='12' md='6'>
                      <AvField onChange={(e) => this.handleInputChange(e)} name='last_name' label={translate('signup.last_name')} type='text' required />
                    </Col>
                    <Col xs='12' md='6'>
                      <AvField onChange={(e) => this.handleInputChange(e)} name='title' label={translate('signup.title')} type='text' required />
                    </Col>

                    <Col xs='12' md='6'>
                      <FormGroup>
                        <Label>Födelsedatum</Label>
                        <DatePicker
                          selected={this.state.birthday}
                          onChange={this.handleBirthdayChange}
                          locale='sv-se'
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dateFormat='YYYY-MM-DD'
                          dropdownMode='select'
                          required
                          withPortal
                        />
                      </FormGroup>
                    </Col>
                    <Col xs='12' md='6' className='custom-radio'>
                      <AvRadioGroup onChange={(e) => this.handleInputChange(e)} inline name='gender' required>
                        <Row>
                          <Col xs='12'>
                            <Label>Kön</Label>
                          </Col>
                        </Row>
                        <AvRadio label={translate('signup.female')} value='female' id='female' />
                        <AvRadio label={translate('signup.male')} value='male' id='male' />
                        <AvRadio label={translate('signup.other')} value='other' id='other' />
                      </AvRadioGroup>
                    </Col>
                  </Row>
                  <Row className='mt-3'>
                    <Col xs='12'>
                      <CardSubtitle>Kontaktuppgifter</CardSubtitle>
                    </Col>
                    <Col xs='12' md='6'>
                      <AvField onChange={(e) => this.handleInputChange(e)} name='address' label={translate('signup.address')} type='text' required />
                    </Col>
                    <Col xs='12' md='6'>
                      <Row>
                        <Col xs='12' md='4'>
                          <AvField onChange={(e) => this.handleInputChange(e)} name='zip_code' label={translate('signup.zip_code')} type='text' required
                                   validate={{ number: true }} errorMessage='Endast siffror, inga mellanslag' />
                        </Col>
                        <Col xs='12' md='8'>
                          <AvField onChange={(e) => this.handleInputChange(e)} name='city' label={translate('signup.city')} type='text' required />
                        </Col>
                      </Row>
                    </Col>
                    <Col xs='12' md='6'>
                      <AvField onChange={(e) => this.handleInputChange(e)} name='mobile_phone_number' label={translate('signup.phone_number')} type='text' required
                        validate={{ number: true }} errorMessage={translate('error_msg.number')} />
                    </Col>
                  </Row>
                  <Row className='mt-3'>
                    <Col xs='12'>
                      <CardSubtitle>Övrigt</CardSubtitle>
                    </Col>
                    <Col xs='12' md='6'>
                      <Label check inline>
                        <AvInput onChange={(e) => this.handleInputChange(e)} type='checkbox' name='actively_searching' defaultValue={this.state.profile.actively_searching} /> {translate('signup.actively_searching')}
                      </Label>
                    </Col>
                    <Col xs='12' md='6'>
                      <Label check inline>
                        <AvInput onChange={(e) => this.handleInputChange(e)} type='checkbox' name='student' /> {translate('signup.student')}
                      </Label>
                    </Col>
                    <Col xs='12' className='mt-3' style={{ marginTop: 10, paddingTop:10, borderTop: '1px solid #eee' }}>
                      <AvField onChange={(e) => this.handleInputChange(e)} name='dreamjob' label={translate('signup.dreamjob')} type='text' required />
                    </Col>
                  </Row>
                  <button type='submit' className='hiddenBtn' hidden />
                </AvForm>
              </CardBlock>
            </Card>

            <Card>
              <CardBlock>
                <CardTitle>Jag vill helst jobba inom *</CardTitle>
                <CardSubtitle>Välj minst ett område du vill jobba inom</CardSubtitle>
                <AvForm>
                  <FormGroup>
                    <Select
                      options={this._getOptions()}
                      clearable
                      multi
                      placeholder='Välj yrke'
                      value={this.state.selectValue}
                      onChange={this.onOccupationChange}
                    />
                  </FormGroup>
                  <AvField name='occupations' type='hidden' value={this.state.selectValue} required />
                  <button type='submit' className='hiddenBtn' hidden />
                </AvForm>
              </CardBlock>
            </Card>

            <Card>
              <CardBlock>
                <CardTitle>Mina främsta kompetenser är *</CardTitle>
                <CardSubtitle>Välj minst en av dina främsta kompetenser</CardSubtitle>
                <AvForm>
                  <FormGroup>
                    <Select
                      options={this.getSkillOptions()}
                      clearable
                      multi
                      placeholder='Välj kompetens'
                      value={this.state.selectSkillValue}
                      onChange={this.onSkillChange}
                    />
                  </FormGroup>
                  <AvField name='skills' type='hidden' value={this.state.selectSkillValue} required />
                  <button type='submit' className='hiddenBtn' hidden />
                </AvForm>
              </CardBlock>
            </Card>

            <Card>
              <CardBlock>
                <CardTitle>Min senaste anställning</CardTitle>
                <CardSubtitle>Lägg till den anställning du hade senast</CardSubtitle>
                <Collapse isOpen={!this.state.noEmployment}>
                  <AvForm model={this.state.employment} className={classNames(this.state.noEmployment && 'willNotValidate')}>
                    <Row>
                      <Col xs='12' md='6'>
                        <AvField onChange={(e) => this.handleEmploymentInputChange(e)} name='employer' label={translate('employments.employer')} type='text' required errorMessage={translate('error_msg.default')} />
                      </Col>
                      <Col xs='12' md='6'>
                        <AvField onChange={(e) => this.handleEmploymentInputChange(e)} name='title' label={translate('employments.title')} type='text' required errorMessage={translate('error_msg.default')} />
                      </Col>
                      <Col xs='12' md='6'>
                        <StartEndDate onChange={this.handleEmploymentDateChange} withCurrent foo={this.state.employment} />
                      </Col>
                      <Col xs='12' md='6'>
                        <FormGroup>
                          <Label>{translate('employments.occupation')}</Label>
                          <Select
                            options={this._getOptions(false)}
                            clearable={false}
                            placeholder='Välj yrke'
                            value={this.state.selectEmploymentValue}
                            onChange={this.onEmploymentOccupationChange}
                            />
                        </FormGroup>
                      </Col>
                    </Row>
                    <button type='submit' className='hiddenBtn' hidden />
                  </AvForm>
                </Collapse>

                <Row>
                  <Col xs='12' className='mt-3' style={{ marginTop: 10, paddingTop:10, borderTop: '1px solid #eee' }}>
                    <Label>
                      <Input type='checkbox' name='no_previous' defaultValue={false} onChange={this.handleNoEmployment} /> {translate('signup.no_previous_employment')}
                    </Label>
                  </Col>
                </Row>

              </CardBlock>
            </Card>

            <Card>
              <CardBlock>
                <Row>
                  <AvForm>
                    <Col xs='12'>
                      <small>
                      De uppgifter som du uppger i din wap card-profil lagras i vår databas för att vi i Maxkompetens koncernen (nedan företaget) ska kunna administrera din wap card-profil och matcha det mot lämpliga karriärsutmaningar. Uppgifterna kan förekomma skriftligen, muntligen eller som bild, film- eller ljudinspelning. Vi garanterar att dina uppgifter inte kommer att användas i andra sammanhang eller av andra företag utan ditt medgivande. Vårt dataregister samkörs inte med register från tredje part. Dina uppgifter kommer inte att lagras längre än nödvändigt för att vi ska kunna uppfylla våra förpliktelser mot dig. Upphovsrätt, under förutsättning att du har överlämnat eller laddat upp meterial såsom bilder, film- eller ljudinspelningar till företaget, alternativt på annat sätt registrerat dem i företagets system, överlåter du genom godkännande av integritetsvillkoren samtliga dina eventuella rättigheter av material till företaget. Du kan när som helst ändra dina uppgifter i din wap profil. Du ansvarar själv för att innehållet är aktuellt och återspeglar din status. All insamling och behandling av personuppgifter sker i enlighet med bestämmelserna i personuppgiftslagen (PuL). Med personuppgifter avses alla uppgifter som kan användas för att identifiera en person, till exempel namn, hemadress och e-postadress. Med behandling av personuppgifter avses alla åtgärder som vidtas med personuppgifter såsom exempelvis insamling, lagring och bearbetning. Vill du veta mer om PUL? Läs vidare på www.datainspektionen.se. Enligt personuppgiftslagen 1998:204 (PuL) får ingen registrering ske utan personens medgivande. Om du samtycker till att dina uppgifter lagras så måste du markera kryssrutan för godkännande innan du kommer vidare till din wap profil.
                    </small>
                    </Col>
                    <Col xs='12' className='mt-3'>
                      <Label>
                        <AvInput onChange={(e) => this.handleInputChange(e)} type='checkbox' name='tos_accepted' required /> {translate('signup.tos')}
                      </Label>
                    </Col>
                    <Col xs='12'>
                      <button type='submit' className='hiddenBtn' hidden />
                      <ThreeDButton loading={this.state.loadsave} onClick={() => this.onSubmit()}>Klar</ThreeDButton>
                    </Col>
                  </AvForm>
                </Row>
              </CardBlock>
            </Card>
          </Col>
        </div>
      </Container>
    )
  }
}

Signup.contextTypes = {
  translate: PropTypes.func
}

export default UserIsAuthenticated(withRouter(connect((state) => state)(Signup)))
