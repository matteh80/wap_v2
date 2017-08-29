import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'
import classNames from 'classnames'
import { createShare, getAllShares } from '../../../store/actions/shareprofile'

import {
  Card,
  CardBlock,
  CardTitle,
  UncontrolledTooltip,
  Label,
  Collapse
} from 'reactstrap'

import {
  AvForm,
  AvGroup,
  AvField
} from 'availity-reactstrap-validation'
import ThreeDButton from '../../../components/buttons/ThreeDButton'

class ShareForm extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      collapse: this.props.shares.shares && this.props.shares.shares.length === 0,
    }

    this.toggleCollapse = this.toggleCollapse.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  toggleCollapse () {
    this.setState({ collapse: !this.state.collapse })
  }

  handleSubmit (e, errors, values) {
    console.log(values)
    this.setState({ errors, values })

    if (errors.length === 0) {
      let { dispatch } = this.props
      dispatch(createShare(values.name, values.ttl)).then(() => {
        dispatch(getAllShares())
        this.setState({ collapse: false })
      })
    }
  }

  render () {
    let chevronClass = classNames('fa add-btn', this.state.collapse ? 'fa-chevron-down bg-orange' : this.state.disabled ? 'fa-exclamation-triangle bg-red' : 'fa-plus bg-green')
    let newHeight = $('.shareItem .card').height()
    let itemClass = classNames('fakeItem', this.state.disabled && 'disabled')

    return (
      <Card className={itemClass} style={{ minHeight: newHeight }}>
        <div className='btn-wrapper'>
          <UncontrolledTooltip placement='left' target='add-btn'>
            Ny delning
          </UncontrolledTooltip>
          <i className={chevronClass} id='add-btn' onClick={!this.state.disabled && this.toggleCollapse} />
        </div>
        <CardBlock>
          {!this.state.collapse ? <div className='fakeTitle' /> : <CardTitle>Ny Delning</CardTitle>}
          {!this.state.collapse && <div className='fakeSubtitle' />}
          {!this.state.collapse && <div className='fakeSubtitle w-100 mt-0 mb-0' />}
          <Collapse isOpen={this.state.collapse}>
            <AvForm onSubmit={this.handleSubmit}>
              <AvGroup>
                <Label for='employer'>Titel *</Label>
                <AvField type='text' name='name' required />
              </AvGroup>
              <AvGroup>
                <AvField type='select' name='ttl' label='Giltig' required>
                  <option>Välj giltighetstid</option>
                  <option value={0}>Endast en visning</option>
                  <option value={86400 * 1}>1 dag</option>
                  <option value={86400 * 2}>2 dagar</option>
                  <option value={86400 * 3}>3 dagar</option>
                  <option value={86400 * 4}>4 dagar</option>
                  <option value={86400 * 5}>5 dagar</option>
                  <option value={86400 * 6}>6 dagar</option>
                  <option value={86400 * 7}>7 dagar</option>
                </AvField>
              </AvGroup>
              <ThreeDButton type='submit'>Skapa delning</ThreeDButton>
            </AvForm>
          </Collapse>
        </CardBlock>

      </Card>
    )
  }
}

export default connect((state) => state)(ShareForm)
