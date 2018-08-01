'use strict'

const ipfs = window.IpfsApi('ipfs.infura.io', '5001', {protocol: 'https'})
const Buffer = window.IpfsApi().Buffer

function saveToIpfs (reader) {
  ipfs.add(Buffer.from(reader.result), function (err, res) {
    if (err || !res) {
      return console.error('ipfs add error', err, res)
    }
    res.forEach(function (file) {
      console.log('successfully stored', file.hash)
      display(file.hash)
    })
  })
}

function store () {
  var toStore = document.getElementById('source').files[0]
  let reader = new window.FileReader()
  reader.onloadend = () => saveToIpfs(reader)
  reader.readAsArrayBuffer(toStore)
}

function display (hash) {
  ipfs.cat(hash, function (err, stream) {
    var res = ''

    stream.on('data', function (chunk) {
      res += chunk.toString()
    })

    stream.on('error', function (err) {
      console.error('Oh nooo', err)    
    })

    stream.on('end', function () {
      document.getElementById('hash').innerText = hash
      document.getElementById('content').innerText = res
    })
  })
}

document.getElementById('store').onclick = store