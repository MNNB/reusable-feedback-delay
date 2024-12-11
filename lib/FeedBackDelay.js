class FeedbackDelay {
    constructor(audioContext, options = {}) {
        console.log('instance created')
        this.audioContext = audioContext

        this.defaultPreGain = Number.isFinite(options.preGain) ? options.preGain : 0.9
        this.defaultDelayTime = Number.isFinite(options.delayTime) ? options.delayTime : 0.1
        this.defaultFeedback = Number.isFinite(options.feedback) ? options.feedback : 0.9

        this.input = this.audioContext.createGain()
        this.output = this.audioContext.createGain()

        // Direct sound
        this.input.connect(this.output)

        this.preGain = this.audioContext.createGain()
        this.preGain.gain.value = this.defaultPreGain
        this.input.connect(this.preGain)

        this.delay = this.audioContext.createDelay()
        this.preGain.connect(this.delay)
        this.delay.connect(this.output)
        this.delay.delayTime.value = this.defaultDelayTime

        // Feedback loop
        this.feedback = this.audioContext.createGain()
        this.feedback.gain.value = this.defaultFeedback
        this.delay.connect(this.feedback)
        this.feedback.connect(this.delay)
    }

    setPreGain(value) {
        const now = this.audioContext.currentTime
        this.preGain.gain.setTargetAtTime(value, now, 0.02)
    }

    setFeedback(value) {
        const now = this.audioContext.currentTime
        this.feedback.gain.setTargetAtTime(value, now, 0.02)
    }

    setDelayTime(value) {
        const now = this.audioContext.currentTime
        this.delay.delayTime.setTargetAtTime(value, now, 0.02)
    }
}

export default FeedbackDelay