import React from 'react'
import { connect } from 'react-redux'
import './CVBuilder.scss'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import Masonry from 'react-masonry-component'
import $ from 'jquery'

import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBlock,
  FormGroup,
  Label,
  Input
} from 'reactstrap'
import ThreeDButton from '../../components/buttons/ThreeDButton'
import Template1 from './Templates/Template1/Template1'

class CVBuilder extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      employments: Object.assign([], this.props.employments.employments),
      educatations: this.props.educations.educations,
      skills: this.props.skills.userSkills,
      occupations: this.props.occupations.userOccupations,
      languages: this.props.languages.userLanguages
    }

    this.createPdf = this.createPdf.bind(this)
    this.onEmploymentChange = this.onEmploymentChange.bind(this)
  }

  createPdf () {
    let promises = []
    let { profile } = this.props
    $('body').css('overflow', 'visible')
    $('#hiddenCV').appendTo('body')
    let content = $('#hiddenCV'),
      cache_width = content.width(),
      a4 = [595.28, 841.89]  // for a4 size paper width and height
    console.log(content)

    content.css('visibility', 'visible')
    $('body').scrollTop(0)

    function getCanvas () {
      content.width((a4[0] * 1.33333)).css('max-width', 'none')
      let doc = new jsPDF({
        unit: 'px',
        format: 'a4'
      })

      $.each($('.A4'), function (index, elem) {
        let promise = new Promise((resolve, reject) => {
          return html2canvas($(this), {
            imageTimeout: 2000,
            onrendered: function (canvas) {
              let img = canvas.toDataURL('image/jpg')
              doc.addPage()
              doc.setPage(index + 1)
              doc.addImage(img, 'JPEG', 0, 0)
              console.log('addedImage')
              // doc.save('cv_' + profile.first_name + '_' + profile.last_name + '.pdf')
              resolve('Valid')
            }
          })
            .catch(err => {
              reject(err)
            })
        })
        promises.push(promise)
      })

      Promise.all(promises).then((result) => {
        console.log('save')
        doc.save('cv_' + profile.first_name + '_' + profile.last_name + '.pdf')
        content.width(cache_width)
        content.css('width', 'auto')
        $('body').css('overflow-x', 'hidden')
        $('#hiddenCV').appendTo('#cv_root')
      })
    }

    getCanvas()
  }

  onEmploymentChange (e, item) {
    let array = this.state.employments
    let index = this.state.employments.findIndex(employments => employments.id === item.id)
    // console.log(index)
    // console.log(array)
    if (index > -1) {
      array.splice(index, 1)
      // console.log(array)
    } else {
      array.push(item)
    }
    array.sort(function (a, b) {
      if (a.start_date < b.start_date) return 1
      if (a.start_date > b.start_date) return -1
      return 0
    })

    this.setState({
      employments: array
    })
  }

  render () {
    let {
      employments
    } = this.props

    return (
      <Container fluid className='cvBuilder'>
        <Masonry
          className='row'
          ref={function (c) {
            this.masonry = this.masonry || c.masonry
          }.bind(this)}
        >
          <Col xs={12} md={6}>
            <Card>
              <CardHeader>Anställningar</CardHeader>
              <CardBlock>
                {employments.employments && employments.employments.map((employment) => {
                  return <CheckboxItem item={employment} label={employment.title} onChange={this.onEmploymentChange} />
                })}
              </CardBlock>
            </Card>
          </Col>

          <Col xs={12} md={6}>
            <Card>
              <CardHeader>Utbildningar</CardHeader>
              <CardBlock>
                Hej
              </CardBlock>
            </Card>
          </Col>

          <Col xs={12} md={6}>
            <Card>
              <CardHeader>Kompetenser</CardHeader>
              <CardBlock>
                Hej
              </CardBlock>
            </Card>
          </Col>
        </Masonry>
        <ThreeDButton onClick={() => this.createPdf()} text='Skapa PDF' />
        <Template1
          employments={this.state.employments}
          educations={this.state.educatations}
          skills={this.state.skills}
          occupations={this.state.occupations}
          languages={this.state.languages}
          profile={this.props.profile}
        />
      </Container>
    )
  }
}

export default connect((state) => state)(CVBuilder)

class CheckboxItem extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <FormGroup check>
        <Label check>
          <Input type='checkbox' defaultChecked onChange={(e) => this.props.onChange(e, this.props.item)} />{' '}
          {this.props.label}
        </Label>
      </FormGroup>
    )
  }
}
