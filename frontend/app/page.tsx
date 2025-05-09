import { Header } from "@/components/header"
import { UploadForm } from "@/components/upload-form"
import { InfoSection } from "@/components/info-section"
import { WaveBackground } from "@/components/wave-background"

// This is a client component that will be hydrated on the client
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-white to-purple-50 relative overflow-hidden">
      <WaveBackground />
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col items-center justify-center z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4">
          Проверка подлинности аудио с помощью ИИ
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mb-8">
          RealTone использует передовые технологии искусственного интеллекта для определения вероятности того, что
          аудиофайл был сгенерирован с помощью ИИ.
        </p>

        {/* UploadForm now manages the state and passes data to child components */}
        <UploadForm />

        {/* Analysis Results Section - Will be managed by UploadForm */}
        <div id="analysis-results" className="w-full max-w-4xl mt-8 hidden">
          <div className="bg-white p-6 rounded-lg shadow-md border border-purple-100 mb-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Результаты анализа</h3>

            {/* Overall Analysis Summary - Will receive data from UploadForm */}
            <div id="analysis-summary-container"></div>

            {/* Suspicious Sections Player - Will be populated dynamically */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-700 mb-2">Прослушать подозрительные секции:</h4>
              <div id="suspicious-sections-container" className="space-y-3"></div>
            </div>
          </div>
        </div>

        <InfoSection />
      </div>
    </main>
  )
}
