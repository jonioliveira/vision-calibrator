'use client'

import { useState, useMemo } from 'react'
import {
  Eye,
  Sun,
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  Lightbulb,
  Palette,
  BookOpen,
} from 'lucide-react'
import {
  VisualConditions,
  ColorVisionType,
  Prescription,
  CurrentSettings,
  ConditionInfo,
  ColorVisionInfo,
  EditorType,
} from '@/lib/types'
import {
  calculateRecommendations,
  generateEditorConfig,
} from '@/lib/calculator'

const CONDITIONS: ConditionInfo[] = [
  {
    key: 'myopia',
    label: 'Myopia',
    description: 'Nearsightedness - difficulty seeing distant objects',
    icon: '👓',
  },
  {
    key: 'hyperopia',
    label: 'Hyperopia',
    description: 'Farsightedness - difficulty focusing on close objects',
    icon: '🔍',
  },
  {
    key: 'astigmatism',
    label: 'Astigmatism',
    description: 'Blurred vision due to irregular cornea shape',
    icon: '〰️',
  },
  {
    key: 'eyeStrain',
    label: 'Eye Strain',
    description: 'Fatigue after long screen sessions',
    icon: '😫',
  },
  {
    key: 'blurOrGhosting',
    label: 'Blur / Ghosting',
    description: 'Double images or halo effects',
    icon: '👻',
  },
  {
    key: 'lightSensitivity',
    label: 'Light Sensitivity',
    description: 'Discomfort from bright screens',
    icon: '☀️',
  },
  {
    key: 'visualCrowding',
    label: 'Visual Crowding',
    description: 'Dense text feels overwhelming',
    icon: '📝',
  },
]

const COLOR_VISION_OPTIONS: ColorVisionInfo[] = [
  { type: 'normal', label: 'Normal Color Vision', description: '' },
  {
    type: 'deuteranopia',
    label: 'Deuteranopia',
    description: 'Green-blind (most common)',
  },
  { type: 'protanopia', label: 'Protanopia', description: 'Red-blind' },
  { type: 'tritanopia', label: 'Tritanopia', description: 'Blue-blind (rare)' },
  {
    type: 'achromatopsia',
    label: 'Achromatopsia',
    description: 'Complete color blindness',
  },
]

const EDITOR_OPTIONS: { type: EditorType; label: string }[] = [
  { type: 'vscode', label: 'VS Code' },
  { type: 'zed', label: 'Zed' },
  { type: 'neovim', label: 'Neovim' },
  { type: 'jetbrains', label: 'JetBrains' },
  { type: 'sublime', label: 'Sublime Text' },
]

export default function Calibrator() {
  const [conditions, setConditions] = useState<VisualConditions>({
    myopia: false,
    hyperopia: false,
    astigmatism: false,
    eyeStrain: false,
    blurOrGhosting: false,
    lightSensitivity: false,
    visualCrowding: false,
  })

  const [colorVision, setColorVision] = useState<ColorVisionType>('normal')
  const [selectedEditor, setSelectedEditor] = useState<EditorType>('vscode')

  const [prescription, setPrescription] = useState({
    rightSphere: '',
    rightCylinder: '',
    rightAxis: '',
    leftSphere: '',
    leftCylinder: '',
    leftAxis: '',
  })

  const [currentSettings, setCurrentSettings] = useState<CurrentSettings>({
    fontSize: 14,
    lineHeight: 1.5,
    fontWeight: 400,
  })

  const [showResults, setShowResults] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showColorVisionDropdown, setShowColorVisionDropdown] = useState(false)
  const [showEditorDropdown, setShowEditorDropdown] = useState(false)

  const toggleCondition = (key: keyof VisualConditions) => {
    setConditions((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // Convert flat prescription to nested format for calculator
  const parsedPrescription: Prescription | undefined = useMemo(() => {
    const rs = parseFloat(prescription.rightSphere)
    const rc = parseFloat(prescription.rightCylinder)
    const ra = parseFloat(prescription.rightAxis)
    const ls = parseFloat(prescription.leftSphere)
    const lc = parseFloat(prescription.leftCylinder)
    const la = parseFloat(prescription.leftAxis)

    if (isNaN(rs) && isNaN(ls)) return undefined

    return {
      rightEye: {
        sphere: rs || 0,
        cylinder: rc || 0,
        axis: ra || 0,
      },
      leftEye: {
        sphere: ls || 0,
        cylinder: lc || 0,
        axis: la || 0,
      },
    }
  }, [prescription])

  const recommendations = useMemo(() => {
    return calculateRecommendations(
      conditions,
      colorVision,
      parsedPrescription,
      currentSettings
    )
  }, [conditions, colorVision, parsedPrescription, currentSettings])

  const configString = useMemo(() => {
    return generateEditorConfig(recommendations, selectedEditor)
  }, [recommendations, selectedEditor])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(configString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGenerate = () => {
    // Auto-detect conditions from prescription
    const rightSph = parseFloat(prescription.rightSphere) || 0
    const leftSph = parseFloat(prescription.leftSphere) || 0
    const avgSphere = (rightSph + leftSph) / 2
    const rightAxis = parseFloat(prescription.rightAxis) || 0
    const leftAxis = parseFloat(prescription.leftAxis) || 0
    const rightCyl = parseFloat(prescription.rightCylinder) || 0
    const leftCyl = parseFloat(prescription.leftCylinder) || 0

    const newConditions = { ...conditions }

    if (avgSphere < -0.5 && !conditions.myopia) {
      newConditions.myopia = true
    }
    if (avgSphere > 0.5 && !conditions.hyperopia) {
      newConditions.hyperopia = true
    }
    if (
      (rightAxis > 0 || leftAxis > 0 || rightCyl !== 0 || leftCyl !== 0) &&
      !conditions.astigmatism
    ) {
      newConditions.astigmatism = true
    }

    setConditions(newConditions)
    setShowResults(true)
  }

  return (
    <div className="space-y-6">
      {/* Visual Conditions */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Eye className="h-5 w-5 text-blue-400" />
          <h2 className="font-medium text-zinc-100">Visual Conditions</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CONDITIONS.map((condition) => (
            <button
              key={condition.key}
              onClick={() => toggleCondition(condition.key)}
              className={`flex flex-col items-start rounded-lg border p-4 text-left transition-all ${
                conditions[condition.key]
                  ? 'border-blue-500/50 bg-blue-500/10'
                  : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
              }`}
            >
              <div className="mb-1 flex items-center gap-2">
                <span>{condition.icon}</span>
                <span className="font-medium text-zinc-100">
                  {condition.label}
                </span>
              </div>
              <span className="text-xs text-zinc-500">
                {condition.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Color Vision */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Palette className="h-5 w-5 text-purple-400" />
          <h2 className="font-medium text-zinc-100">Color Vision</h2>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowColorVisionDropdown(!showColorVisionDropdown)}
            className="flex w-full items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-left hover:border-zinc-700"
          >
            <div>
              <span className="text-zinc-100">
                {COLOR_VISION_OPTIONS.find((o) => o.type === colorVision)?.label || 'Select...'}
              </span>
              {colorVision !== 'normal' && (
                <span className="ml-2 text-sm text-zinc-500">
                  {COLOR_VISION_OPTIONS.find((o) => o.type === colorVision)?.description}
                </span>
              )}
            </div>
            <ChevronDown
              className={`h-5 w-5 text-zinc-500 transition-transform ${
                showColorVisionDropdown ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showColorVisionDropdown && (
            <div className="absolute z-10 mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 shadow-xl">
              {COLOR_VISION_OPTIONS.map((option) => (
                <button
                  key={option.type}
                  onClick={() => {
                    setColorVision(option.type)
                    setShowColorVisionDropdown(false)
                  }}
                  className={`flex w-full items-center justify-between px-4 py-2 text-left hover:bg-zinc-800 ${
                    colorVision === option.type ? 'bg-zinc-800' : ''
                  }`}
                >
                  <span className="text-zinc-100">{option.label}</span>
                  {option.description && (
                    <span className="text-sm text-zinc-500">
                      {option.description}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Prescription */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400" />
          <h2 className="font-medium text-zinc-100">
            Prescription{' '}
            <span className="text-sm font-normal text-zinc-500">(optional)</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Right Eye */}
          <div>
            <div className="mb-2 text-sm text-zinc-400">
              Right Eye (OD)
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Sphere</label>
                <input
                  type="text"
                  placeholder="-2.00"
                  value={prescription.rightSphere}
                  onChange={(e) =>
                    setPrescription((p) => ({ ...p, rightSphere: e.target.value }))
                  }
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Cylinder</label>
                <input
                  type="text"
                  placeholder="-0.50"
                  value={prescription.rightCylinder}
                  onChange={(e) =>
                    setPrescription((p) => ({ ...p, rightCylinder: e.target.value }))
                  }
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Axis</label>
                <input
                  type="text"
                  placeholder="120"
                  value={prescription.rightAxis}
                  onChange={(e) =>
                    setPrescription((p) => ({ ...p, rightAxis: e.target.value }))
                  }
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Left Eye */}
          <div>
            <div className="mb-2 text-sm text-zinc-400">
              Left Eye (OS)
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Sphere</label>
                <input
                  type="text"
                  placeholder="-2.25"
                  value={prescription.leftSphere}
                  onChange={(e) =>
                    setPrescription((p) => ({ ...p, leftSphere: e.target.value }))
                  }
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Cylinder</label>
                <input
                  type="text"
                  placeholder="-0.75"
                  value={prescription.leftCylinder}
                  onChange={(e) =>
                    setPrescription((p) => ({ ...p, leftCylinder: e.target.value }))
                  }
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Axis</label>
                <input
                  type="text"
                  placeholder="70"
                  value={prescription.leftAxis}
                  onChange={(e) =>
                    setPrescription((p) => ({ ...p, leftAxis: e.target.value }))
                  }
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Settings */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Sun className="h-5 w-5 text-green-400" />
          <h2 className="font-medium text-zinc-100">
            Current Settings{' '}
            <span className="text-sm font-normal text-zinc-500">(baseline)</span>
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-4 sm:max-w-md">
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Font Size</label>
            <input
              type="number"
              value={currentSettings.fontSize}
              onChange={(e) =>
                setCurrentSettings((s) => ({
                  ...s,
                  fontSize: parseInt(e.target.value) || 14,
                }))
              }
              min={10}
              max={32}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Line Height</label>
            <input
              type="number"
              value={currentSettings.lineHeight}
              onChange={(e) =>
                setCurrentSettings((s) => ({
                  ...s,
                  lineHeight: parseFloat(e.target.value) || 1.5,
                }))
              }
              min={1}
              max={3}
              step={0.1}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Font Weight</label>
            <input
              type="number"
              value={currentSettings.fontWeight}
              onChange={(e) =>
                setCurrentSettings((s) => ({
                  ...s,
                  fontWeight: parseInt(e.target.value) || 400,
                }))
              }
              min={300}
              max={700}
              step={100}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Editor Selection */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xl">⌨️</span>
          <h2 className="font-medium text-zinc-100">Target Editor</h2>
        </div>

        <div className="relative sm:max-w-xs">
          <button
            onClick={() => setShowEditorDropdown(!showEditorDropdown)}
            className="flex w-full items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-left hover:border-zinc-700"
          >
            <span className="text-zinc-100">
              {EDITOR_OPTIONS.find((o) => o.type === selectedEditor)?.label}
            </span>
            <ChevronDown
              className={`h-5 w-5 text-zinc-500 transition-transform ${
                showEditorDropdown ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showEditorDropdown && (
            <div className="absolute z-10 mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 shadow-xl">
              {EDITOR_OPTIONS.map((option) => (
                <button
                  key={option.type}
                  onClick={() => {
                    setSelectedEditor(option.type)
                    setShowEditorDropdown(false)
                  }}
                  className={`flex w-full px-4 py-2 text-left hover:bg-zinc-800 ${
                    selectedEditor === option.type ? 'bg-zinc-800' : ''
                  }`}
                >
                  <span className="text-zinc-100">{option.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-500 hover:to-blue-400 hover:shadow-blue-500/40"
      >
        Generate Recommendations
      </button>

      {/* Results */}
      {showResults && (
        <div className="animate-fade-in space-y-6">
          {/* Recommendation Cards */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="mb-4 font-medium text-zinc-100">
              Recommended Settings
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-zinc-800/50 p-4 text-center">
                <div className="text-xs text-zinc-500">Font Size</div>
                <div className="mt-1 font-mono text-2xl font-semibold text-blue-400">
                  {recommendations.fontSize}
                  <span className="text-sm text-zinc-500">px</span>
                </div>
              </div>
              <div className="rounded-lg bg-zinc-800/50 p-4 text-center">
                <div className="text-xs text-zinc-500">Line Height</div>
                <div className="mt-1 font-mono text-2xl font-semibold text-blue-400">
                  {recommendations.lineHeight}
                </div>
              </div>
              <div className="rounded-lg bg-zinc-800/50 p-4 text-center">
                <div className="text-xs text-zinc-500">Font Weight</div>
                <div className="mt-1 font-mono text-2xl font-semibold text-blue-400">
                  {recommendations.fontWeight}
                </div>
              </div>
              <div className="rounded-lg bg-zinc-800/50 p-4 text-center">
                <div className="text-xs text-zinc-500">Cursor Style</div>
                <div className="mt-1 font-mono text-2xl font-semibold text-blue-400">
                  {recommendations.cursorStyle}
                </div>
              </div>
            </div>
          </div>

          {/* Code Block */}
          <div className="code-block">
            <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-4 py-3">
              <span className="text-sm text-zinc-500">
                {selectedEditor === 'vscode' && 'settings.json'}
                {selectedEditor === 'zed' && '~/.config/zed/settings.json'}
                {selectedEditor === 'neovim' && 'init.lua'}
                {selectedEditor === 'jetbrains' && 'IDE Settings'}
                {selectedEditor === 'sublime' && 'Preferences.sublime-settings'}
              </span>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-all ${
                  copied
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed">
              <code dangerouslySetInnerHTML={{ __html: formatCodeHtml(configString) }} />
            </pre>
          </div>

          {/* Font Recommendations */}
          {recommendations.suggestedFonts.length > 0 && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6">
              <div className="mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-400" />
                <h3 className="font-medium text-amber-200">
                  Recommended Fonts
                </h3>
              </div>
              <p className="mb-3 text-sm text-zinc-400">
                These fonts have naturally wider character spacing and clear letterforms,
                which research shows helps with astigmatism and visual crowding:
              </p>
              <ul className="space-y-1">
                {recommendations.suggestedFonts.map((font, i) => (
                  <li key={i} className="text-sm text-zinc-300">
                    • {font}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Theme Recommendations */}
          {recommendations.suggestedThemes.length > 0 && (
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-6">
              <div className="mb-3 flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-400" />
                <h3 className="font-medium text-purple-200">
                  Recommended Themes
                </h3>
              </div>
              <p className="mb-3 text-sm text-zinc-400">
                Based on your color vision, these themes provide better contrast:
              </p>
              <div className="flex flex-wrap gap-2">
                {recommendations.suggestedThemes.map((theme, i) => (
                  <span
                    key={i}
                    className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-200"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Research Citations */}
          {recommendations.research.length > 0 && (
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-6">
              <div className="mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-400" />
                <h3 className="font-medium text-blue-200">
                  Research Behind These Recommendations
                </h3>
              </div>
              <ul className="space-y-3">
                {recommendations.research.map((citation, i) => (
                  <li key={i} className="text-sm">
                    <div className="text-zinc-300">{citation.finding}</div>
                    <div className="mt-1 text-xs text-zinc-500">
                      — {citation.source} ({citation.year})
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Explanations */}
          {recommendations.explanations.length > 0 && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <h3 className="mb-4 font-medium text-zinc-100">
                Why these settings?
              </h3>
              <ul className="space-y-3">
                {recommendations.explanations.map((explanation, i) => (
                  <li
                    key={i}
                    className="border-b border-zinc-800 pb-3 text-sm text-zinc-400 last:border-0 last:pb-0"
                  >
                    {explanation}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function formatCodeHtml(code: string): string {
  return code
    .replace(/\/\/.*/g, (match) => `<span class="code-comment">${match}</span>`)
    .replace(/(--.*)/g, '<span class="code-comment">$1</span>')
    .replace(
      /"([^"]+)":/g,
      '<span class="code-key">"$1"</span>:'
    )
    .replace(
      /: "([^"]+)"/g,
      ': <span class="code-string">"$1"</span>'
    )
    .replace(
      /: (\d+\.?\d*)/g,
      ': <span class="code-value">$1</span>'
    )
    .replace(
      /: ({[^}]+})/g,
      ': <span class="code-value">$1</span>'
    )
}
