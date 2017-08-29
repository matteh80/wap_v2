import React from 'react'
import Slider, { Handle } from 'rc-slider'
import './LanguageItem.scss'
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

const createSliderWithTooltip = Slider.createSliderWithTooltip
const SliderTooltip = createSliderWithTooltip(Slider)

const spokenHandle = (props) => {
  const { value, dragging, index, ...restProps } = props
  return (
    <Handle value={value} {...restProps} style={{ width: 32, height: 32, marginTop: -14, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {!dragging && <i className='fa fa-comments' />}
      {dragging && <span>{value}</span>}
    </Handle>
  )
}

const writtenHandle = (props) => {
  const { value, dragging, index, ...restProps } = props
  return (
    <Handle value={value} {...restProps} style={{ width: 32, height: 32, marginTop: -14, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {!dragging && <i className='fa fa-pencil' />}
      {dragging && <span>{value}</span>}
    </Handle>
  )
}

class LanguageItem extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      editMode: this.props.language.new,
      language: Object.assign({}, this.props.language)
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
      language: update(this.state.language, { [type]: { $set: value } })
    })
  }

  toggleEditMode () {
    this.state.editMode && this.props.onChange(this.state.language)
    this.setState({
      editMode: !this.state.editMode
    })
  }

  revertChanges () {
    this.setState({
      editMode: !this.state.editMode,
      language: this.props.language
    })
  }

  render () {
    let { language } = this.props
    let wrapperClass = classNames('btn-wrapper hasRemove', this.state.editMode && 'editing')
    let editBtnClass = classNames('edit-btn fa', this.state.editMode ? 'fa-check editing' : 'fa-pencil')

    return (
      <Col xs={12} sm={6} md={4} xl={3} className='languageItem'>
        <Card>
          <div className={wrapperClass}>
            <i className={editBtnClass} onClick={() => this.toggleEditMode()} />
            <i className='fa fa-mail-reply cancel-btn' onClick={() => this.revertChanges()} />
            <i className='fa fa-times remove-btn' onClick={() => this.props.onRemove(language.id)} />
          </div>
          <CardBlock>
            <CardTitle>{language.name}</CardTitle>
            {this.state.editMode &&
            <div>
              <Slider
                min={1}
                max={5}
                dots
                handle={spokenHandle}
                value={this.state.language.spoken}
                onChange={(value) => this.onChange(value, 'spoken')}
              />

              <Slider
                min={1}
                max={5}
                dots
                handle={writtenHandle}
                value={this.state.language.written}
                onChange={(value) => this.onChange(value, 'written')}
              />
            </div>
            }
            {!this.state.editMode &&
              <div className='languageInfo'>
                <div className='mb-2'>
                  <i className='fa fa-comment float-left mr-1' />
                  <Progress
                    min={1}
                    max={5}
                    value={language.spoken === 1 ? 1.25 : language.spoken}
                    color='pink' />
                </div>
                <div>
                  <i className='fa fa-pencil float-left mr-1' />
                  <Progress
                    min={1}
                    max={5}
                    value={language.written === 1 ? 1.25 : language.written}
                    color='pink' />
                </div>
              </div>
            }
          </CardBlock>
        </Card>
      </Col>
    )
  }
}

export default LanguageItem
