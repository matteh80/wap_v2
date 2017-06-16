import React from 'react'
import Slider from 'rc-slider'
import './SkillItem.scss'

import {
  Col,
  Card,
  CardBlock,
  CardTitle
} from 'reactstrap'

const createSliderWithTooltip = Slider.createSliderWithTooltip
const SliderTooltip = createSliderWithTooltip(Slider)

class SkillItem extends React.Component {
  render () {
    let { skill } = this.props
    return (
      <Col xs={12} sm={6} md={4} xl={3}>
        <Card className='withTrashcan'>
          <CardBlock>
            <CardTitle>{skill.name}</CardTitle>
            <i className='fa fa-trash trashcan' onClick={() => this.props.onRemove(skill.id)} />
            <SliderTooltip
              min={1}
              max={5}
              dots
              value={skill.experience}
              onChange={(value) => this.props.onChange(value, skill.id)}
            />
          </CardBlock>
        </Card>
      </Col>
    )
  }
}

export default SkillItem
