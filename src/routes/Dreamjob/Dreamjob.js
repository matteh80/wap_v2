import React from 'react'
import { connect } from 'react-redux'
import Masonry from 'react-masonry-component'
import './Dreamjob.scss'
import { getAllQuestions, saveQuestions } from '../../store/actions/dreamjob'
import update from 'react-addons-update'
import SpeechBubble from '../../components/Helpers/SpeechBubble/SpeechBubble'

import {
  Container,
  Row,
  Col,
  Card,
  CardImg,
  CardImgOverlay,
  CardText,
  CardTitle,
  CardBlock,
  Input,
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
        <Row>
          <Col>
            <SpeechBubble>
              <h3>Vi vill veta mer om dig och dina drömmar!</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rutrum risus eget turpis fermentum hendrerit.
                Nulla rutrum ultricies rutrum. Praesent blandit sapien at tellus scelerisque lobortis.
                Vivamus fermentum egestas nunc sed tincidunt. Maecenas scelerisque ac nunc in suscipit. </p>
            </SpeechBubble>
          </Col>
        </Row>
        <Masonry
          onClick={this.handleClick}
          className='row align-items-center dreamjobWrapper'
          ref={function (c) {
            this.masonry = this.masonry || c.masonry
          }.bind(this)}
        >
          <Col xs={12} md={4} className='bubble'>
            <Card>
              <CardImg src='/img/rocket.jpg' className='img-fluid' />
              <CardImgOverlay className='bg-white'>
                <CardText>Här skriver du in vad som är ditt drömjobb, det spelar ingen roll om det kanske är lite orealistiskt. Vi vill veta vad dina drömmar är.</CardText>
              </CardImgOverlay>
              <CardBlock>
                <CardTitle>Mitt drömjobb är {' '}{this.renderItemOrEditField(dreamjob[0])}</CardTitle>

              </CardBlock>
            </Card>
          </Col>

          <Col xs={12} md={4} className='bubble'>
            <Card>
              <CardImg src='/img/clipboard.jpg' className='img-fluid' />
              <CardImgOverlay className='bg-white'>
                <CardText>Vilken är din drömarbetsgivare om du fick välje helt fritt.</CardText>
              </CardImgOverlay>
              <CardBlock>
                <CardTitle>Min drömarbetsgivare är {' '}{this.renderItemOrEditField(dreamjob[1])}</CardTitle>
              </CardBlock>
            </Card>
          </Col>

          <Col xs={12} md={4} className='bubble'>
            <Card>
              <CardImg src='/img/doubting.jpg' className='img-fluid' />
              <CardImgOverlay className='bg-white'>
                <CardText>Inom vilken bransch vill du helst av allt jobba inom?</CardText>
              </CardImgOverlay>
              <CardBlock>
                <CardTitle>Min drömbransch är {' '}{this.renderItemOrEditField(dreamjob[2])}</CardTitle>
              </CardBlock>
            </Card>
          </Col>
        </Masonry>
      </Container>
    )
  }
}

export default connect((state) => state)(Dreamjob)
