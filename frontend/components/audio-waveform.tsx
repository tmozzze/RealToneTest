"use client"

import { useEffect, useRef, useState } from "react"
import WaveSurfer from "wavesurfer.js"

interface AudioWaveformProps {
  audioFile: File
}

export function AudioWaveform({ audioFile }: AudioWaveformProps) {
  const waveformRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<WaveSurfer | null>(null)
  const [duration, setDuration] = useState(0)
  const gridLinesRef = useRef<HTMLDivElement>(null)

  // Initialize WaveSurfer
  useEffect(() => {
    if (!waveformRef.current) return

    // Clean up previous instance
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy()
    }

    // Create new WaveSurfer instance
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#c4b5fd", // Light purple
      progressColor: "#6a50d3", // Darker purple
      cursorColor: "transparent", // Hide cursor since we're not playing
      height: 80,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      normalize: true,
      responsive: true,
      interact: false, // Disable user interaction
    })

    // Load audio file
    const audioUrl = URL.createObjectURL(audioFile)
    wavesurfer.load(audioUrl)

    // Get duration and create grid lines
    wavesurfer.on("ready", () => {
      const audioDuration = wavesurfer.getDuration()
      setDuration(audioDuration)
    })

    // Save reference
    wavesurferRef.current = wavesurfer

    // Cleanup
    return () => {
      URL.revokeObjectURL(audioUrl)
      wavesurfer.destroy()
    }
  }, [audioFile])

  // Create grid lines when duration changes
  useEffect(() => {
    if (duration <= 0 || !gridLinesRef.current) return

    // Clear previous grid lines
    gridLinesRef.current.innerHTML = ""

    // Calculate number of grid lines (every 4 seconds)
    const numberOfLines = Math.floor(duration / 4)

    // Create grid lines
    for (let i = 1; i <= numberOfLines; i++) {
      const position = ((i * 4) / duration) * 100

      const line = document.createElement("div")
      line.className = "absolute top-0 h-full w-[1px] bg-[#6a50d3] bg-opacity-20"
      line.style.left = `${position}%`

      gridLinesRef.current.appendChild(line)
    }
  }, [duration])

  return (
    <div className="w-full max-w-[95%] mx-auto bg-gray-50 p-4 rounded-lg border border-gray-100">
      {/* Waveform container with grid lines overlay */}
      <div className="relative w-full">
        <div ref={waveformRef} className="w-full rounded-md overflow-hidden" />
        <div ref={gridLinesRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />

        {/* Hover chunks overlay */}
        {duration > 0 && (
          <div className="absolute top-0 left-0 w-full h-full">
            {Array.from({ length: Math.ceil(duration / 4) }).map((_, index) => {
              // Generate random prediction data for each chunk
              const predictionValue = Math.floor(Math.random() * 100)
              const getConfidenceLevel = (value: number) => {
                if (value < 30) return "Вероятно подлинный"
                if (value < 70) return "Возможно ИИ"
                return "Вероятно ИИ"
              }

              return (
                <div
                  key={index}
                  className="absolute top-0 h-full group cursor-pointer z-10"
                  style={{
                    left: `${((index * 4) / duration) * 100}%`,
                    width: `${(4 / duration) * 100}%`,
                    maxWidth: "100%",
                  }}
                >
                  <div className="hidden group-hover:block absolute bottom-full mb-2 bg-white p-2 rounded shadow-lg z-20 text-sm">
                    <div className="font-medium">Секция {index + 1}</div>
                    <div
                      className={`${predictionValue < 30 ? "text-green-600" : predictionValue < 70 ? "text-yellow-600" : "text-red-600"}`}
                    >
                      {getConfidenceLevel(predictionValue)}: {predictionValue}%
                    </div>
                  </div>
                  <div className="w-full h-full opacity-0 hover:opacity-20 bg-[#6a50d3] transition-opacity"></div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
