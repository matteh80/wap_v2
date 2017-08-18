import React from 'react'
import classNames from 'classnames'

import {
  Tooltip
} from 'reactstrap'

class ShareDownloadButtons extends React.Component {
  constructor (props) {
    super(props)

    this.download = this.download.bind(this)
    this.share = this.share.bind(this)
  }

  download () {
    this.props.onDownload()
  }

  share () {
    this.props.onShare()
  }

  render () {

    return (
      <div className='shareDownloadWrapper'>
        <div>
          <i className='fa fa-download sdBtn' id='downloadBtn' onClick={() => this.download()} />
          <i className='fa fa-facebook-f sdBtn' id='shareFbBtn' onClick={() => this.share()} />
        </div>
      </div>
    )
  }
}

export default ShareDownloadButtons
