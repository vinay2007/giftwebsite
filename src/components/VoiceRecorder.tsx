import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, Check, Trash2, AlertCircle } from 'lucide-react';

interface VoiceRecorderProps {
  currentVoiceUrl: string | null;
  onSaveRecording: (blob: Blob, url: string) => void;
  onRemoveRecording: () => void;
}

type RecorderState = 'idle' | 'recording' | 'paused' | 'reviewing';

const MAX_RECORDING_SECONDS = 300; // 5 minutes max

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  currentVoiceUrl,
  onSaveRecording,
  onRemoveRecording,
}) => {
  const [recorderState, setRecorderState] = useState<RecorderState>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Review & playback state
  const [tempBlob, setTempBlob] = useState<Blob | null>(null);
  const [tempUrl, setTempUrl] = useState<string | null>(null);
  const [isPlayingReview, setIsPlayingReview] = useState(false);
  const [reviewProgress, setReviewProgress] = useState(0);
  const [reviewTime, setReviewTime] = useState({ current: '0:00', total: '0:00' });

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const reviewAudioRef = useRef<HTMLAudioElement | null>(null);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || !isFinite(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Clean up microphone stream
  const releaseMicrophone = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  }, []);

  // Clear timers
  const clearTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer();
      releaseMicrophone();
      if (tempUrl && tempUrl.startsWith('blob:')) {
        URL.revokeObjectURL(tempUrl);
      }
    };
  }, [clearTimer, releaseMicrophone, tempUrl]);

  // Determine supported audio mime type
  const getSupportedMimeType = (): string => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/aac',
      'audio/ogg;codecs=opus',
    ];
    for (const t of types) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) {
        return t;
      }
    }
    return '';
  };

  const startRecording = async () => {
    setErrorMessage(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage(
        'Voice recording is not supported in this browser. Please use a modern browser on a secure (HTTPS or localhost) connection.'
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      mediaStreamRef.current = stream;
      audioChunksRef.current = [];

      const mimeType = getSupportedMimeType();
      const options = mimeType ? { mimeType } : undefined;
      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        releaseMicrophone();
        clearTimer();

        const recordedBlob = new Blob(audioChunksRef.current, {
          type: mimeType || 'audio/webm',
        });

        if (recordedBlob.size === 0) {
          setErrorMessage('No audio was captured. Please try recording again.');
          setRecorderState('idle');
          return;
        }

        const url = URL.createObjectURL(recordedBlob);
        setTempBlob(recordedBlob);
        setTempUrl(url);
        setRecorderState('reviewing');
      };

      recorder.start(250); // Slice data every 250ms
      setRecorderState('recording');
      setElapsedSeconds(0);

      // Start elapsed timer
      timerIntervalRef.current = window.setInterval(() => {
        setElapsedSeconds((prev) => {
          if (prev >= MAX_RECORDING_SECONDS - 1) {
            stopRecording();
            return MAX_RECORDING_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: unknown) {
      releaseMicrophone();
      clearTimer();
      const error = err as Error;
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setErrorMessage(
          'Microphone permission was denied. Please allow microphone access in your browser to record a message.'
        );
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setErrorMessage(
          'No microphone was found on your device. Please connect a microphone and try again.'
        );
      } else {
        setErrorMessage('Could not start recording. Please check your microphone settings.');
      }
      setRecorderState('idle');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && recorderState === 'recording') {
      mediaRecorderRef.current.pause();
      clearTimer();
      setRecorderState('paused');
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && recorderState === 'paused') {
      mediaRecorderRef.current.resume();
      timerIntervalRef.current = window.setInterval(() => {
        setElapsedSeconds((prev) => {
          if (prev >= MAX_RECORDING_SECONDS - 1) {
            stopRecording();
            return MAX_RECORDING_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);
      setRecorderState('recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const discardRecording = () => {
    if (tempUrl && tempUrl.startsWith('blob:')) {
      URL.revokeObjectURL(tempUrl);
    }
    setTempBlob(null);
    setTempUrl(null);
    setIsPlayingReview(false);
    setRecorderState('idle');
    setElapsedSeconds(0);
    setErrorMessage(null);
  };

  const acceptRecording = () => {
    if (tempBlob && tempUrl) {
      onSaveRecording(tempBlob, tempUrl);
      setRecorderState('idle');
      setTempBlob(null);
      setTempUrl(null);
    }
  };

  const togglePlayReview = () => {
    if (!reviewAudioRef.current) return;
    if (isPlayingReview) {
      reviewAudioRef.current.pause();
      setIsPlayingReview(false);
    } else {
      reviewAudioRef.current.play().then(() => setIsPlayingReview(true));
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden audio element for previewing temp recording */}
      {tempUrl && (
        <audio
          ref={reviewAudioRef}
          src={tempUrl}
          onTimeUpdate={() => {
            if (!reviewAudioRef.current) return;
            const cur = reviewAudioRef.current.currentTime;
            const dur = reviewAudioRef.current.duration || 1;
            setReviewProgress((cur / dur) * 100);
            setReviewTime({
              current: formatTime(cur),
              total: formatTime(dur),
            });
          }}
          onEnded={() => {
            setIsPlayingReview(false);
            setReviewProgress(0);
          }}
        />
      )}

      {/* Error alert */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
          <div className="flex-1">
            <p>{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-400 hover:text-white text-xs underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Case 1: Active recording or paused */}
      {(recorderState === 'recording' || recorderState === 'paused') && (
        <div className="p-6 rounded-2xl bg-zinc-900/90 border border-amber-200/40 shadow-xl space-y-5 text-center">
          <div className="flex items-center justify-center gap-3">
            <span
              className={`w-3.5 h-3.5 rounded-full ${
                recorderState === 'recording' ? 'bg-red-500 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="font-serif italic text-lg text-ivory">
              {recorderState === 'recording' ? 'Recording your message...' : 'Recording paused'}
            </span>
          </div>

          <div className="text-3xl font-mono tabular-nums text-amber-200 tracking-wider">
            {formatTime(elapsedSeconds)}
            <span className="text-xs text-zinc-500 font-sans ml-2">/ 5:00 max</span>
          </div>

          <p className="text-xs text-zinc-400 max-w-sm mx-auto font-sans">
            Speak naturally and share what is in your heart. Click Stop when you are done.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            {recorderState === 'recording' ? (
              <button
                onClick={pauseRecording}
                className="px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-sans border border-zinc-700 transition-colors"
              >
                Pause
              </button>
            ) : (
              <button
                onClick={resumeRecording}
                className="px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-amber-200 text-xs font-sans border border-zinc-700 transition-colors"
              >
                Resume
              </button>
            )}

            <button
              onClick={stopRecording}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-medium uppercase tracking-wider transition-colors shadow-lg shadow-red-950/40"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop Recording</span>
            </button>
          </div>
        </div>
      )}

      {/* Case 2: Reviewing freshly recorded audio */}
      {recorderState === 'reviewing' && (
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-700 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-amber-200" />
              <span className="text-sm font-serif text-ivory">Listen to your recording</span>
            </div>
            <span className="text-xs font-mono text-zinc-400 tabular-nums">
              {reviewTime.total !== '0:00' ? reviewTime.total : formatTime(elapsedSeconds)}
            </span>
          </div>

          {/* Scrubber player */}
          <div className="flex items-center gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
            <button
              onClick={togglePlayReview}
              className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 text-ivory hover:text-amber-200 flex items-center justify-center shrink-0 border border-zinc-700 transition-colors"
            >
              {isPlayingReview ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current translate-x-0.5" />
              )}
            </button>

            <div className="flex-1 space-y-1">
              <div
                className="w-full h-1.5 bg-zinc-800 rounded-full cursor-pointer overflow-hidden"
                onClick={(e) => {
                  if (!reviewAudioRef.current) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  reviewAudioRef.current.currentTime = pos * (reviewAudioRef.current.duration || 1);
                }}
              >
                <div
                  className="h-full bg-amber-200 rounded-full transition-all"
                  style={{ width: `${reviewProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] tabular-nums text-zinc-500 font-mono">
                <span>{reviewTime.current}</span>
                <span>{reviewTime.total !== '0:00' ? reviewTime.total : formatTime(elapsedSeconds)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={discardRecording}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Record again</span>
            </button>

            <button
              onClick={acceptRecording}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-200 text-zinc-950 text-xs font-medium hover:bg-amber-100 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Use this message</span>
            </button>
          </div>
        </div>
      )}

      {/* Case 3: Idle (either has an existing saved voice recording or none) */}
      {recorderState === 'idle' && (
        <div>
          {currentVoiceUrl ? (
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-200/10 border border-amber-200/30 flex items-center justify-center text-amber-200">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-serif text-ivory block">
                    Voice message ready
                  </span>
                  <span className="text-[11px] text-zinc-400 font-sans">
                    Saved and attached to this gift
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={startRecording}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-sans border border-zinc-700 transition-colors"
                >
                  Record new
                </button>
                <button
                  onClick={onRemoveRecording}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                  title="Remove voice recording"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-dashed border-zinc-700/80 hover:border-zinc-500 text-center space-y-3 transition-colors">
              <div className="w-12 h-12 rounded-full bg-zinc-800/80 border border-zinc-700 flex items-center justify-center mx-auto text-amber-200">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-serif text-ivory block">
                  Record a message for them
                </span>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto font-sans mt-1">
                  Leave a personal message in your own voice. They can listen to it privately with headphones.
                </p>
              </div>
              <button
                type="button"
                onClick={startRecording}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-ivory text-xs font-medium border border-zinc-600 transition-colors"
              >
                <Mic className="w-3.5 h-3.5 text-amber-200" />
                <span>Start recording</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
