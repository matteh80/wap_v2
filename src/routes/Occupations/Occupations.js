import React from 'react'
import { connect } from 'react-redux'
import { getAllOccupations, getMyOccupations, orderOccupations, removeOccupation, saveOccupationsToServer } from '../../store/actions/occupations'
import OccupationForm from './OccupationForm/OccupationForm'
import { SortableContainer, SortableElement, arrayMove, SortableHandle } from 'react-sortable-hoc'
import './Occupations.scss'
import $ from 'jquery'

import {
  Container,
  Row,
  Col,
  Card,
  CardBlock
} from 'reactstrap'
import ThreeDButton from '../../components/buttons/ThreeDButton'

const DragHandle = SortableHandle(() => <i className='fa fa-bars dragHandle' />)

const SortableList = SortableContainer(({ items, onRemove }) => {
  return (
    <Row className='sortableList'>
      {items.map((item, index) => {
        return <SortableItem key={`item-${index}`} mIndex={index} index={index} id={item.id} value={index + 1 + '. ' + item.name} onRemove={onRemove} />
      }
      )}
    </Row>
  )
})

const SortableItem = SortableElement(({ value, index, onRemove, id, mIndex }) => {
  return (
    <Col xs={12} sm={6} md={4} lg={6} xl={4}>
      <Card>
        <CardBlock>
          <DragHandle />
          {value}
          <i className='fa fa-trash trashcan' onClick={() => onRemove(id)} />
        </CardBlock>
      </Card>
    </Col>
  )
})

class Occupations extends React.Component {
  constructor (props) {
    super(props)

    let { dispatch } = this.props
    Promise.all([
      dispatch(getAllOccupations()),
      dispatch(getMyOccupations()),
    ]).then(() => {
      console.log('got it all')
    }).catch((error) => {
      console.log(error)
    })

    this.onSortEnd = this.onSortEnd.bind(this)
    this.onRemove = this.onRemove.bind(this)
    this._saveToServer = this._saveToServer.bind(this)
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    let { dispatch } = this.props
    let { userOccupations } = this.props.occupations

    let newArray = arrayMove(userOccupations, oldIndex, newIndex)

    dispatch(orderOccupations(newArray))
  }

  onRemove = (id) => {
    let { dispatch } = this.props
    dispatch(removeOccupation(id))
  }

  _saveToServer () {
    let { dispatch } = this.props
    dispatch(saveOccupationsToServer(this.props.occupations.userOccupations))
  }

  render () {
    let { occupations, userOccupations } = this.props.occupations

    return (
      <Container fluid>
        <Row>
          <Col xs={12} lg={8}>
            <Row>
              <Col xs={12}>
                <div className='sortableWrapper'>
                  {/* {mOccupations && mOccupations.map((occupation) => { */}
                  {/* return <OccupationItem key={occupation.id} occupation={occupation} /> */}
                  {/* })} */}
                  {userOccupations &&
                  <SortableList
                    helperClass='moving'
                    axis='xy'
                    pressDelay={200}
                    items={userOccupations}
                    onSortStart={this.onSortStart}
                    onSortEnd={this.onSortEnd}
                    onRemove={this.onRemove}
                  />}
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <ThreeDButton onClick={() => this._saveToServer()}>Spara</ThreeDButton>
              </Col>
            </Row>
          </Col>
          <Col>
            <OccupationForm />
          </Col>
        </Row>
      </Container>
    )
  }
}

export default connect((state) => state)(Occupations)
