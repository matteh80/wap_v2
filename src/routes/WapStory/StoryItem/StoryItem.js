import React from 'react'
import Select from 'react-select'
import classNames from 'classnames'
import $ from 'jquery'
import moment from 'moment'
import {
  Col,
  Card,
  CardBlock,
  CardTitle,
  CardSubtitle,
  CardText,
  Label,
} from 'reactstrap'
import StartEndDate from '../../../components/Misc/StartEndDate/StartEndDate'
import Loader from '../../../components/Misc/Loader/Loader'
import EditButtons from '../../../components/buttons/EditButtons'
import { AvForm, AvGroup, AvField, AvInput } from 'availity-reactstrap-validation'

class StoryItem extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      story: this.props.story,
      loadsave:false,
      editmode: false,
    }

    this._getStartEndDate = this._getStartEndDate.bind(this)
    this.toggleEditMode = this.toggleEditMode.bind(this)
    this._handleSubmit = this._handleSubmit.bind(this)
    this._handleDateChange = this._handleDateChange.bind(this)
  }

  _getStartEndDate (startDate, endDate) {
    moment.locale('sv-SE')
    if (endDate) {
      return moment(startDate).format('MMM YYYY') + ' - ' + moment(endDate).format('MMM YYYY')
    }
    return moment(startDate).format('MMM YYYY') + ' - Pågående'
  }

  toggleEditMode () {
    if (this.state.editMode && !_.isEqual(this.state.story, this.props.story)) {
      $('#mSubmitBtn').click()
    } else {
      this.setState({
        loadsave: false,
        editMode: !this.state.editMode,
      })
    }
  }

  _handleDateChange (startDate, endDate, hasError, current) {
    this.setState({
      employment: {
        ...this.state.employment,
        start_date: moment(startDate).format('YYYY-MM-DD'),
        end_date: moment(endDate).format('YYYY-MM-DD'),
        current: current
      }
    })
  }

  _handleInputChange (e) {
    const target = e.target

    if (target) {
      const value = target.type === 'checkbox' ? target.checked : target.value
      const name = target.name

      this.setState({
        story: {
          ...this.state.story,
          [name]: value
        }
      })
    }
  }

  _handleSubmit (event, errors, values) {
    if (errors.length === 0) {
      this.props.onChange(this.state.story)
      this.setState({
        loadsave: true,
        editMode: false,
      })
    }
  }

  render () {
    let { story } = this.state
    let { id, recruitment_agency, company_name, position_name, description, comment, contact_person, reference, finished, start_date, end_date } = this.props.story
    let timelineClass = classNames(
      'timeline-item'
    )

    return (
      <Col className={timelineClass}>
        <div className='timeline-fulldate'>
          {this._getStartEndDate(start_date, end_date)}
        </div>
        <div className='timeline-img' />
        <div className='timeline-content'>
          <Card>
            <Loader active={this.state.loadsave} />
            <EditButtons hasRemove editMode={this.state.editMode} toggleEditMode={this.toggleEditMode} revertChanges={this.revertChanges} onRemove={this.onRemove} translate={this.props.translate} />
            {!this.state.editMode &&
            <CardBlock>
              <CardTitle>{company_name}</CardTitle>
              <CardSubtitle>{recruitment_agency}</CardSubtitle>
              <CardText><small>{description}</small></CardText>
              {comment && <blockquote><small>{comment}</small></blockquote>}
            </CardBlock>
            }
            {this.state.editMode &&
            <CardBlock>
              <AvForm id='storyForm' model={this.state.story} style={{ marginTop: 40 }} onSubmit={this._handleSubmit}>
                <AvGroup>
                  <Label for='employer'>Företag *</Label>
                  <AvField type='text' name='company_name' onChange={this._handleInputChange} required />
                </AvGroup>
                <AvGroup>
                  <Label for='title'>Befattning *</Label>
                  <AvField type='text' name='recruitment_agency' onChange={this._handleInputChange} required />
                </AvGroup>
                <StartEndDate foo={this.state.story} onChange={this._handleDateChange} />
                <AvGroup>
                  <Label for='description'>Jag bidrar / bidrog med *</Label>
                  <AvField type='textarea' name='description' rows='4' onChange={this._handleInputChange} />
                </AvGroup>
                <button type='submit' id='mSubmitBtn' hidden />
              </AvForm>
            </CardBlock>
            }
          </Card>
        </div>
      </Col>
    )
  }
}

export default StoryItem
