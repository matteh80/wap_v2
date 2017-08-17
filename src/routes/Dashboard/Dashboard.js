import React from 'react'
import { connect } from 'react-redux'
import { hideCard, setHiddenCardsToCookie, getHiddenCardsFromCookie, updateCardsList } from '../../store/actions/dashboard'
import Masonry from 'react-masonry-component'
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc'
import Cookies from 'universal-cookie'

import TestCard from './TestCard/TestCard'

import {
  Container,
  Row,
  Col,
} from 'reactstrap'
import RecruiterCard from './RecruiterCard/RecruiterCard'
import JobsCard from './JobsCard/JobsCard'
import EducationsCard from './EducationsCard/EducationsCard'
import EmploymentsCard from './EmploymentsCard/EmploymentsCard'
import WapfilmCard from './WapfilmCard/WapfilmCard'
import HiddenCardsController from './HiddenCardsController/HiddenCardsController'

const _ = require('lodash')
const cookies = new Cookies()

const SortableList = SortableContainer(({ items, onHide, onAdd }) => {
  return (
    <Masonry
      onClick={this.handleClick}
      className='row sortableList'
      ref={function (c) {
        this.masonry = this.masonry || c.masonry
      }.bind(this)}
    >
      {items.map((item, index) => {
        if (!item.component.props.hidden) {
          return <SortableItem key={`item-${index}`} mIndex={index} index={index} id={item.id} value={item.name} onHide={onHide} component={item.component} />
        }
      }
      )}
    </Masonry>
  )
})

const SortableItem = SortableElement(({ value, index, onHide, id, mIndex, component }) => {
  let mComponent = React.cloneElement(
    component,
    {
      sortIndex: mIndex,
      onHide: () => onHide(value)
    },
  )
  return (
    <Col xs={12} sm={6} lg={4} xl={3}>
      {mComponent}
    </Col>
  )
})

const cards = [
  { name: 'testcard', component: <TestCard name='testcard' /> },
  { name: 'recruitercard', component: <RecruiterCard name='recruitercard' /> },
  { name: 'educationscard', component: <EducationsCard name='educationscard' /> },
  { name: 'employmentscard', component: <EmploymentsCard name='employmentscard' /> },
  { name: 'wapfilmcard', component: <WapfilmCard name='wapfilmcard' /> },
]

class Dashboard extends React.Component {
  constructor (props) {
    super(props)

    // cookies.remove(props.profile.id + '_hiddenCards', { path: '/' })
    // cookies.remove(props.profile.id + '_cards', { path: '/' })

    let itemsFromCookie = cookies.get(props.profile.id + '_cards', { path: '/' })
    let hiddenItemsFromCookie = cookies.get(props.profile.id + '_hiddenCards', { path: '/' })

    this.state = {
      hiddenItems: hiddenItemsFromCookie || [],
      items: itemsFromCookie || this.createNamesFromComponents(cards),
    }

    this._handleClick = this._handleClick.bind(this)
    this.onSortEnd = this.onSortEnd.bind(this)
    this.onHide = this.onHide.bind(this)
    this.onAdd = this.onAdd.bind(this)
    this.createListFromNames = this.createListFromNames.bind(this)
    this.createNamesFromComponents = this.createNamesFromComponents.bind(this)
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.hiddenItems !== this.state.hiddenItems) {
      console.log('save hidden items to cookie')
      cookies.set(this.props.profile.id + '_hiddenCards', this.state.hiddenItems, { path: '/' })
    }

    if (prevState.items !== this.state.items) {
      console.log('save items to cookie')
      cookies.set(this.props.profile.id + '_cards', this.createNamesFromComponents(this.state.items), { path: '/' })
    }
  }

  createNamesFromComponents (list) {
    let mNameArray = []
    list.map((item) => {
      mNameArray.push(item.name)
    })
    return mNameArray
  }

  createListFromNames (list) {
    let hiddenItems = this.state ? this.state.hiddenItems : cookies.get(this.props.profile.id + '_hiddenCards', { path: '/' })
    let mCards = []
    list.map((name) => {
      let c = _.find(cards, { 'name': name })
      let hidden = _.includes(hiddenItems, name)
      c.component = React.cloneElement(
        c.component,
        {
          hidden: hidden
        },
      )
      mCards.push(c)
    })

    // return mCards.length > 0 ? mCards : cards
    return mCards
  }

  _handleClick (e) {
    console.log(e)
  }

  onHide = (name) => {
    if (_.includes(this.state.hiddenItems, name)) {
      return
    }

    let mHiddenCards = _.concat(this.state.hiddenItems, name)

    this.setState({
      hiddenItems: mHiddenCards
    })
  }

  onAdd (itemName) {
    console.log(itemName)
    let test = Object.assign([], this.state.hiddenItems)
    _.remove(test, function (n) {
      return n === itemName
    })

    this.setState({
      hiddenItems: test
    })
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex),
    })
  }

  render () {
    let style = {
      display: 'flex'
    }

    let allSavedJobs = this.props.jobs.savedJobs

    return (
      <Container fluid>
        <HiddenCardsController hiddenCards={this.createListFromNames(this.state.hiddenItems)} onAdd={this.onAdd} />
        <SortableList
          helperClass='moving'
          axis='xy'
          pressDelay={200}
          items={this.createListFromNames(this.state.items)}
          onSortEnd={this.onSortEnd}
          onHide={this.onHide}
        />
      </Container>
    )
  }
}

export default connect((state) => state)(Dashboard)

const masonryOptions = {
  transitionDuration: 500
}
