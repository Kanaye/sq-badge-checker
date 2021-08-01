import './Export.css';
import React, { componentDidMount } from 'react';
let steg = require('../../lib/steganography.js')

class Export extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const canvas = this.refs.canvas
    const ctx = canvas.getContext("2d")
    const img = this.refs.background

    img.onload = () => {
      ctx.fillStyle = "#111420"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      let ptrn = ctx.createPattern(img, 'repeat')
      ctx.fillStyle = ptrn
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = "11px Courier"
      this.props.badges.forEach((badge, i, a) => {
        let image = document.getElementById(badge.issuer)
        let series = badge.code.substr(2,2)
        let yPos = 10 + (128 * Math.floor(i / 8) + 10 * Math.floor(i / 8))
        let xPos = 90 + (128 * i + 10 * i) - yPos * 8


        ctx.fillStyle = "#ffffff"
        if (i === 0) {
          ctx.fillText("SERIES " + series + " BADGES", 10, 17)
        } else if (badge.code === "SSQ01") {
          yPos += 30
          ctx.fillText("EVENT BADGES", 1025, yPos + 7)
          xPos = 976
        } else if (series !== a[i-1].code.substr(2,2)) {
          yPos += 10
          if (series == "03") { yPos += 10 }
          ctx.fillText("SERIES " + series + " BADGES", 10, yPos + 7)
        } else if (a[0].code.substr(2,2) !== series) {
          yPos += 10
          if (series == "03") { yPos += 10 }
        }
        yPos += 10
        ctx.drawImage(image, xPos, yPos, 128, 128)
        if (badge.owned === false) {
          ctx.globalAlpha = 0.95
          ctx.fillStyle = "#000000"
          ctx.fillRect(xPos, yPos, 128,128)
          ctx.fillStyle = "#ffffff"
          ctx.globalAlpha = 1
        }
        if (i === a.length - 1) {
          if (badge.code !== "SSQ01") { yPos += 138 }
          ctx.font = "12px Courier"
          ctx.fillText("VERIFICATION TEXT: " + this.props.verText, 10, yPos + 9)
          ctx.fillText("GENERATED ON: " + new Date(), 10, yPos + 21)
          ctx.fillText("TO VERIFY PROOF, PLEASE UPLOAD THIS IMAGE TO BADGES.ELLIOTFRIEND.COM/VERIFY", 10, yPos + 34)
          ctx.fillText("THIS IMAGE HAS BEEN SIGNED BY AND CREATED FOR:", 10, yPos + 99)
          ctx.fillText("GENERATED BY BADGES.ELLIOTFRIEND.COM", 10, yPos + 128)
          ctx.font = "20px Courier"
          ctx.fillText(this.props.pubkey, 10, yPos + 115)
        }
      })

    }
  }

  render() {
    let badges = this.props.badges
    let pubkey = this.props.pubkey
    // console.log(steg)
    const hideImages = (badges) => {
      let imgArray = []
      badges.forEach((badge, i) => {
        imgArray.push(<img id={badge.issuer} src={"/assets/badges/" + badge.filename} className="d-none" />)
      })
      return imgArray
    }

    let numRows = badges
      .reduce((acc, item, i, arr) => {
        if (i > 0) {
          if ((item.code.substr(0, 4) !== arr[i-1].code.substr(0, 4)) || (item.monochrome && !arr[i-1].monochrome) || (!item.monochrome && arr[i-1].monochrome)) {
            return acc += 1
          } else { return acc }
        } else { return acc }
      }, 1)
    let imgHeight = 10 + 138 * numRows + 40
    if (badges.length > 0) {
      if (badges[badges.length - 1].code !== "SSQ01") {
        imgHeight += 128
      }
    }

    return (
      <div>
        <h2 className="mt-5">Here's Your Export</h2>
        <p>To save your proof, please right-click the below image and select "Save image as..."</p>
        <canvas ref="canvas" id="canvas" width={1114} height={imgHeight} />
        <img ref="background" src="/assets/tileable-classic-nebula-space-patterns-6.png" className="d-none" />
        { hideImages(badges) }
      </div>
    )
  }
}

export default Export
