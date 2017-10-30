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
      <section id='skills' className='cvSection mb-5'>
        <Row>
          <Col className='titleWrapper'>
            <h2 className='sectionTitle font-italic'>Kompetenser</h2>
          </Col>
        </Row>
        <Row>
          {skills && skills.map((skill) => {
            return <CVSkillItem key={skill.id} skill={skill} />
          })}
        </Row>
      </section>
    )
  }
}

class CVSkillItem extends React.Component {
  render () {
    let { skill } = this.props
    return (
      <Col key={skill.id} xs={6} className='progressItem mb-0'>
        <Row>
        <Col xs={12} className='progressName'><small className='mb-0'>{skill.name}</small></Col>
        <Col xs={12} className='progressProgressWrapper'>
          <Progress
            min={1}
            max={5}
            value={skill.experience === 1 ? 1.25 : skill.experience}
            color='#ff0000' />
        </Col>
        </Row>
      </Col>
    )
  }
}
