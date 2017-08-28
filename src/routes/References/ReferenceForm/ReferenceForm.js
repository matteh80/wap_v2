import React from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import $ from 'jquery'
import classNames from 'classnames'
import { createReference, getAllReferences } from '../../../store/actions/references'

import {
  Collapse,
  Card,
  CardBlock,
  CardTitle,
  Label,
  UncontrolledTooltip
} from 'reactstrap'

import { AvForm, AvField, AvGroup } from 'availity-reactstrap-validation'
import ThreeDButton from '../../../components/buttons/ThreeDButton'

class ReferenceForm extends React.Component {
  constructor (props) {
    super(props)

    let { dispatch } = this.props

    this.state = {
      selectValue: null,
      collapse: this.props.references.references ? this.props.references.references.length === 0 : true,
      reference: {
        email: ' ',
        phone: ' '
      }
    }

    this.toggleCollapse = this.toggleCollapse.bind(this)
    this._handleSubmit = this._handleSubmit.bind(this)
    this._handleInputChange = this._handleInputChange.bind(this)
  }

  _handleSubmit (e, errors, values) {
    this.setState({ errors, values })

    if (errors.length === 0) {
      let { dispatch } = this.props
      dispatch(createReference(this.state.reference)).then(() => {
        dispatch(getAllReferences()).then(() => {
          this.setState({
            collapse: false
          })
        })
      })
    }
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

  toggleCollapse () {
    this.setState({ collapse: !this.state.collapse })
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.collapse !== prevState.collapse) {
      this.props.layout()
    }
  }

  validatePhoneOrEmail (value, ctx, input, cb) {
    console.log(ctx)
    console.log(input)
    console.log(cb)
  }

  render () {
    let { translate } = this.props
    let { references } = this.props.references
    let chevronClass = classNames('fa add-btn', this.state.collapse ? 'fa-chevron-down bg-orange' : 'fa-plus bg-green')
    let newHeight = $('.referenceItem .card').height()
    let itemClass = classNames('fakeItem', this.state.collapse && 'fullOpacity')

    return (
      <Card className={itemClass} style={{ minHeight: newHeight }}>

        <div className='btn-wrapper'>
          <UncontrolledTooltip placement='left' target='add-btn'>
            Lägg till ny referent
          </UncontrolledTooltip>
          <i className={chevronClass} id='add-btn' onClick={() => this.toggleCollapse()} />
        </div>

        <CardBlock>
          {!this.state.collapse ? <div className='fakeTitle' /> : <CardTitle>{translate('references.new_reference')}</CardTitle>}
          {!this.state.collapse && <div className='fakeSubtitle mb-3 w-50' />}
          {!this.state.collapse && <div className='fakeSubtitle' />}
          {!this.state.collapse && <div className='fakeSubtitle mb-0' />}

          <Collapse isOpen={this.state.collapse}>
            {this.state.collapse &&
            <AvForm onSubmit={this._handleSubmit}>
              <AvGroup>
                <Label for='name'>Namn *</Label>
                <AvField type='text' name='name' id='name'
                  onChange={this._handleInputChange} required />
              </AvGroup>
              <AvGroup>
                <Label for='employer'>Företag *</Label>
                <AvField type='text' name='employer' id='employer'
                  onChange={this._handleInputChange} required />
              </AvGroup>
              <AvGroup>
                <Label for='relation'>Relation *</Label>
                <AvField type='text' name='relation' id='relation'
                  onChange={this._handleInputChange} required />
              </AvGroup>
              <AvGroup>
                <Label for='email'>Epost *</Label>
                <AvField type='email' name='email' id='email'
                  onChange={this._handleInputChange} required />
              </AvGroup>
              <AvGroup>
                <Label for='phone'>Telefon</Label>
                <AvField type='text' name='phone' id='phone'
                  onChange={this._handleInputChange} validate={{ number: true }} errorMessage='Endast siffror tillåtna' />
              </AvGroup>
              <ThreeDButton small>{translate('references.add_reference')}</ThreeDButton>
            </AvForm>
            }
          </Collapse>
        </CardBlock>

      </Card>
    )
  }
}

export default connect((state) => state)(ReferenceForm)
