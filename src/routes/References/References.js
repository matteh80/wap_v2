import React from 'react'
import { connect } from 'react-redux'
import ReferenceForm from './ReferenceForm/ReferenceForm'
import ReferenceItem from './ReferenceItem/ReferenceItem'
import { getAllReferences, removeReference, updateReference } from '../../store/actions/references'
import update from 'react-addons-update'
import ThreeDButton from '../../components/buttons/ThreeDButton'
import Masonry from 'react-masonry-component'
import SpeechBubble from '../../components/Helpers/SpeechBubble/SpeechBubble'

import {
  Container,
  Row,
  Col,
} from 'reactstrap'

class References extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      references: this.props.references.references ? this.props.references.references : [],
      changes: false
    }

    let { dispatch } = this.props
    Promise.all([
      dispatch(getAllReferences()),
    ]).then(() => {
      console.log('got it all')
    }).catch((error) => {
      console.log(error)
    })

    this.onReferenceChange = this.onReferenceChange.bind(this)
    this.onAdd = this.onAdd.bind(this)
    this.onRemove = this.onRemove.bind(this)
    this.layout = this.layout.bind(this)
  }

  componentDidMount () {
    let { dispatch } = this.props
  }

  componentWillUpdate (nextProps, nextState) {
    if (this.state.references !== nextState.references) {
      this.setState({ changes: true })
    }
  }

  onReferenceChange (reference) {

    let { dispatch } = this.props
    dispatch(updateReference(reference))
      .then(() => {
        dispatch(getAllReferences())
      })
  }

  onAdd (item) {
    let mReference = Object.assign({}, item, { experience: 3 })
    this.setState({
      references: update(this.state.references, { $push: [mReference] })
    })
  }

  onRemove (reference) {
    let { dispatch } = this.props
    dispatch(removeReference(reference))
    // let index = this.state.references.findIndex(references => references.id === id)
    // if (index === -1) return false
    // const items = Object.assign([], this.state.references)
    // items.splice(index, 1)
    //
    // this.setState({ references : items })
  }

  layout () {
    this.masonry.layout()
  }

  render () {
    let { translate } = this.props
    let { references } = this.props.references
    let notEmpty = references && references.length > 0

    return (
      <Container fluid>
        <SpeechBubble hideable>
          {translate('references.help_text')}
        </SpeechBubble>
        <Masonry
          onClick={this.handleClick}
          className='row'
          ref={function (c) {
            this.masonry = this.masonry || c.masonry
          }.bind(this)}
        >
          {this.props.references.references && this.props.references.references.map((reference) => {
            return <ReferenceItem key={reference.id} reference={reference} onChange={this.onReferenceChange} onRemove={this.onRemove} layout={this.layout} />
          })}
          <Col xs={12} sm={6} md={4} xl={3}>
            <ReferenceForm onAdd={this.onAdd} references={this.state.references} onOpen={this.onOpen} layout={this.layout} translate={translate} />
          </Col>
        </Masonry>
      </Container>
    )
  }
}

const masonryOptions = {
  transitionDuration: 500
}

export default connect((state) => state)(References)
