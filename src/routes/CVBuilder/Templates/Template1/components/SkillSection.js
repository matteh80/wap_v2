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
      <section id='skills' className='cvSection row'>
        <Col xs={12}>
          <h5 className='sectionTitle'>Kompetenser</h5>
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
        <h6 className='progressName'>{skill.name}</h6>
        <Col xs={12} className='progressProgressWrapper pl-0'>
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
