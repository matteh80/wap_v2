import React from 'react'
import classNames from 'classnames'
import $ from 'jquery'
import {
  UncontrolledTooltip
} from 'reactstrap'

class ShareProfileButtons extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      removeClicked: false
    }

    this.onRemove = this.onRemove.bind(this)
    this.onLinkClick = this.onLinkClick.bind(this)
    this.onCopyClick = this.onCopyClick.bind(this)
  }

  onRemove (e) {
    this.setState({ removeClicked: !this.state.removeClicked })
    console.log($(e.target).hasClass('editing'))
    if ($(e.target).hasClass('editing')) {
      this.props.onRemove()
    }
  }

  onLinkClick () {
    this.props.onLinkClick()
  }

  onCopyClick () {
    this.props.onCopyClick()
  }

  render () {
    let { translate } = this.props
    let wrapperClass = classNames(
      'btn-wrapper shareProfileButtons',
      this.state.removeClicked && 'shouldRemove',
    )

    return (
      <div className={wrapperClass}>
        {this.props.editMode &&
        <UncontrolledTooltip placement='bottom' target='link'>
          Visa sida
        </UncontrolledTooltip>
        }
        <UncontrolledTooltip placement='bottom' target='copy'>
          Kopiera länk
        </UncontrolledTooltip>
        <UncontrolledTooltip placement='bottom' target='remove'>
          {translate('editbuttons.remove')}
        </UncontrolledTooltip>
        {!this.state.removeClicked &&
        <div>
          <i className='fa fa-external-link link-btn' id='link' onClick={this.onLinkClick} />
          <i className='fa fa-copy copy-btn' id='copy' onClick={this.onCopyClick} />
          <i className='fa fa-trash remove-btn' id='remove' onClick={this.onRemove} />
        </div>
        }
        {this.state.removeClicked &&
          <div className='justify-content-end align-items-center'>
            <h6 className='mr-3'>{translate('editbuttons.are_you_sure')}</h6>
            <i className='fa fa-check edit-btn editing' onClick={(e) => this.onRemove(e)} />
            <i className='fa fa-times remove-btn' onClick={(e) => this.onRemove(e)} />
          </div>
        }
      </div>
    )
  }
}

export default ShareProfileButtons
