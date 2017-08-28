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
      <section id='skills' className='row'>
        <Col xs={12}>
          <Col xs={4} style={{ textAlign: 'right' }}>
            <h3 className='sectionTitle'>Kompetenser</h3>
          </Col>
        </Col>

        {skills && skills.map((skill) => {
          return <CVSkillItem key={skill.id} skill={skill} />
        })}
      </section>
    )
  }
}

class CVSkillItem extends React.Component {
  render () {
    let { skill } = this.props
    return (
      <Col key={skill.id} xs={6} className='progressItem'>
        <Col xs={12} className='progressName'><h6>{skill.name}</h6></Col>
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
