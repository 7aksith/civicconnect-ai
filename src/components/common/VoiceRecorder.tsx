import React, { useState, useEffect } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, Check, Volume2 } from 'lucide-react';

interface VoiceRecorderProps {
  onRecorded: (audioData: { durationSeconds: number; transcript?: string }) => void;
  onClear?: () => void;
  defaultDuration?: number;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecorded,
  onClear,
  defaultDuration,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(defaultDuration || 0);
  const [hasRecorded, setHasRecorded] = useState(!!defaultDuration);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);

  // Timer while recording
  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Simulated playback progress
  useEffect(() => {
    let playInterval: any = null;
    if (isPlaying) {
      playInterval = setInterval(() => {
        setPlaybackProgress((p) => {
          if (p >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return p + 5;
        });
      }, 200);
    } else {
      clearInterval(playInterval);
    }
    return () => clearInterval(playInterval);
  }, [isPlaying]);

  const handleStart = () => {
    setSeconds(0);
    setIsRecording(true);
    setHasRecorded(false);
    setIsPlaying(false);
    setPlaybackProgress(0);
  };

  const handleStop = () => {
    setIsRecording(false);
    setHasRecorded(true);
    const finalSeconds = Math.max(seconds, 3);
    setSeconds(finalSeconds);
    onRecorded({
      durationSeconds: finalSeconds,
      transcript: 'Citizen audio observation: Urgent hazard situation detected with visible damage and risk to pedestrians.',
    });
  };

  const handleReset = () => {
    setIsRecording(false);
    setHasRecorded(false);
    setSeconds(0);
    setIsPlaying(false);
    setPlaybackProgress(0);
    if (onClear) onClear();
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-100 text-blue-700'}`}>
            <Mic size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Voice Evidence Note</h4>
            <p className="text-xs text-slate-500">Dictate challenge details in English or regional dialect</p>
          </div>
        </div>
        <div className="font-mono text-sm font-bold bg-white px-3 py-1 rounded-lg border border-slate-200 text-slate-700">
          {formatTime(seconds)}
        </div>
      </div>

      {isRecording && (
        <div className="my-4 bg-white p-4 rounded-xl border border-red-200 flex flex-col items-center gap-3">
          <div className="flex items-center gap-1.5 h-8">
            {[35, 70, 45, 90, 60, 30, 85, 95, 40, 65, 80, 50, 90, 75, 40].map((h, i) => (
              <span
                key={i}
                className="w-1.5 bg-red-500 rounded-full animate-pulse"
                style={{
                  height: `${h}%`,
                  animationDelay: `${(i * 0.08).toFixed(2)}s`,
                  animationDuration: '0.6s',
                }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-red-600">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            <span>Recording audio note... Speak clearly</span>
          </div>
        </div>
      )}

      {hasRecorded && !isRecording && (
        <div className="my-4 bg-white p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
              <Check size={14} className="text-emerald-600" />
              <span>Audio Clip Captured ({formatTime(seconds)})</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">AI Speech-to-Text ready</span>
          </div>

          {/* Progress bar / waveform visualization */}
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden relative">
            <div
              className="bg-blue-600 h-full transition-all duration-200 rounded-full"
              style={{ width: `${playbackProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              <span>{isPlaying ? 'Pause' : 'Play Preview'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-red-600 transition-colors"
            >
              <RotateCcw size={13} />
              <span>Re-record</span>
            </button>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex items-center gap-3">
        {!isRecording && !hasRecorded && (
          <button
            type="button"
            onClick={handleStart}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-sm transition-all"
          >
            <Mic size={16} />
            <span>Record Voice Note</span>
          </button>
        )}

        {isRecording && (
          <button
            type="button"
            onClick={handleStop}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm shadow-sm transition-all"
          >
            <Square size={16} />
            <span>Stop & Attach Recording</span>
          </button>
        )}

        {hasRecorded && !isRecording && (
          <div className="flex-1 flex items-center justify-between text-xs text-slate-600 bg-slate-100/80 px-3 py-2 rounded-xl">
            <div className="flex items-center gap-1.5">
              <Volume2 size={15} className="text-slate-500" />
              <span>Attached to submission evidence</span>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="text-red-600 font-semibold hover:underline"
            >
              Discard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
