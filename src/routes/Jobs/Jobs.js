import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import ReactTable from 'react-table'
import moment from 'moment'
import {
  Container,
  Row,
  Col,
  Card,
  CardBlock,
  CardTitle,
  CardSubtitle
} from 'reactstrap'
import { getAllJobs } from '../../store/actions/jobs'

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
        <Row>
          <Col>
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
          <Col xs={12} sm={12} md={12} lg={5}>
            <Card className='speechBubble'>
              <CardBlock>
                <p>Här finns de tjänster som du just nu kan ansöka till med ditt wap card.</p>
                <p>Tips: Se till att du har uppdaterat allt du kan i din profil innan du skickar din ansökan för att öka dina chanser till drömjobbet</p>
              </CardBlock>
            </Card>
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
  Header: 'Publiceringsdatum',
  accessor: 'pubdate',
  filterable: false,
  Cell: row => {
    return moment(row.value).format('YYYY-MM-DD')
  }
}]
