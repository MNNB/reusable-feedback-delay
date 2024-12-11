import { html, render } from 'https://unpkg.com/lit-html';
import 'https://unpkg.com/@ircam/sc-components@latest';

import resumeAudioContext from './lib/resume-audio-context.js';
import loadAudioBuffer from './lib/load-audio-buffer.js';
import FeedbackDelay from './lib/FeedBackDelay.js';

const audioContext = new AudioContext();
await resumeAudioContext(audioContext);

const buffer = await loadAudioBuffer('./assets/sample.wav', audioContext.sampleRate);

// Import FeedbackDelay as a module
const feedbackDelay = new FeedbackDelay(audioContext, {
  delayTime: 0.2,
  preGain: 0.5,
})
feedbackDelay.output.connect(audioContext.destination)

// Execute the function every second
setInterval(() => {
  const src = audioContext.createBufferSource()
  src.connect(feedbackDelay.input)
  src.buffer = buffer
  src.start()
}, 1000)

// Delay the execution by one second
setTimeout(() => console.log('coucou'), 1000)

render(html`
  <h1>04-feedback-delay</h1>

  <div class="sliders">
    <sc-text>preGain</sc-text>
    <sc-slider
      min="0"
      max="1"
      number-box
      value=${feedbackDelay.defaultPreGain}
      @input=${e => feedbackDelay.setPreGain(e.detail.value)}
    ></sc-slider>
  </div>

  <div class="sliders">
    <sc-text>feedback</sc-text>
    <sc-slider
      min="0"
      max="1"
      number-box
      value=${feedbackDelay.defaultFeedback}
      @input=${e => feedbackDelay.setDelayTime(e.detail.value)}
    ></sc-slider>
  </div>

  <div class="sliders">
    <sc-text>delayTime</sc-text>
    <sc-slider
      min="0"
      max="1"
      number-box
      value=${feedbackDelay.defaultDelayTime}
      @input=${e => feedbackDelay.setDelayTime(e.detail.value)}
    ></sc-slider>
  </div>
`, document.body);
