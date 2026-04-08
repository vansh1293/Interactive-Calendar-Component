import CalendarProvider from '@/components/Providers/CalendarProvider'
import CalendarCard from '@/components/Calendar/CalendarCard'
import BackgroundScene from '@/components/UI/BackgroundScene'

export default function Home() {
  return (
    <CalendarProvider>
      {/* Nature effect canvas — sits over the theme background, zero DOM cost */}
      <BackgroundScene />

      <main
        className="relative min-h-screen flex flex-col items-center justify-start py-10 px-4 sm:px-6"
        style={{ zIndex: 1 }}
      >
        {/* Page header */}
        <header className="w-full max-w-5xl mb-8">
          <p
            className="text-xs font-semibold tracking-[0.25em] uppercase mb-1"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Interactive Component
          </p>
          <h1
            className="text-3xl sm:text-4xl font-bold"
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
