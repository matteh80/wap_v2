import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import ReactTable from 'react-table'
import './Jobs.scss'
import {
  Container,
  Row,
  Col,
} from 'reactstrap'
import { getAllJobs } from '../../store/actions/jobs'
import SpeechBubble from '../../components/Helpers/SpeechBubble/SpeechBubble'

class Jobs extends React.Component {
  constructor (props) {
    super(props)

    let { dispatch } = this.props

    this.state = {
      fetched: false,
      jobs: []
    }

    dispatch(getAllJobs()).then(() => {
      this.setState({
        fetched: true,
      })
    })

    this.gotoJob = this.gotoJob.bind(this)
  }

  gotoJob (id) {
    this.props.router.push('/jobs/' + id)
  }

  render () {
    return (
      <Container fluid>
        <Row className='flex-column'>
          <SpeechBubble xs={12}>
            <p>Här finns de tjänster som du just nu kan ansöka direkt till med ditt wap card.</p>
            <p>Tips: Se till att du har uppdaterat allt du kan i din profil innan du skickar din ansökan för att öka dina chanser till drömjobbet</p>
          </SpeechBubble>
          <Col xs='12'>
            <ReactTable
              className='-highlight mb-5'
              data={this.props.jobs.allJobs}
              columns={columns}
              filterable
              // Texts
              previousText='Föregående'
              nextText='Nästa'
              loadingText='Hämtar tjänster...'
              noDataText='Inga matchningar'
              pageText='Sida'
              ofText='av'
              rowsText='rader'
              getTdProps={(state, rowInfo, column, instance) => {
                return {
                  onClick: e => {
                    console.log('A Td Element was clicked!')
                    console.log('it produced this event:', e)
                    console.log('It was in this column:', column)
                    console.log('It was in this row:', rowInfo)
                    console.log('It was in this table instance:', instance)
                    this.props.router.push('/jobs/' + rowInfo.original.id)
                  }
                }
              }}
            />
          </Col>
        </Row>
      </Container>
    )
  }
}

export default withRouter(connect((state) => state)(Jobs))

const columns = [{
  Header: 'Titel',
  accessor: 'title',
  filterMethod: (filter, row) => (row[filter.id].toLowerCase().includes(filter.value.toLowerCase()))
}, {
  Header: 'Län',
  accessor: 'state',
  filterMethod: (filter, row) => (row[filter.id].toLowerCase().startsWith(filter.value.toLowerCase()))
}, {
  Header: 'Stad',
  accessor: 'municipality',
  filterMethod: (filter, row) => (row[filter.id].toLowerCase().startsWith(filter.value.toLowerCase()))
}, {
  Header: 'Pub.datum',
  accessor: 'pubdate',
  filterable: false,
  maxWidth: 100,
  Cell: row => {
    return row.value
  }
}]
