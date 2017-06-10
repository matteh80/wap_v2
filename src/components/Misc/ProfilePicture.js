import React from 'react'

const defaultPic = require('../../../public/img/no_picture.jpg')

export default class ProfilePicture extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      imageUrl: 'https://api.wapcard.se/api/v1/profiles/' + this.props.profile.id + '/picture/500?' + this.props.profile.picture
    }

    this.onError = this.onError.bind(this)
  }

  onError () {
    this.setState({
      imageUrl: defaultPic
    })
  }

  render () {
    return (
      <img src={this.state.imageUrl} className='img-fluid' />
    )
  }
}