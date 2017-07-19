import React from 'react'
import $ from 'jquery'

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
      <blockquote dangerouslySetInnerHTML={this.createMarkup(profile.personal_info)} />
    )
  }
}
