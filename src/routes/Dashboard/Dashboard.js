import React from 'react'
import { connect } from 'react-redux'
import Masonry from 'react-masonry-component'
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc'
import Cookies from 'universal-cookie'

import TestCard from './TestCard/TestCard'

import {
  Container,
  Col,
} from 'reactstrap'
import RecruiterCard from './RecruiterCard/RecruiterCard'
import JobsCard from './JobsCard/JobsCard'
import EducationsCard from './EducationsCard/EducationsCard'
import EmploymentsCard from './EmploymentsCard/EmploymentsCard'
import WapfilmCard from './WapfilmCard/WapfilmCard'
import SkillsCard from './SkillsCard/SkillsCard'
import HiddenCardsController from './HiddenCardsController/HiddenCardsController'

const _ = require('lodash')
const cookies = new Cookies()

const DragHandle = SortableHandle(() => <div className='dragHandleWrapper'><i className='fa fa-arrows dragHandle' /></div>)

const SortableList = SortableContainer(({ items, onHide, onAdd }) => {
  return (
    <Masonry
      onClick={this.handleClick}
      className='row sortableList dashboardCards'
      ref={function (c) {
        this.masonry = this.masonry || c.masonry
      }.bind(this)}
    >
      {items.map((item, index) => {
        return <SortableItem key={`item-${index}`} mIndex={index} index={index} id={item.id} value={item.name} onHide={onHide} component={item.component} />
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
    <Col xs={12} sm={6} lg={4} xl={3} className='dashboardCard'>
      <DragHandle />
      {mComponent}
    </Col>
  )
})

let cards
class Dashboard extends React.Component {
  constructor (props) {
    super(props)

    console.log('constructor')
    // cookies.remove(props.profile.id + '_cards', { path: '/' })
    // cookies.remove(props.profile.id + '_hiddenCards', { path: '/' })
    // cookies.remove(props.profile.id + '_visibleCards', { path: '/' })

    cards = [
      { name: 'jobscard', component: <JobsCard jobs={props.jobs.savedJobs} /> },
      { name: 'testcard', component: <TestCard /> },
      { name: 'recruitercard', component: <RecruiterCard /> },
      { name: 'educationscard', component: <EducationsCard /> },
      { name: 'employmentscard', component: <EmploymentsCard /> },
      { name: 'wapfilmcard', component: <WapfilmCard /> },
      { name: 'skillscard', component: <SkillsCard skills={props.skills.userSkills} /> },
    ]

    let itemsFromCookie = cookies.get(props.profile.id + '_visibleCards', { path: '/' })
    let hiddenItemsFromCookie = cookies.get(props.profile.id + '_hiddenCards', { path: '/' })

    let mItems = itemsFromCookie || this.createNamesFromComponents(cards)
    let mHiddenItems = hiddenItemsFromCookie || []

    let newCards = this.checkForNewCards(props)
    if (newCards) {
      mItems = _.concat(mItems, newCards)
      console.log('added new cards')
      console.log(mItems)
      cookies.set(this.props.profile.id + '_cards', this.createNamesFromComponents(cards), { path: '/' })
      cookies.set(this.props.profile.id + '_visibleCards', this.createNamesFromComponents(cards), { path: '/' })
    }

    this.state = {
      hiddenItems: mHiddenItems,
      items: cards,
      visibleItems: this.createListFromNames(this.shouldCardBeVisible(mItems))
    }

    this._handleClick = this._handleClick.bind(this)
    this.onSortEnd = this.onSortEnd.bind(this)
    this.onHide = this.onHide.bind(this)
    this.onAdd = this.onAdd.bind(this)
    this.createListFromNames = this.createListFromNames.bind(this)
    this.createNamesFromComponents = this.createNamesFromComponents.bind(this)
    this.shouldCardBeVisible = this.shouldCardBeVisible.bind(this)
    this.checkForNewCards = this.checkForNewCards.bind(this)
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.hiddenItems !== this.state.hiddenItems) {
      console.log('save hidden items to cookie')
      cookies.set(this.props.profile.id + '_hiddenCards', this.state.hiddenItems, { path: '/' })
    }

    if (prevState.visibleItems !== this.state.visibleItems) {
      console.log('save items to cookie')
      cookies.set(this.props.profile.id + '_visibleCards', this.createNamesFromComponents(this.state.visibleItems), { path: '/' })
    }
  }

  checkForNewCards (props) {
    let savedCards = cookies.get(props.profile.id + '_cards', { path: '/' })
    if (!savedCards) {
      cookies.set(this.props.profile.id + '_cards', this.createNamesFromComponents(cards), { path: '/' })
      return null
    }
    if (savedCards.length === cards.length) {
      return null
    }

    return _.difference(this.createNamesFromComponents(cards), savedCards)
  }

  shouldCardBeVisible (list) {
    let cardsArray = []

    for (let i = 0; i < list.length; i++) {
      switch (list[i]) {
        case 'jobscard':
          this.props.jobs.savedJobs && this.props.jobs.savedJobs.length > 0 && cardsArray.push(list[i])
          console.log('jobscard')
          break
        case 'wapfilmcard':
          !this.props.wapfilm.video && cardsArray.push(list[i])
          break
        case 'testcard':
          !this.props.talentq.completed && cardsArray.push(list[i])
          break
        case 'skillscard':
          let hasZero = _.find(this.props.skills.userSkills, { 'experience': 0 })
          let shouldBeAdded = false
          if (this.props.skills.userSkills && this.props.skills.userSkills.length === 0) { shouldBeAdded = true }
          if (!shouldBeAdded && hasZero) { shouldBeAdded = true }
          shouldBeAdded && cardsArray.push(list[i])
          break
        default:
          cardsArray.push(list[i])
      }
    }

    return cardsArray
  }

  createNamesFromComponents (list) {
    let mNameArray = []
    list.map((item) => {
      mNameArray.push(item.name)
    })
    // console.log(mNameArray)
    return mNameArray
  }

  createListFromNames (list) {
    let hiddenItems = this.state ? this.state.hiddenItems : cookies.get(this.props.profile.id + '_hiddenCards', { path: '/' })
    let mCards = []
    list.map((name) => {
      let c = _.find(cards, { 'name': name })
      let hidden = _.includes(hiddenItems, name)
      if (c) {
        // c.component = React.cloneElement(
        //   c.component,
        //   {
        //     hidden: hidden
        //   },
        // )
        mCards.push(c)
      }
    })

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
    let mTemp = this.createNamesFromComponents(this.state.visibleItems)
    let mVisible = _.difference(mTemp, mHiddenCards)

    this.setState({
      hiddenItems: mHiddenCards,
      visibleItems: this.createListFromNames(mVisible)
    })
  }

  onAdd (itemName) {
    console.log(itemName)
    let test = Object.assign([], this.state.hiddenItems)
    _.remove(test, function (n) {
      return n === itemName
    })

    let mTemp = this.createNamesFromComponents(this.state.visibleItems)
    mTemp.push(itemName)
    console.log(mTemp)

    this.setState({
      hiddenItems: test,
      visibleItems: this.createListFromNames(mTemp)
    })
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      visibleItems: arrayMove(this.state.visibleItems, oldIndex, newIndex),
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
        {this.state.visibleItems && this.state.visibleItems.length > 0 &&
        <SortableList
          helperClass='moving'
          useDragHandle
          axis='xy'
          items={this.state.visibleItems}
          onSortEnd={this.onSortEnd}
          onHide={this.onHide}
        />
        }
      </Container>
    )
  }
}

export default connect((state) => state)(Dashboard)

const masonryOptions = {
  transitionDuration: 500
}
