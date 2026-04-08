import CalendarProvider from '@/components/Providers/CalendarProvider'
import CalendarCard from '@/components/Calendar/CalendarCard'
import BackgroundScene from '@/components/UI/BackgroundScene'

export default function Home() {
  return (
    <CalendarProvider>
      {/* Nature effect canvas — sits over the theme background, zero DOM cost */}
      <BackgroundScene />

      <main
        className="relative min-h-[100dvh] flex flex-col items-center justify-start sm:justify-center px-4 sm:px-12 pt-8 sm:pt-24 pb-32 sm:pb-24"
        style={{ zIndex: 1 }}
      >
        {/* Page header */}
        <header className="w-full max-w-[940px] mb-5 -mt-4 sm:-mt-16 md:-mt-20">
          <p
            className="text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] uppercase mb-1"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Interactive Component
          </p>
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{
              fontFamily: 'var(--font-playfair, "Playfair Display", serif)',
              color: 'var(--color-text-primary)',
            }}
          >
            Wall Calendar
          </h1>
        </header>

        {/* Calendar */}
        <CalendarCard />

        {/* Footer */}
        <footer
          className="mt-8 text-[11px] text-center no-print"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Click to select · Drag to select a range · Navigate months to see the seasons change
        </footer>
      </main>
    </CalendarProvider>
  )
}
