'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import type { Media, MusicTrack as MusicTrackProps } from '@/payload-types'
import {
  PauseIcon,
  SkipBackIcon,
  SkipForwardIcon,
  VolumeIcon,
  VolumeOffIcon,
  XIcon,
} from 'lucide-react'

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function isMedia(value: number | Media | null | undefined): value is Media {
  return typeof value === 'object' && value !== null
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function WaveAnimation({ isPlaying }: { isPlaying: boolean }) {
  return (
    <span className="flex items-end gap-0.5 h-3" aria-hidden="true">
      {[0.6, 1, 0.75, 1, 0.5].map((h, i) => (
        <span
          key={i}
          className={`w-0.75 rounded-full bg-current transition-all ${
            isPlaying ? 'animate-pulse' : ''
          }`}
          style={{
            height: isPlaying ? `${h * 12}px` : '4px',
            animationDelay: `${i * 120}ms`,
            animationDuration: '700ms',
          }}
        />
      ))}
    </span>
  )
}

function ProgressBar({
  current,
  duration,
  onSeek,
}: {
  current: number
  duration: number
  onSeek: (value: number) => void
}) {
  const percent = duration > 0 ? (current / duration) * 100 : 0

  return (
    <div className="group relative w-full">
      <input
        type="range"
        min={0}
        max={duration || 100}
        value={current}
        onChange={(e) => onSeek(Number(e.target.value))}
        className="w-full h-1 appearance-none bg-stone-200 rounded-full cursor-pointer accent-[#44504c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#44504c]"
        aria-label="Seek track position"
      />
      {/* Custom filled track overlay */}
      <div
        className="pointer-events-none absolute top-1/2 left-0 h-1 rounded-full bg-[#44504c] transition-all"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function MusicPlayer({ tracks }: { tracks: MusicTrackProps[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [isFooterVisible, setIsFooterVisible] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)

  const currentTrack = tracks[currentIndex]

  // ── Audio event wiring ──────────────────────────────────────────────────

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onDurationChange = () => setDuration(audio.duration)
    const onEnded = () => handleNext()

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('durationchange', onDurationChange)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('durationchange', onDurationChange)
      audio.removeEventListener('ended', onEnded)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex])

  // Re-load audio when track changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return
    audio.load()
    setCurrentTime(0)
    setDuration(0)
    if (isPlaying) audio.play().catch(() => setIsPlaying(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex])

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (playerRef.current && !playerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  // Lift the floating player when the footer is onscreen so it does not block footer actions.
  useEffect(() => {
    const footerActions = document.getElementById('footer-actions')
    if (!footerActions) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry?.isIntersecting ?? false)
      },
      {
        threshold: 0.1,
      },
    )

    observer.observe(footerActions)

    return () => {
      observer.disconnect()
    }
  }, [])

  // ── Controls ────────────────────────────────────────────────────────────

  const handlePlayPause = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      try {
        await audio.play()
        setIsPlaying(true)
      } catch {
        setIsPlaying(false)
      }
    }
  }, [isPlaying])

  const handlePrev = useCallback(() => {
    if (currentTime > 3 && audioRef.current) {
      audioRef.current.currentTime = 0
      return
    }
    setCurrentIndex((i) => (i - 1 + tracks.length) % tracks.length)
  }, [currentTime, tracks.length])

  const handleNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % tracks.length)
  }, [tracks.length])

  const handleSeek = useCallback((value: number) => {
    if (audioRef.current) audioRef.current.currentTime = value
    setCurrentTime(value)
  }, [])

  const handleSelectTrack = useCallback(
    (index: number) => {
      if (index === currentIndex) {
        handlePlayPause()
      } else {
        setCurrentIndex(index)
        setIsPlaying(true)
      }
    },
    [currentIndex, handlePlayPause],
  )

  // ── Render ───────────────────────────────────────────────────────────────

  if (!tracks || tracks.length === 0) return null

  const currentAudio = isMedia(currentTrack?.audioFile) ? currentTrack.audioFile : null
  const currentCover = isMedia(currentTrack?.coverImage) ? currentTrack.coverImage : null
  const coverUrl = currentCover?.url

  return (
    <div
      ref={playerRef}
      className={`fixed right-6 z-50 flex flex-col items-end gap-3 transition-[bottom] duration-300 ${
        isFooterVisible ? 'bottom-16' : 'bottom-6'
      }`}
    >
      {/* Hidden native audio element */}
      <audio ref={audioRef} preload="metadata">
        {currentAudio?.url && (
          <source src={currentAudio.url} type={currentAudio.mimeType ?? undefined} />
        )}
      </audio>

      {/* ── Expanded Panel ── */}
      <div
        className={`
          w-80 rounded-2xl shadow-2xl overflow-hidden
          bg-white/95 backdrop-blur-md
          transition-all duration-500 ease-in-out origin-bottom-right
          ${
            isOpen
              ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
          }
        `}
        aria-hidden={!isOpen}
        role="dialog"
        aria-label="Music player"
      >
        {/* Now playing header */}
        <div className="relative h-28 bg-primary flex items-end p-4">
          {/* bg-linear-to-br from-rose-100 via-stone-100 to-purple-100 */}
          {coverUrl && (
            <img
              src={coverUrl}
              alt={currentTrack?.title}
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
          )}
          <div className="relative z-10">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground-light font-medium mb-0.5">
              Now playing
            </p>
            <p className="text-foreground-light font-semibold leading-tight truncate max-w-55">
              {currentTrack?.title ?? '—'}
            </p>
            {currentTrack?.artist && (
              <p className="text-muted-foreground-light text-xs mt-0.5">{currentTrack.artist}</p>
            )}
          </div>
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full text-muted-foreground-light hover:text-foreground-light hover:bg-accent/20 transition-colors"
            aria-label="Close player"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        {/* Controls */}
        <div className="px-4 pt-3 pb-2">
          <ProgressBar current={currentTime} duration={duration} onSeek={handleSeek} />
          <div className="flex justify-between text-[10px] text-stone-400 mt-1 mb-3">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="flex items-center justify-between">
            {/* Prev */}
            <button
              onClick={handlePrev}
              className="p-2 text-stone-400 hover:text-stone-700 transition-colors rounded-full hover:bg-stone-50"
              aria-label="Previous track"
            >
              <SkipBackIcon className="w-4 h-4" />
            </button>

            {/* Play / Pause */}
            <button
              onClick={handlePlayPause}
              className="w-10 h-10 rounded-full bg-[#697B76] hover:bg-[#44504c] text-white flex items-center justify-center transition-colors shadow-sm"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <PauseIcon className="w-4 h-4" />
              ) : (
                // <PlayIcon className="w-4 h-4 fill-white" />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>

            {/* Next */}
            <button
              onClick={handleNext}
              className="p-2 text-stone-400 hover:text-stone-700 transition-colors rounded-full hover:bg-stone-50"
              aria-label="Next track"
            >
              <SkipForwardIcon className="w-4 h-4" />
            </button>

            {/* Volume */}
            <button
              onClick={() => setIsMuted((m) => !m)}
              className="p-2 text-stone-400 hover:text-stone-700 transition-colors rounded-full hover:bg-stone-50"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeOffIcon className="w-4 h-4" /> : <VolumeIcon className="w-4 h-4" />}
            </button>
          </div>

          {/* Volume slider */}
          <div className="mt-2 flex items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-3 h-3 text-stone-300 shrink-0"
            >
              <path d="M3 9v6h4l5 5V4L7 9H3z" />
            </svg>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value))
                setIsMuted(false)
              }}
              className="w-full h-0.5 appearance-none bg-stone-200 rounded-full cursor-pointer accent-[#44504c]"
              aria-label="Volume"
            />
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-3 h-3 text-stone-400 shrink-0"
            >
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4-.91 7-4.49 7-8.77s-3-7.86-7-8.77z" />
            </svg>
          </div>
        </div>

        {/* Playlist */}
        <div className="border-t border-stone-100 max-h-52 overflow-y-auto">
          <p className="px-4 py-2 text-[10px] uppercase tracking-widest text-stone-400 font-medium">
            Playlist · {tracks.length} tracks
          </p>
          <ul role="list">
            {tracks.map((track, i) => {
              const isActive = i === currentIndex
              return (
                <li key={track.id}>
                  <button
                    onClick={() => handleSelectTrack(i)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2.5 text-left
                      transition-colors hover:bg-primary/20
                      ${isActive ? 'bg-primary/5' : ''}
                    `}
                    aria-current={isActive ? 'true' : undefined}
                    aria-label={`${isActive && isPlaying ? 'Pause' : 'Play'} ${track.title}`}
                  >
                    {/* Track number / wave */}
                    <span
                      className={`w-5 text-center shrink-0 ${isActive ? 'text-foreground' : 'text-stone-400'}`}
                    >
                      {isActive ? (
                        <WaveAnimation isPlaying={isPlaying} />
                      ) : (
                        <span className="text-xs">{i + 1}</span>
                      )}
                    </span>
                    {/* Cover thumbnail */}
                    {isMedia(track.coverImage) && track.coverImage.url ? (
                      <img
                        src={track.coverImage.url}
                        alt=""
                        className="w-8 h-8 rounded-md object-cover shrink-0"
                        aria-hidden="true"
                      />
                    ) : (
                      <span className="w-8 h-8 rounded-md bg-linear-to-br from-rose-100 to-purple-100 shrink-0" />
                    )}
                    {/* Info */}
                    <span className="flex-1 min-w-0">
                      <span
                        className={`block text-sm leading-tight truncate font-medium ${isActive ? 'text-stone-800' : 'text-stone-600'}`}
                      >
                        {track.title}
                      </span>
                      {track.artist && (
                        <span className="block text-[11px] text-stone-400 truncate">
                          {track.artist}
                        </span>
                      )}
                    </span>
                    {/* Category badge */}
                    {track.category && (
                      <span className="text-[10px] text-stone-400 shrink-0 capitalize">
                        {track.category}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* ── Floating Trigger Button ── */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className={`
          relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center
          bg-primary border border-primary text-white
          hover:scale-105 active:scale-95 transition-all duration-200
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
        `}
        aria-label={isOpen ? 'Close music player' : 'Open music player'}
        aria-expanded={isOpen}
      >
        {/* Pulsing ring when playing */}
        {isPlaying && (
          <span className="absolute inset-0 rounded-full animate-ping bg-rose-200 opacity-40" />
        )}

        {isPlaying && !isOpen ? (
          <WaveAnimation isPlaying={true} />
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
          </svg>
        )}
      </button>
    </div>
  )
}
