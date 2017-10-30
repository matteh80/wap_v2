import React from 'react'
import $ from 'jquery'

import {
  Row,
  Col
} from 'reactstrap'

export default class ResumeSection extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    // this.setPicture(this.props.picPath)
  }

  createMarkup (text) {
    function str_replace_all (string, str_find, str_replace) {
      try {
        return string.replace(new RegExp(str_find, 'gi'), str_replace)
      } catch (ex) { return string }
    }

    let mText = text.replace(/(\r\n|\r|\n){2,}/g, '$1\n')
    mText = mText.replace(/(?:\r\n|\r|\n)/g, '<br />')

    let to = mText
    to = text.replace(/\n{2}/g, '&nbsp;</p><p>')
    to = to.replace(/\n/g, '&nbsp;<br />')
    to = '<p>' + to + '</p>'

    return { __html: to }
    // return { __html: text.replace(/(?:\r\n|\r|\n)/g, '<br />') }
  }

  render () {
    let { profile } = this.props
    $('blockquote').wrapInner('<p></p>')
    return (
      <section className='cvSection mb-5' id='personal_info'>
        <Row>
          <Col xs={12} className='titleWrapper'>
            {profile.personal_info && profile.personal_info.length > 0 && <h2 className='sectionTitle font-italic'>Resumé</h2>}
          </Col>
          <Col className='line' />
        </Row>
        <div className='description' dangerouslySetInnerHTML={this.createMarkup(profile.personal_info)} />
      </section>
    )
  }
}
