var content
var input

window.onload = function() {
  content = document.getElementById("content")
  input = document.getElementById("input")
  input.addEventListener("change", createAudioElements)
}

function createAudioElements() {
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
      var fadeAudio = setInterval(function() {
        if (audio.volume >= original_volume) {
          clearInterval(fadeAudio)
        } else {
          if (audio.volume + original_volume/fadeIn_input.value*(200/1000) >= original_volume) {
            audio.volume = original_volume
            clearInterval(fadeAudio)
          } else {
            audio.volume += original_volume/fadeIn_input.value*(200/1000)
          }
        }
      }, 200)
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
      var fadeAudio = setInterval(function(){
        if (audio.paused) {
          audio.volume = original_volume
          clearInterval(fadeAudio)
        }
        if (audio.volume - original_volume/fadeOut_input.value*(200/1000) <= 0) {
          audio.volume = 0
          audio.pause()
        } else {
          audio.volume -= original_volume/fadeOut_input.value*(200/1000)
        }
      }, 200)
    }

    let fadeOut = document.createElement("DIV")
    fadeOut.appendChild(fadeOut_button)
    fadeOut.appendChild(fadeOut_input)

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

    // add it to the content div
    content.appendChild(div)
  }
}
