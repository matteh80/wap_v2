import React from 'react'
import './LicenseItem.scss'
import update from 'react-addons-update'
import classNames from 'classnames'

import {
  Row,
  Col,
  Card,
  CardBlock,
  CardTitle,
  Progress
} from 'reactstrap'

class LicenseItem extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      editMode: false,
      license: Object.assign({}, this.props.license)
    }

    this.onChange = this.onChange.bind(this)
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.editMode !== prevState.editMode) {
      this.props.layout()
    }
  }

  onChange (value, type) {
    this.setState({
      license: update(this.state.license, { [type]: { $set: value } })
    })
  }

  toggleEditMode () {
    this.state.editMode && this.props.onChange(this.state.license)
    this.setState({
      editMode: !this.state.editMode
    })
  }

  revertChanges () {
    this.setState({
      editMode: !this.state.editMode,
      license: this.props.license
    })
  }

  render () {
    let { license } = this.props
    let wrapperClass = classNames('btn-wrapper', this.state.editMode && 'editing')
    let editBtnClass = classNames('edit-btn fa', this.state.editMode ? 'fa-check editing' : 'fa-pencil')

    return (
      <Col xs={12} sm={6} md={3} xl={2} className='licenseItem'>
        <Card>
          <div className={wrapperClass}>
            <i className={editBtnClass} onClick={() => this.toggleEditMode()} />
            <i className='fa fa-times remove-btn' onClick={() => this.props.onRemove(license.id)} />
          </div>
          <CardBlock>
            <CardTitle>{license.name}</CardTitle>
            <div className='licenseInfo'>
              <div
                className={'licenseicon-korkort-' + license.name.replace(' ', '-').replace(' ', '-').replace('å', 'a').toLowerCase() + ' licenseIcon'} />
            </div>
          </CardBlock>
        </Card>
      </Col>
    )
  }
}

export default LicenseItem
