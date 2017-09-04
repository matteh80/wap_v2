import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import $ from 'jquery'

import {
  Col,
  Card,
  CardBlock,
  CardTitle,
  FormGroup,
  Input
} from 'reactstrap'

class ResumeCard extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      editMode: !this.props.profile.personal_info
    }

    this.toggleEditMode = this.toggleEditMode.bind(this)
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

  createMarkup (text) {
    function str_replace_all (string, str_find, str_replace) {
      try {
        return string.replace(new RegExp(str_find, 'gi'), str_replace)
      } catch (ex) { return string }
    }

    if (text) {
      let mText = text.replace(/(\r\n|\r|\n){2,}/g, '$1\n')
      mText = mText.replace(/(?:\r\n|\r|\n)/g, '<br />')

      let to = mText
      to = text.replace(/\n{2}/g, '&nbsp;</p><p>')
      to = to.replace(/\n/g, '&nbsp;<br />')
      to = '<p>' + to + '</p>'

      return { __html: to }
    }
    return { __html: '' }

    // return { __html: text.replace(/(?:\r\n|\r|\n)/g, '<br />') }
  }

  render () {
    let wrapperClass = classNames('btn-wrapper', this.state.editMode && 'editing')
    let editBtnClass = classNames('edit-btn fa', this.state.editMode ? 'fa-check editing' : 'fa-pencil')
    $('blockquote').wrapInner('<p></p>')

    return (
      <Col xs={12} md={8} xl={6}>
        <Card>
          <div className={wrapperClass}>
            <i className={editBtnClass} onClick={() => this.toggleEditMode()} />
            <i className='fa fa-times cancel-btn' onClick={() => this.revertChanges()} />
          </div>
          <CardBlock>
            <CardTitle>Resumé</CardTitle>
            {!this.state.editMode &&
            <blockquote dangerouslySetInnerHTML={this.createMarkup(this.props.profile.personal_info)} />
            }
            {this.state.editMode &&
            <FormGroup>
              <Input type='textarea' name='personal_info' id='personal_info' rows='10' placeholder='Här skriver du lite kort om vem du är, vilka styrkor du har, vad som driver dig. '
                     defaultValue={this.props.profile.personal_info} onChange={this.props.onChange} />
            </FormGroup>
            }
          </CardBlock>
        </Card>
      </Col>
    )
  }
}

export default connect((state) => state)(ResumeCard)
