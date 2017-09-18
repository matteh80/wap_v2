import React from 'react'

import {
  Row,
  Col,
  Progress,
} from 'reactstrap'

export default class SkillSection extends React.Component {
  constructor (props) {
    super(props)
  }

  componentWillReceiveProps (newProps) {
    // console.log('new props skill')
    // console.log(newProps)
  }

  render () {
    let { skills } = this.props
    return (
      <div id='skills' className='row'>
        <Col xs={12} className='d-flex'>
          <Col className='titleWrapper'>
            <h4 className='sectionTitle'>Kompetenser</h4>
          </Col>
          <Col className='line' />
        </Col>

        {skills && skills.map((skill) => {
          return <CVSkillItem key={skill.id} skill={skill} />
        })}
      </div>
    )
  }
}

class CVSkillItem extends React.Component {
  render () {
    let { skill } = this.props
    return (
      <Col key={skill.id} xs={12} className='progressItem mb-0'>
        <Col xs={12} className='progressName'><small className='mb-0'>{skill.name}</small></Col>
        <Col xs={12} className='progressProgressWrapper'>
          <Progress
            min={1}
            max={5}
            value={skill.experience === 1 ? 1.25 : skill.experience}
            color='#ff0000' />
        </Col>
      </Col>
    )
  }
}
