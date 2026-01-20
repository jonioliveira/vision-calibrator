import Calibrator from '@/components/Calibrator'
import { Eye, Glasses, Monitor, BookOpen } from 'lucide-react'

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="mb-12 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
          <Eye className="h-4 w-4" />
          Evidence-Based Vision Science
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Vision Calibrator
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-zinc-400">
          Personalized editor settings based on peer-reviewed research. Whether you have
          myopia, astigmatism, or color vision deficiency, get recommendations
          backed by actual vision science — not guesswork.
        </p>
      </div>

      {/* Calibrator */}
      <Calibrator />

      {/* How it works */}
      <div className="mt-16 grid gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="mb-3 inline-flex rounded-lg bg-blue-500/10 p-3">
            <Eye className="h-6 w-6 text-blue-400" />
          </div>
          <h3 className="mb-2 font-semibold text-zinc-100">
            Select Conditions
          </h3>
          <p className="text-sm text-zinc-500">
            Choose your visual conditions and optionally enter your
            prescription for more accurate recommendations.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="mb-3 inline-flex rounded-lg bg-purple-500/10 p-3">
            <Monitor className="h-6 w-6 text-purple-400" />
          </div>
          <h3 className="mb-2 font-semibold text-zinc-100">
            Choose Your Editor
          </h3>
          <p className="text-sm text-zinc-500">
            Get config for VS Code, Zed, Neovim, JetBrains, or Sublime Text.
            Same research, different formats.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="mb-3 inline-flex rounded-lg bg-green-500/10 p-3">
            <BookOpen className="h-6 w-6 text-green-400" />
          </div>
          <h3 className="mb-2 font-semibold text-zinc-100">
            See The Research
          </h3>
          <p className="text-sm text-zinc-500">
            Every recommendation includes citations. Know exactly why
            each setting is suggested.
          </p>
        </div>
      </div>

      {/* Research Highlights */}
      <div className="mt-16">
        <h2 className="mb-6 text-center text-2xl font-bold">Key Research Findings</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="mb-2 text-3xl font-bold text-blue-400">16px+</div>
            <div className="text-sm text-zinc-400">
              Minimum font size for PC monitors to maintain &gt;33cm viewing distance
              <span className="mt-1 block text-xs text-zinc-600">
                Peking University / Wenzhou Medical University, 2023
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="mb-2 text-3xl font-bold text-blue-400">3:1</div>
            <div className="text-sm text-zinc-400">
              Acuity reserve ratio for maximum reading speed (text 3× your threshold)
              <span className="mt-1 block text-xs text-zinc-600">
                Vision science research on critical print size
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="mb-2 text-3xl font-bold text-blue-400">1.5×</div>
            <div className="text-sm text-zinc-400">
              Line height where reading speed peaks and eye strain reduces
              <span className="mt-1 block text-xs text-zinc-600">
                Nielsen Norman Group / Journal of Experimental Psychology
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="mb-2 text-3xl font-bold text-blue-400">0.5D</div>
            <div className="text-sm text-zinc-400">
              Even this small uncorrected astigmatism increases digital eye strain
              <span className="mt-1 block text-xs text-zinc-600">
                Multiple studies on computer vision syndrome
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Conditions Explained */}
      <div className="mt-16">
        <h2 className="mb-6 text-center text-2xl font-bold">
          Conditions Explained
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h3 className="mb-2 flex items-center gap-2 font-semibold">
              <Glasses className="h-5 w-5 text-blue-400" />
              Myopia & Hyperopia
            </h3>
            <p className="text-sm text-zinc-400">
              Refractive errors affect how your eyes focus. Myopia
              (nearsightedness) benefits from larger fonts and block cursors.
              Research shows smaller text causes closer viewing distances,
              increasing eye strain.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h3 className="mb-2 flex items-center gap-2 font-semibold">
              <span className="text-xl">〰️</span>
              Astigmatism
            </h3>
            <p className="text-sm text-zinc-400">
              Causes directional blur that makes similar letters hard to distinguish
              (c/e, r/n, 0/O). Research shows the blur effect depends on your
              axis orientation. Fonts with clear letterforms help more than
              adding letter spacing to monospace fonts.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h3 className="mb-2 flex items-center gap-2 font-semibold">
              <span className="text-xl">🎨</span>
              Color Vision Deficiency
            </h3>
            <p className="text-sm text-zinc-400">
              Affects ~8% of men. Red-green (deuteranopia/protanopia) is most
              common. The tool recommends themes that use your intact color
              channels — blue/yellow for red-green CVD, red/green for
              tritanopia.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h3 className="mb-2 flex items-center gap-2 font-semibold">
              <span className="text-xl">😫</span>
              Digital Eye Strain
            </h3>
            <p className="text-sm text-zinc-400">
              Larger fonts reduce accommodation lag — the delay between where
              your eye focuses and where it needs to focus. A 2024 study
              confirmed this is a primary cause of eye strain symptoms.
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-16 rounded-xl border border-amber-500/20 bg-amber-500/5 p-6 text-center">
        <p className="text-sm text-amber-200/80">
          <strong>Disclaimer:</strong> This tool provides comfort
          recommendations based on vision research, not medical advice. If you
          experience persistent eye strain or vision problems, please consult
          an optometrist or ophthalmologist.
        </p>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-zinc-800 pt-8 text-center text-sm text-zinc-500">
        <p>
          Inspired by{' '}
          <a
            href="https://github.com/AgusRdz/harmonia-vision"
            className="text-blue-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Harmonia Vision
          </a>{' '}
          by AgusRdz. Enhanced with peer-reviewed research.
        </p>
        <p className="mt-2">
          <a
            href="https://github.com/yourusername/vision-calibrator"
            className="text-zinc-400 hover:text-zinc-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </p>
      </footer>
    </main>
  )
}
