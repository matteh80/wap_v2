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

    this.state = {
      copied: false
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
          <h3>{translate('recruiter.speechBubble.title')}</h3>
          {translate('recruiter.speechBubble.text1')}
          {translate('recruiter.speechBubble.text2')}
          {translate('recruiter.speechBubble.text3', { profileId: profile.id, occupationName: occupations.userOccupations[0].parent_name, locationName: locations.userLocations[0].parent_name })}
          <Alert onClick={() => this.copyToClipboard('#subject_text')}>
            <div id='subject_text'>
              PR / {profile.id} / {occupations.userOccupations[0].parent_name} / {locations.userLocations[0].parent_name}
            </div>
          </Alert>
          <small>{translate('recruiter.tip')}</small>
        </SpeechBubble>
      </Container>
    )
  }
}

export default connect((state) => state)(PersonalRecruiter)
