import React from 'react'
import { connect } from 'react-redux'
import { getAllStories, getEventTypes } from '../../store/actions/wapstory'
import Masonry from 'react-masonry-component'
import _ from 'lodash'
import SpeechBubble from '../../components/Helpers/SpeechBubble/SpeechBubble'

import {
  Container,
  Row,
  Col
} from 'reactstrap'
import StoryItem from './StoryItem/StoryItem'

class WapStory extends React.Component {
  constructor (props) {
    super(props)

    let { dispatch } = this.props
    dispatch(getAllStories())

    this.updateStory = this.updateStory.bind(this)
    this.removeStory = this.removeStory.bind(this)
    this.layout = this.layout.bind(this)
  }

  updateStory () {

  }

  removeStory () {

  }

  layout () {
    this.masonry.layout()
  }

  render () {
    let { stories } = this.props.wapstory
    let mStories = Object.assign([], stories).reverse()

    return (
      <Container fluid>
        <Row className='flex-lg-row-reverse'>
          <Col>
            <SpeechBubble hideable pos='side'>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer egestas arcu eu ipsum dictum interdum.
                Ut rhoncus enim ante, vitae dictum lacus dignissim id. Curabitur malesuada urna quis dui placerat volutpat.
                Nulla non accumsan ante. Morbi ut mauris congue, aliquet libero eget, tincidunt purus. </p>
              <p>Aliquam volutpat dignissim volutpat. Fusce id nulla justo. Sed cursus mollis magna sed egestas.
                Aenean ac felis ipsum. Praesent sodales pulvinar velit, eu luctus libero posuere nec.</p>
            </SpeechBubble>
          </Col>
          <Col xs='12' sm='12' md='12' xl={9}>
            <div className='timeline'>
              <Masonry
                onClick={this.handleClick}
                className='row'
                ref={function (c) {
                  this.masonry = this.masonry || c.masonry
                }.bind(this)}
              >
                {/* <EmploymentForm layout={this.layout} collapse={mEmployments.length === 0} translate={this.props.translate} /> */}
                {mStories && mStories.map((story) => {
                  return <StoryItem key={story.id} story={story}
                    onChange={this.updateStory} layout={this.layout} onRemove={this.removeStory} translate={this.props.translate} />
                })}
              </Masonry>
            </div>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default connect((state) => state)(WapStory)
