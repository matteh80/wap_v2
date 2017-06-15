import React from 'react'
import Slider, { Handle } from 'rc-slider'
import './LanguageItem.scss'
import update from 'react-addons-update'

import {
  Row,
  Col,
  Card,
  CardBlock,
  CardTitle
} from 'reactstrap'

const createSliderWithTooltip = Slider.createSliderWithTooltip
const SliderTooltip = createSliderWithTooltip(Slider)

const spokenHandle = (props) => {
  const { value, dragging, index, ...restProps } = props
  return (
    <Handle value={value} {...restProps} style={{ width: 22, height: 22, marginTop: -10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {!dragging && <i className='fa fa-comments' />}
      {dragging && <span>{value}</span>}
    </Handle>
  )
}

const writtenHandle = (props) => {
  const { value, dragging, index, ...restProps } = props
  return (
    <Handle value={value} {...restProps} style={{ width: 22, height: 22, marginTop: -10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {!dragging && <i className='fa fa-pencil' />}
      {dragging && <span>{value}</span>}
    </Handle>
  )
}

class LanguageItem extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      language: this.props.language
    }

    this.onChange = this.onChange.bind(this)
  }

  onChange (value, type) {
    this.setState({
      language: update(this.state.language, { [type]: { $set: value } })
    }, this.props.onChange(this.state.language))
  }

  render () {
    let { language } = this.props
    return (
      <Col xs={12} sm={6} md={4} xl={3}>
        <Card>
          <CardBlock>
            <CardTitle>{language.name}</CardTitle>
            <i className='fa fa-trash trashcan' onClick={() => this.props.onRemove(language.id)} />
            <Slider
              min={1}
              max={5}
              dots
              handle={spokenHandle}
              value={language.spoken}
              onChange={(value) => this.onChange(value, 'spoken')}
            />

            <Slider
              min={1}
              max={5}
              dots
              handle={writtenHandle}
              value={language.written}
              onChange={(value) => this.onChange(value, 'written')}
            />
          </CardBlock>
        </Card>
      </Col>
    )
  }
}

export default LanguageItem
