export interface VisualConditions {
  myopia: boolean
  hyperopia: boolean
  astigmatism: boolean
  eyeStrain: boolean
  blurOrGhosting: boolean
  lightSensitivity: boolean
  visualCrowding: boolean
}

export type ColorVisionType = 
  | 'normal'
  | 'deuteranopia'
  | 'protanopia'
  | 'tritanopia'
  | 'achromatopsia'

export interface Prescription {
  rightEye: {
    sphere: number
    cylinder: number
    axis: number
  }
  leftEye: {
    sphere: number
    cylinder: number
    axis: number
  }
}

export interface CurrentSettings {
  fontSize: number
  lineHeight: number
  fontWeight: number
}

export interface ResearchCitation {
  finding: string
  source: string
  year: number
}

export interface Recommendation {
  fontSize: number
  lineHeight: number
  fontWeight: number
  cursorStyle: 'bar' | 'block' | 'underline'
  suggestedFonts: string[]
  suggestedThemes: string[]
  explanations: string[]
  research: ResearchCitation[]
}

export type EditorType = 'vscode' | 'zed' | 'neovim' | 'jetbrains' | 'sublime'

export interface ConditionInfo {
  key: keyof VisualConditions
  label: string
  description: string
  icon: string
}

export interface ColorVisionInfo {
  type: ColorVisionType
  label: string
  description: string
}
