import React from 'react'
import { connect } from 'react-redux'
import Masonry from 'react-masonry-component'
import ProfilePicture from '../../components/Misc/ProfilePicture/ProfilePicture'
import './Dreamjob.scss'
import { getAllQuestions, saveQuestions } from '../../store/actions/dreamjob'
import update from 'react-addons-update'

import {
  Container,
  Col,
  Card,
  CardBlock,
  Input,
  Row
} from 'reactstrap'
import ThreeDButton from '../../components/buttons/ThreeDButton'
import Loader from '../../components/Misc/Loader/Loader'

class Dreamjob extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      loadsave: false,
      editing: 0,
      questions: Object.assign([], this.props.dreamjob)
    }

    let { dispatch } = this.props
    dispatch(getAllQuestions())

    this.renderItemOrEditField = this.renderItemOrEditField.bind(this)
    this._handleEdit = this._handleEdit.bind(this)
    this.updateAnswer = this.updateAnswer.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  componentWillReceiveProps (newProps) {
    console.log(newProps)
    if (this.state.questions !== newProps.dreamjob) {
      this.setState({
        questions: Object.assign([], newProps.dreamjob),
        editing: 0,
        loadsave: false
      })
    }
  }

  renderItemOrEditField (item) {
    if (this.state.editing === item.id) {
      return (
        <div>
          <Loader active={this.state.loadsave} />
          <Input type='text' defaultValue={item.answer} className='inlineEdit' onChange={(e) => this.handleInputChange(e, item)} />
          <ThreeDButton small className='mb-0' onClick={() => this.updateAnswer(item)}><i className='fa fa-check' /> </ThreeDButton>
        </div>
      )
    } else {
      return <span className='editable' onClick={() => this._handleEdit(item)}>{item.answer}</span>
    }
  }

  handleInputChange (e, item) {
    let target = e.target

    let index = this.state.questions.findIndex(questions => questions.id === item.id)
    if (index === -1) return false
    // alert(index)
    this.setState({
      questions: update(this.state.questions, { [index]: { answer: { $set: target.value } } })
    })
  }

  updateAnswer (item) {
    let { dispatch } = this.props
    this.setState({
      loadsave: true
    })
    dispatch(saveQuestions(this.state.questions))
  }

  _handleEdit (item) {
    this.setState({ editing: item.id })
  }

  render () {
    let { dreamjob } = this.props
    return (
      <Container fluid>
        <Masonry
          onClick={this.handleClick}
          className='row align-items-center dreamjobWrapper'
          ref={function (c) {
            this.masonry = this.masonry || c.masonry
          }.bind(this)}
        >
          <Col xs={12} md={4} className='bubble'>
            <Card className='speechBubble left'>
              <CardBlock>
                <h3>Mitt drömjobb är {' '}
                  {this.renderItemOrEditField(dreamjob[0])}
                </h3>
              </CardBlock>
            </Card>
          </Col>

          <Col xs={12} md={4} className='bubble hidden-sm-down'>
            <Row className='justify-content-center'>
              <Col md={6}>
                <ProfilePicture className='rounded-circle' />
              </Col>
            </Row>
          </Col>

          <Col xs={12} md={4} className='bubble'>
            <Card className='speechBubble right'>
              <CardBlock>
                <h3>Min drömarbetsgivare är {' '}
                  {this.renderItemOrEditField(dreamjob[1])}
                </h3>
              </CardBlock>
            </Card>
          </Col>

          <Col xs={12} className='bubble'>
            <Row className='justify-content-center'>
              <Col xs={12} md={4}>
                <Card className='speechBubble top'>
                  <CardBlock>
                    <h3>Min drömbranch är {' '}
                      {this.renderItemOrEditField(dreamjob[2])}
                    </h3>
                  </CardBlock>
                </Card>
              </Col>
            </Row>
          </Col>
        </Masonry>
      </Container>
    )
  }
}

export default connect((state) => state)(Dreamjob)
