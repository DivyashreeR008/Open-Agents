import { useState, useEffect, useRef } from 'react'
import { Mic, MicOff } from 'lucide-react'

/**
 * VoiceInput — a mic button that uses the browser-native SpeechRecognition API
 * to transcribe speech into a text/textarea field.
 *
 * Renders nothing on browsers without SpeechRecognition support (e.g. Firefox).
 * Speech is appended to whatever was already in the field, so keyboard input
 * and dictation can be mixed freely.
 *
 * Props:
 *   value     — current value of the input field (string)
 *   onChange  — called with the new value (string) when speech is transcribed
 *   disabled  — optional, disables the mic button
 *   className — optional extra classes for positioning
 */
export default function VoiceInput({
  value,
  onChange,
  disabled = false,
  className = '',
  lang = 'en-US',
}) {
  // Feature-detect once. If unsupported, the component renders null below.
  const SpeechRecognition =
    typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)

  const [isRecording, setIsRecording] = useState(false)
  // Text for the polite live region. Only state transitions are announced;
  // interim transcript updates are not, so they don't interrupt screen readers.
  const [announcement, setAnnouncement] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const recognitionRef = useRef(null)
  // Snapshot of `value` at the moment recording started. Each onresult event
  // appends the latest transcript to this baseline. We update it in two cases:
  //   1. When the speech engine finalizes a chunk (push it onto the baseline).
  //   2. When the user types while recording (reconcile via lastWrittenRef
  //      below) so their typing doesn't get clobbered by the next onresult.
  const baseValueRef = useRef('')
  // The exact string we last pushed via onChange. If the incoming `value`
  // prop diverges from this while recording, the user typed — and we need
  // to fold their edit into the baseline.
  const lastWrittenRef = useRef('')
  // Latest onChange — keeps the recognition handlers from going stale.
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  // Reconcile user typing during recording. If `value` no longer matches
  // what we last wrote, the user edited the field by hand — make their
  // version the new baseline so the next transcript appends to it.
  useEffect(() => {
    if (isRecording && value !== lastWrittenRef.current) {
      baseValueRef.current = value || ''
      lastWrittenRef.current = value || ''
    }
  }, [value, isRecording])

  // Cleanup: if the component unmounts mid-recording, stop the mic.
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch {
          // ignore — already stopped
        }
      }
    }
  }, [])

  if (!SpeechRecognition) {
    return (
      <>
        <button
          type="button"
          disabled
          title="Voice input is not supported in this browser"
          aria-label="Voice input is not supported in this browser"
          aria-describedby="voice-input-support"
          className={`absolute z-10 flex items-center justify-center w-7 h-7 text-gray-400 opacity-40 cursor-not-allowed dark:text-text-muted ${className}`}
        >
          <MicOff size={14} aria-hidden="true" />
        </button>
        <span id="voice-input-support" role="status" className="sr-only">
          Voice input is not supported in this browser. You can still type your input.
        </span>
      </>
    )
  }

  const startRecording = () => {
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = lang

    baseValueRef.current = value || ''
    lastWrittenRef.current = value || ''
    setErrorMessage('')

    recognition.onresult = (event) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      // Persist finalized transcript into the baseline so the next event
      // doesn't overwrite it with only interim results.
      if (finalTranscript) {
        const sep = baseValueRef.current && !baseValueRef.current.endsWith(' ') ? ' ' : ''
        baseValueRef.current = baseValueRef.current + sep + finalTranscript.trim()
        // Announce only finalized speech; interim revisions would interrupt.
        setAnnouncement(finalTranscript.trim())
      }

      // Trim interim too — Chrome's SpeechRecognition often returns
      // transcripts with leading spaces ("word boundary" markers). Without
      // trimming, you get a leading space on the very first utterance and
      // double spaces between utterances.
      const interim = interimTranscript.trim()
      const sep = baseValueRef.current && interim && !baseValueRef.current.endsWith(' ') ? ' ' : ''
      const next = baseValueRef.current + sep + interim
      lastWrittenRef.current = next
      onChangeRef.current(next)
    }

    // The Web Speech API fires `end` after `error`, so remember the failure
    // here; otherwise onend would overwrite the failure message.
    let failureMessage = ''

    recognition.onerror = (event) => {
      if (event?.error === 'aborted') {
        setIsRecording(false)
        recognitionRef.current = null
        return
      }

      const code = event?.error
      const message =
        code === 'not-allowed' || code === 'service-not-allowed'
          ? 'Microphone access is blocked. Allow microphone access in your browser settings to use voice input.'
          : code === 'audio-capture'
            ? 'No microphone was found. Connect a microphone and try again.'
            : code === 'network'
              ? 'Voice input lost its connection. Check your network and try again.'
              : 'Voice input failed. Check your microphone and try again.'

      failureMessage = message
      setErrorMessage(message)
      setIsRecording(false)
      setAnnouncement(message)
      recognitionRef.current = null
    }

    recognition.onend = () => {
      setIsRecording(false)
      setAnnouncement(failureMessage || 'Listening stopped')
      recognitionRef.current = null
    }

    try {
      recognition.start()
      recognitionRef.current = recognition
      setIsRecording(true)
      setAnnouncement('Listening started')
    } catch {
      // start() throws if called while already running — safe to ignore.
      const message = 'Voice input could not start. Check your microphone and browser permissions.'
      setIsRecording(false)
      setErrorMessage(message)
      setAnnouncement(message)
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch {
        // ignore
      }
    }
    setIsRecording(false)
    setAnnouncement('Listening stopped')
  }

  const handleClick = (e) => {
    // Prevent button from submitting forms or stealing focus from the input.
    e.preventDefault()
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        title={isRecording ? 'Stop recording' : 'Start voice input'}
        aria-label={isRecording ? 'Stop voice input' : 'Start voice input'}
        aria-pressed={isRecording}
        className={`absolute z-10 flex items-center justify-center w-7 h-7 transition-colors
        ${
          isRecording
            ? 'text-zinc-500 bg-zinc-500/10 hover:bg-zinc-500/20'
            : 'text-gray-400 hover:text-black dark:hover:text-white hover:bg-zinc-500/10 dark:text-text-muted'
        }
        disabled:opacity-40 disabled:cursor-not-allowed
        ${className}`}
      >
        {isRecording && (
          <span className="absolute inline-flex h-full w-full bg-zinc-500/30 animate-ping" />
        )}
        {isRecording ? (
          <MicOff size={14} className="relative" />
        ) : (
          <Mic size={14} className="relative" />
        )}
      </button>
      {errorMessage ? (
        <span
          role="status"
          aria-live="polite"
          className="absolute right-0 top-full z-20 mt-1 w-64 border border-amber-500/30 bg-amber-50 p-2 text-[11px] leading-relaxed text-amber-900 shadow-sm dark:bg-surface-card dark:text-amber-200"
        >
          {errorMessage}
        </span>
      ) : (
        <span role="status" aria-live="polite" className="sr-only">
          {announcement}
        </span>
      )}
    </>
  )
}
