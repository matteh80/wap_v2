import React from 'react'
import './HiddenCardsController.scss'
import classNames from 'classnames'
import html2canvas from 'html2canvas'
import $ from 'jquery'
import _ from 'lodash'

class HiddenCardsController extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isOpen: false,
      renderCanvas: false,
      hiddenItems: []
    }

    this.toggle = this.toggle.bind(this)
    this.createStartSnapshots = this.createStartSnapshots.bind(this)
    this.createSnapshot = this.createSnapshot.bind(this)
    this.restoreItem = this.restoreItem.bind(this)
    this.removeSnapshot = this.removeSnapshot.bind(this)
    this.hiddenClone = this.hiddenClone.bind(this)
  }

  componentDidMount () {
    this.props.hiddenCards.length > 0 && this.createStartSnapshots()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.hiddenCards.length < this.props.hiddenCards.length) {
      this.createSnapshot()
    }
  }

  toggle () {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  restoreItem (itemName) {
    let index = -1
    $('.canvasWrapper').each(function (i, element) {
      if (element.id === itemName) {
        index = i
      }
    })

    this.removeSnapshot(index).then(() => {
      this.props.onAdd(itemName)
    })
  }

  removeSnapshot (index) {
    return new Promise((resolve, reject) => {
      const items = Object.assign([], this.state.hiddenItems)
      items.splice(index, 1)

      this.setState({
        hiddenItems : items,
        isOpen: this.state.hiddenItems.length === 1 && false
      }, resolve())
    })
  }

  hiddenClone (element) {
    // Create clone of element
    console.log(element)

    let clone = element.cloneNode(true)
    // Position element relatively within the
    // body but still out of the viewport
    let style = clone.style
    style.position = 'relative'
    style.top = window.innerHeight + 'px'
    style.left = 0
    style.maxWidth = '300px'

    // Append clone to body and return the clone
    document.body.appendChild(clone)
    return clone
  }

  createSnapshot () {
    $('body').addClass('canvasRender')
    let element = $('.tempList > div').last()
    let _self = this
    this.setState({ renderCanvas: true })
    return new Promise((resolve, reject) => {
      let clone = _self.hiddenClone(element[0])
      _self.setState({ renderCanvas: false })
      return html2canvas(clone, {
        imageTimeout: 6000,
        onrendered: function (canvas) {
          let mWrapper = React.createElement(
            'div',
            {
              key: clone.id,
              className: 'canvasWrapper',
              id: clone.id,
              onClick: () => _self.restoreItem(clone.id)
            },
            React.createElement(
              'img',
              {
                className: 'img-fluid',
                src: canvas.toDataURL('image/png')
              }
            )
          )

          _self.setState({
            hiddenItems: _.concat(_self.state.hiddenItems, mWrapper)
          })

          $(clone).remove()
          // $(element).remove()
          $('body').removeClass('canvasRender')
          resolve('Valid')
        }
      })
        .catch(err => {
          reject(err)
        })
        .then(() => {

        })
    })
  }

  createStartSnapshots () {
    $('body').addClass('canvasRender')
    console.log('createStartSnapshots')
    let promises = []
    let _self = this
    this.setState({ renderCanvas: true })
    // $('.cardList').empty()

    $('.tempList > div').each(function (index, element) {
      let $this = $(this)
      let promise = new Promise((resolve, reject) => {
        let clone = _self.hiddenClone(element)
        return html2canvas(clone, {
          imageTimeout: 6000,
          onrendered: function (canvas) {
            let mWrapper = React.createElement(
              'div',
              {
                key: element.id,
                className: 'canvasWrapper',
                id: element.id,
                onClick: () => _self.restoreItem(element.id)
              },
              React.createElement(
                'img',
                {
                  className: 'img-fluid',
                  src: canvas.toDataURL('image/png')
                }
              )
            )

            _self.setState({
              hiddenItems: _.concat(_self.state.hiddenItems, mWrapper)
            })

            $(clone).remove()
            // $(element).remove()
            $('body').removeClass('canvasRender')
            resolve('Valid')
          }
        })
          .catch(err => {
            reject(err)
          })
      })
      promises.push(promise)

      Promise.all(promises).then((result) => {
        console.log('done')
        _self.setState({ renderCanvas: false })
      })
    })
  }

  render () {
    let wrapperClass = classNames(
      this.props.hiddenCards.length > 0 && 'hasCards',
      this.state.isOpen && 'isOpen'
    )

    let tempClass = classNames('tempList', this.state.renderCanvas ? 'd-block' : 'd-none')

    return (
      <div id='hiddenCards' className={wrapperClass}>
        <i className='fa fa-columns' onClick={() => this.toggle()} />
        <div className='innerWrapper'>
          <div className='cardList'>
            {this.state.hiddenItems && this.state.hiddenItems.map((item) => {
              return (
                <div>
                  {item}
                </div>
              )
            })}
          </div>
          <div className={tempClass}>
            {this.props.hiddenCards.map((card) => {
              return (
                <div key={card.name} id={card.name}>{card.component}</div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}

export default HiddenCardsController
