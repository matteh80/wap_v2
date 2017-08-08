import React from 'react'
import classNames from 'classnames'
import $ from 'jquery'
import {
  UncontrolledTooltip
} from 'reactstrap'

class EditButtons extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      removeClicked: false
    }

    this.onRemove = this.onRemove.bind(this)
  }

  onRemove (e) {
    this.setState({ removeClicked: !this.state.removeClicked })
    console.log($(e.target).hasClass('editing'))
    if ($(e.target).hasClass('editing')) {
      this.props.onRemove()
    }
  }

  render () {
    let { translate } = this.props
    let wrapperClass = classNames(
      'btn-wrapper',
      this.props.editMode && 'editing',
      this.state.removeClicked && 'shouldRemove',
      this.props.hasRemove && 'hasRemove',
      this.props.onlyRemove && 'onlyRemove'
    )
    let editBtnClass = classNames('edit-btn fa', this.props.editMode ? 'fa-check editing' : 'fa-pencil')

    return (
      <div className={wrapperClass}>
        {this.props.editMode &&
        <UncontrolledTooltip placement='bottom' target='done'>
          {translate('editbuttons.done')}
        </UncontrolledTooltip>
        }
        <UncontrolledTooltip placement='bottom' target='cancel'>
          {translate('editbuttons.cancel')}
        </UncontrolledTooltip>
        <UncontrolledTooltip placement='bottom' target='remove'>
          {translate('editbuttons.remove')}
        </UncontrolledTooltip>
        {!this.state.removeClicked &&
        <div>
          <i className={editBtnClass} id={this.props.editMode ? 'done' : 'edit'}
            onClick={() => this.props.toggleEditMode()} />
          <i className='fa fa-mail-reply cancel-btn' id='cancel' onClick={() => this.props.revertChanges()} />
          <i className='fa fa-trash remove-btn' id='remove' onClick={(e) => this.onRemove(e)} />
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

export default EditButtons
