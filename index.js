var SPI = require('pi-spi')
var pull = require('pull-stream')

module.exports = pullSpi

function pullSpi (opts, cb) {
  opts = opts || {}

  var spi = SPI.initialize(opts.device)

  if (opts.clockSpeed) {
    spi.clockSpeed(opts.clockSpeed)
  }

  if (opts.dataMode) {
    spi.dataMode(opts.dataMode)
  }

  if (opts.bitOrder) {
    spi.bitOrder(opts.bitOrder)
  }
  
  return pull(
    pull.asyncMap(function (buffer, cb) {
      spi.write(buffer, cb)
    }),
    pull.drain(cb)
  )
}
