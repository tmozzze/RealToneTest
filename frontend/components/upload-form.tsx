"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ResultDisplay } from "@/components/result-display"
import { Upload, AlertCircle, Loader2, Music } from "lucide-react"
import { AudioWaveform } from "@/components/audio-waveform"

// Define the history item type
interface HistoryItem {
  id: string
  filename: string
  fileSize: string
  date: string
  probability: number
}

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showWaveform, setShowWaveform] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null

    // Validate that it's an audio file
    if (selectedFile && !selectedFile.type.startsWith("audio/")) {
      setError("Пожалуйста, загрузите аудиофайл")
      return
    }

    setFile(selectedFile)
    setResult(null)
    setError(null)
    setShowWaveform(false) // Reset waveform visibility when a new file is selected
  }

  const handleAnalyze = async () => {
    if (!file) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("audio", file)

      const response = await fetch("/api/check", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to analyze audio")
      }

      const data = await response.json()
      setResult(data.probability)
      setShowWaveform(true) // Show waveform after analysis is complete

      // Save to history
      saveToHistory(file, data.probability)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const saveToHistory = (audioFile: File, probability: number) => {
    try {
      // Create a new history item
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        filename: audioFile.name,
        fileSize: (audioFile.size / 1024 / 1024).toFixed(2) + " MB",
        date: new Date().toLocaleString(),
        probability: probability,
      }

      // Get existing history or initialize empty array
      const existingHistory = localStorage.getItem("audioCheckHistory")
      const history: HistoryItem[] = existingHistory ? JSON.parse(existingHistory) : []

      // Add new item to the beginning of the array
      history.unshift(newHistoryItem)

      // Limit history to 20 items
      const limitedHistory = history.slice(0, 20)

      // Save back to localStorage
      localStorage.setItem("audioCheckHistory", JSON.stringify(limitedHistory))
    } catch (error) {
      console.error("Error saving to history:", error)
    }
  }

  const handleRetry = () => {
    setFile(null)
    setResult(null)
    setError(null)
    setShowWaveform(false) // Hide waveform when retrying
  }

  return (
    <Card className="w-full max-w-4xl shadow-lg transition-all border-purple-100">
      <CardContent className="p-8">
        <div className="flex flex-col items-center space-y-6">
          {error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          {!file ? (
            <div className="w-full">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <Music className="w-8 h-8 text-[#6a50d3]" />
                </div>
              </div>
              <p className="text-center mb-4 text-gray-700 font-medium">Чтобы проверить аудиоконтент загрузите файл</p>
              <label
                htmlFor="audio-upload"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-purple-200 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-purple-50 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-[#6a50d3]" />
                  <p className="mb-2 text-sm font-medium text-[#6a50d3]">
                    <span className="font-semibold">Upload audio file</span>
                  </p>
                  <p className="text-xs text-gray-500">.mp3, .wav, etc.</p>
                </div>
                <input id="audio-upload" type="file" accept="audio/*" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
          ) : (
            <div className="w-full space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg flex items-center">
                <div className="w-10 h-10 bg-[#6a50d3] rounded-full flex items-center justify-center mr-3">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 truncate">
                  <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>

              {/* Audio Waveform - only show after analysis */}
              {showWaveform && <AudioWaveform audioFile={file} />}

              {result !== null ? (
                <ResultDisplay probability={result} />
              ) : (
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full bg-[#6a50d3] hover:bg-[#5f43cc] text-white py-6"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Check authenticity"
                  )}
                </Button>
              )}
            </div>
          )}

          {(error || result !== null) && (
            <Button variant="outline" onClick={handleRetry} className="mt-4">
              Upload another file
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
