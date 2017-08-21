import React from 'react'
import { connect } from 'react-redux'
import SkillForm from './SkillForm/SkillForm'
import SkillItem from './SkillItem/SkillItem'
import { getAllSkills, getMySkills, saveSkillsToServer } from '../../store/actions/skills'
import update from 'react-addons-update'
import Masonry from 'react-masonry-component'
import SpeechBubble from '../../components/Helpers/SpeechBubble/SpeechBubble'

import {
  Container,
  Row,
  Col,
} from 'reactstrap'

class Skills extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      userSkills: this.props.skills.userSkills ? this.props.skills.userSkills : [],
      changes: false
    }

    let { dispatch } = this.props
    Promise.all([
      dispatch(getAllSkills()),
      dispatch(getMySkills()),
    ]).then(() => {
      console.log('got it all')
    }).catch((error) => {
      console.log(error)
    })

    this.onSkillChange = this.onSkillChange.bind(this)
    this.onAdd = this.onAdd.bind(this)
    this.onRemove = this.onRemove.bind(this)
    this._saveToServer = this._saveToServer.bind(this)
    this.layout = this.layout.bind(this)
  }

  componentDidMount () {
    let { dispatch } = this.props
  }

  componentWillUpdate (nextProps, nextState) {
    if (this.state.userSkills !== nextState.userSkills) {
      this.setState({ changes: true })
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.userSkills !== prevState.userSkills) {
      this._saveToServer()
    }
  }

  onSkillChange (skill) {
    let index = this.state.userSkills.findIndex(skills => skills.id === skill.id)
    if (index === -1) return false

    this.setState({
      userSkills: update(this.state.userSkills, { [index]: { $set: skill } })
    })
  }

  onAdd (item) {
    let mSkill = Object.assign({}, item, { experience: 3 })
    this.setState({
      userSkills: update(this.state.userSkills, { $push: [mSkill] })
    })
  }

  onRemove (id) {
    let index = this.state.userSkills.findIndex(skills => skills.id === id)
    if (index === -1) return false
    const items = Object.assign([], this.state.userSkills)
    items.splice(index, 1)

    this.setState({ userSkills : items })
  }

  _saveToServer () {
    let { dispatch } = this.props
    dispatch(saveSkillsToServer(this.state.userSkills)).then(() => {
      this.setState({ changes: false })
    })
  }

  layout () {
    this.masonry.layout()
  }

  render () {
    let { userSkills } = this.props.skills
    let notEmpty = userSkills && userSkills.length > 0

    return (
      <Container fluid>
        <Col>
          <SpeechBubble hideable>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer egestas arcu eu ipsum dictum interdum.
              Ut rhoncus enim ante, vitae dictum lacus dignissim id. Curabitur malesuada urna quis dui placerat volutpat.
              Nulla non accumsan ante. Morbi ut mauris congue, aliquet libero eget, tincidunt purus. </p>
            <p>Aliquam volutpat dignissim volutpat. Fusce id nulla justo. Sed cursus mollis magna sed egestas.
              Aenean ac felis ipsum. Praesent sodales pulvinar velit, eu luctus libero posuere nec.</p>
          </SpeechBubble>
        </Col>
        <Masonry
          onClick={this.handleClick}
          className='row'
          ref={function (c) {
            this.masonry = this.masonry || c.masonry
          }.bind(this)}
        >
          {this.state.userSkills && this.state.userSkills.map((skill) => {
            return <SkillItem key={skill.id} skill={skill} onChange={this.onSkillChange} onRemove={this.onRemove} layout={this.layout} />
          })}
          <Col xs={12} sm={6} md={4} xl={3}>
            <SkillForm notEmpty={notEmpty} onAdd={this.onAdd} userSkills={this.state.userSkills} onOpen={this.onOpen} layout={this.layout} />
          </Col>
        </Masonry>
      </Container>
    )
  }
}

const masonryOptions = {
  transitionDuration: 500
}

export default connect((state) => state)(Skills)
