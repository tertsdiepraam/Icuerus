var content
var input
var save
var load
var json_file
var output
var tracks = {}

window.onload = function() {
  content = document.getElementById("content")
  input = document.getElementById("input")
  save = document.getElementById("save")
  load = document.getElementById("load")
  output = document.getElementById("lalala")
  document.getElementById("load_button").onclick = function(){
    load.click()
  }
  input.addEventListener("change", createAudioElements)
  save.onclick = saveJSON
  load.addEventListener("change", loadJSON)

  document.addEventListener("keydown", hotkey)
}

function createAudioElements() {
  icuerus_objects = []
  for (var i=0; i<input.files.length; i++) {
    var file = input.files[i]
    // create a div
    let div = document.createElement("DIV")
    div.className = "audiobox"

    // create audio
    let audio = document.createElement("AUDIO")
    audio.controls = true

    // create text
    let text = document.createElement("P")
    text.innerHTML = file.name
    text.className = "audiotitle"

    // create fade in and out
    let fadeIn_button = document.createElement("BUTTON")
    fadeIn_button.innerHTML = "Fade In"
    // set fade in audio
    let fadeIn_input = document.createElement("INPUT")
    fadeIn_input.type = "number"
    fadeIn_input.value = 0
    fadeIn_button.onclick = function() {
      if (fadeIn_input.value === 0) {
        return
      }
      var original_volume = audio.volume
      audio.volume = 0
      audio.play()
      var interval = 10
      var fadeAudio = setInterval(function() {
        if (audio.volume >= original_volume) {
          clearInterval(fadeAudio)
        } else {
          if (audio.volume + original_volume/fadeIn_input.value*(interval/1000) >= original_volume) {
            audio.volume = original_volume
            clearInterval(fadeAudio)
          } else {
            audio.volume += original_volume/fadeIn_input.value*(interval/1000)
          }
        }
      }, interval)
    }

    let fadeIn = document.createElement("DIV")
    fadeIn.appendChild(fadeIn_button)
    fadeIn.appendChild(fadeIn_input)

    let fadeOut_button = document.createElement("BUTTON")
    fadeOut_button.innerHTML = "Fade Out"
    let fadeOut_input = document.createElement("INPUT")
    fadeOut_input.type = "number"
    fadeOut_input.value = 0
    fadeOut_button.onclick = function (){
      if (fadeOut_input.value === 0) {
        return
      }
      var original_volume = audio.volume
      var interval = 10
      var fadeAudio = setInterval(function(){
        if (audio.paused) {
          audio.volume = original_volume
          clearInterval(fadeAudio)
        }
        if (audio.volume - original_volume/fadeOut_input.value*(interval/1000) <= 0) {
          audio.volume = 0
          audio.pause()
        } else {
          audio.volume -= original_volume/fadeOut_input.value*(interval/1000)
        }
      }, 200)
    }

    let fadeOut = document.createElement("DIV")
    fadeOut.appendChild(fadeOut_button)
    fadeOut.appendChild(fadeOut_input)

    // hotkey
    let hotkey_text = document.createElement("P")
    hotkey_text.innerHTML = "Hotkey:"
    hotkey_text.style.margin = "0px"
    let hotkey_input = document.createElement("INPUT")
    hotkey_input.pattern = ".{0,1}"
    let hotkey_div = document.createElement("DIV")
    hotkey_div.style.display = "flex"
    hotkey_div.appendChild(hotkey_text)
    hotkey_div.appendChild(hotkey_input)

    // loop
    let loop_text = document.createElement("P")
    loop_text.innerHTML = "Loop:"
    loop_text.style.margin = "0px"
    let loop_input = document.createElement("INPUT")
    loop_input.type = "checkbox"
    let loop_div = document.createElement("DIV")
    loop_div.style.display = "flex"
    loop_div.appendChild(loop_text)
    loop_div.appendChild(loop_input)

    // set audio src
    audio.src = URL.createObjectURL(file)

    // combine it all
    var text_div = document.createElement("DIV")
    text_div.appendChild(text)
    div.appendChild(text_div)
    var audio_div = document.createElement("DIV")
    audio_div.appendChild(audio)
    div.appendChild(audio_div)
    div.appendChild(fadeIn)
    div.appendChild(fadeOut)
    div.appendChild(hotkey_div)
    div.appendChild(loop_div)

    // add it to the content div
    content.appendChild(div)

    let track = {
      audio: audio,
      fadeIn: fadeIn_input,
      fadeOut: fadeOut_input,
      hotkey: hotkey_input,
      loop: loop_input
    }
    track.loop.addEventListener("change", function() {
      track.audio.loop = loop_input.checked
    })
    tracks[file.name] = track
  }
}

function saveJSON(){
  var save_tracks = {}
  for (var track in tracks) {
    if (tracks.hasOwnProperty(track)) {
      console.log(track)
      save_tracks[track] = {
        volume: tracks[track].audio.volume,
        fadeIn: tracks[track].fadeIn.value,
        fadeOut: tracks[track].fadeOut.value,
        hotkey: tracks[track].hotkey.value,
        loop: tracks[track].loop.checked
      }
    }
  }
  var bb = new Blob([JSON.stringify(save_tracks)], {type: 'text/plain'})
  var a = document.getElementById("save_link")
  a.download = 'icuerus.json'
  if (a.href) {
    window.URL.revokeObjectURL(a.href)
  }
  a.href = window.URL.createObjectURL(bb)
  a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':')
  a.click()
}

function loadJSON() {
  var reader = new FileReader()
  reader.onload = function(e) {
    console.log(e.target.result)
    var json = JSON.parse(e.target.result)
    console.log(json)
    for (var track in json) {
      if (json.hasOwnProperty(track) && tracks.hasOwnProperty(track)) {
        tracks[track].audio.volume = json[track].volume
        tracks[track].fadeIn.value = json[track].fadeIn
        tracks[track].fadeOut.value = json[track].fadeOut
        tracks[track].hotkey.value = json[track].hotkey
        tracks[track].loop.checked = json[track].loop
        //
        tracks[track].audio.loop = json[track].loop
      }
    }
  }
  json_file = load.files[0]
  reader.readAsText(json_file)
}

function hotkey(event) {
  for (var track in tracks) {
    if (event.key === tracks[track].hotkey.value) {
      audio = tracks[track].audio
      if (audio.paused) {
        audio.play()
      } else {
        audio.pause()
      }
    }
  }
}
