var pull = require('pull-stream')
var fromRainbowPixels = require('rainbow-pixels')
var convert = require('ndpixels-convert')
var raf = require('raf')
var toApa102Buffer = require('pixels-apa102')

var toSpi = require('./')
var toTerminal = require('2dpixels-terminal')

var opts = {
  shape: [
    process.argv[2] || 1,
    process.argv[3] || 120
  ],
  device: '/dev/spidev1.0'
}

pull(
  fromRainbowPixels(opts),
  converter('hsl', 'rgb'),
  animator(),
  pull(pull.map(toApa102Buffer), toSpi(opts)),
  //pull(toTerminal(opts), pull.drain())
)

function animator () {
  var clean = true
  return pull.asyncMap(function (pixels, cb) {
    if (clean) {
      clean = false
      raf(function () {
        clean = true
        cb(null, pixels)
      })
    }
  })
}

function converter (from, to) {
  var converter = convert(from, to)
  return pull.map(function (pixels) {
    return converter(pixels)
  })
}
