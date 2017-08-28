import React from 'react'
import './ReferenceItem.scss'
import classNames from 'classnames'

import {
  Col,
  Row,
  Card,
  CardBlock,
  CardTitle,
  CardSubtitle,
  Label
} from 'reactstrap'

import { AvForm, AvGroup, AvField } from 'availity-reactstrap-validation'
import Loader from '../../../components/Misc/Loader/Loader'

let _ = require('lodash')

class ReferenceItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      editMode: false,
      reference: Object.assign({}, this.props.reference)
    }

    this._handleInputChange = this._handleInputChange.bind(this)
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.editMode !== prevState.editMode) {
      this.props.layout()
    }
  }

  componentWillReceiveProps (newProps) {
    if (_.isEqual(this.state.reference, newProps.reference) && this.state.loadsave) {
      this.setState({
        loadsave: false
      })
    }
  }

  toggleEditMode () {
    if (this.state.editMode && !_.isEqual(this.state.reference, this.props.reference)) {
      this.props.onChange(this.state.reference)
      this.setState({
        loadsave: true,
        editMode: false,
      })
    } else {
      this.setState({
        loadsave: false,
        editMode: !this.state.editMode,
      })
    }
  }

  revertChanges () {
    this.setState({
      editMode: !this.state.editMode,
      reference: this.props.reference
    })
  }

  _handleInputChange (event) {
    const target = event.target

    if (target) {
      const value = target.type === 'checkbox' ? target.checked : target.value
      const name = target.name

      this.setState({
        reference: {
          ...this.state.reference,
          [name]: value
        }
      })
    }
  }

  render () {
    let { reference } = this.props
    let wrapperClass = classNames('btn-wrapper hasRemove', this.state.editMode && 'editing')
    let editBtnClass = classNames('edit-btn fa', this.state.editMode ? 'fa-check editing' : 'fa-pencil')

    return (
      <Col xs={12} sm={6} md={4} xl={3} className='referenceItem'>
        <Card>
          <Loader active={this.state.loadsave} />
          <div className={wrapperClass}>
            <i className={editBtnClass} onClick={() => this.toggleEditMode()} />
            <i className='fa fa-mail-reply cancel-btn' onClick={() => this.revertChanges()} />
            <i className='fa fa-times remove-btn' onClick={() => this.props.onRemove(reference)} />
          </div>
          {!this.state.editMode &&
          <CardBlock>
            <CardTitle>{reference.name}</CardTitle>
            <CardSubtitle>{reference.relation} {reference.employer}</CardSubtitle>
            <Col xs={12}>
              {reference.phone &&
              <Row className='align-items-center'>
                <i className='fa fa-phone' /><a href={'tel:' + reference.phone}>{reference.phone}</a>
              </Row>
              }
              <Row className='align-items-center'>
                <i className='fa fa-envelope' /><a href={'mailto:' + reference.email}>{reference.email}</a>
              </Row>
            </Col>
          </CardBlock>
          }
          {this.state.editMode &&
            <CardBlock>
              <AvForm>
                <AvGroup>
                  <Label for='name'>Namn *</Label>
                  <AvField type='text' name='name' id='name' defaultValue={reference.name}
                           onChange={this._handleInputChange} required />
                </AvGroup>
                <AvGroup>
                  <Label for='employer'>Företag *</Label>
                  <AvField type='text' name='employer' id='employer' defaultValue={reference.employer}
                           onChange={this._handleInputChange} required />
                </AvGroup>
                <AvGroup>
                  <Label for='relation'>Relation *</Label>
                  <AvField type='text' name='relation' id='relation' defaultValue={reference.relation}
                           onChange={this._handleInputChange} required />
                </AvGroup>
                <AvGroup>
                  <Label for='email'>Epost</Label>
                  <AvField type='email' name='email' id='email' defaultValue={reference.email}
                           onChange={this._handleInputChange} required />
                </AvGroup>
                <AvGroup>
                  <Label for='phone'>Telefon</Label>
                  <AvField type='text' name='phone' id='phone' defaultValue={reference.phone}
                           onChange={this._handleInputChange} validate={{ number: true }} errorMessage='Endast siffror tillåtna' />
                </AvGroup>
              </AvForm>
            </CardBlock>
          }
        </Card>
      </Col>
    )
  }
}

export default ReferenceItem
