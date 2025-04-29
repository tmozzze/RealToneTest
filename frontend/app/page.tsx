import { Header } from "@/components/header"
import { UploadForm } from "@/components/upload-form"
import { InfoSection } from "@/components/info-section"
import { WaveBackground } from "@/components/wave-background"

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
        <UploadForm />
        <InfoSection />
      </div>
    </main>
  )
}
