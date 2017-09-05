import React from 'react'
import { connect } from 'react-redux'
import SpeechBubble from '../../components/Helpers/SpeechBubble/SpeechBubble'
import $ from 'jquery'
import {
  Container,
  Alert
} from 'reactstrap'

class PersonalRecruiter extends React.Component {
  constructor (props) {
    super(props)

    let shouldShow = true

    if (!this.props.wapfilm.video) {
      shouldShow = false
    }

    if (!this.props.talentq.completed && shouldShow) {
      shouldShow = false
    }

    if (this.props.educations.educations && this.props.educations.educations.length === 0 && shouldShow) {
      shouldShow = false
    }

    if (this.props.locations.userLocations && this.props.locations.userLocations.length === 0 && shouldShow) {
      shouldShow = false
    }

    if (this.props.skills.userSkills && this.props.skills.userSkills.length === 0 && shouldShow) {
      shouldShow = false
    }

    if (this.props.occupations.userOccupations && this.props.occupations.userOccupations.length === 0 && shouldShow) {
      shouldShow = false
    }

    if (!this.props.profile.personal_info && shouldShow) {
      shouldShow = false
    }

    this.state = {
      copied: false,
      shouldShow: shouldShow
    }

    this.copyToClipboard = this.copyToClipboard.bind(this)
  }

  copyToClipboard (element) {
    let $temp = $('<input>')
    $('body').append($temp)
    $temp.val($(element).text()).select()
    document.execCommand('copy')
    $temp.remove()
    console.log($(element).text())
    this.setState({ copied: true })
  }

  render () {
    let { translate, profile, occupations, locations } = this.props

    return (
      <Container fluid>
        <SpeechBubble>
          {this.state.shouldShow &&
          <div>
            <h3>{translate('recruiter.speechBubble.title')}</h3>
            {translate('recruiter.speechBubble.text1')}
            {/*{translate('recruiter.speechBubble.text2')}*/}
            {translate('recruiter.speechBubble.text3', {
              profileId: profile.id,
              occupationName: occupations.userOccupations[0].parent_name,
              locationName: locations.userLocations[0].parent_name
            })}
            <Alert onClick={() => this.copyToClipboard('#subject_text')} color={this.state.copied ? 'success' : 'info'}>
              <div id='subject_text'>
                PR / {profile.id} / {occupations.userOccupations[0].parent_name}
                / {locations.userLocations[0].parent_name}
                {this.state.copied && <span className='fg-white float-right'>{translate('recruiter.text_copied')}</span>}
              </div>
            </Alert>
            <small>{translate('recruiter.tip')}</small>
          </div>
          }
          {!this.state.shouldShow &&
            <div>
              <h3>{translate('recruiter.speechBubble.not_done_title')}</h3>
              {translate('recruiter.speechBubble.not_done_text')}
            </div>
          }
        </SpeechBubble>
      </Container>
    )
  }
}

export default connect((state) => state)(PersonalRecruiter)
