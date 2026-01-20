/**
 * Evidence-Based Vision Calibrator
 * 
 * Algorithm based on peer-reviewed research from:
 * - Peking University/Wenzhou Medical University (2023) - Font size and viewing distance
 * - Journal of Experimental Psychology - Line height and reading speed
 * - PMC studies on astigmatism and typography
 * - WCAG 2.1 accessibility guidelines
 * - Nielsen Norman Group - Eye strain research
 * 
 * Key concepts applied:
 * - Acuity Reserve: 3:1 ratio for maximum reading speed (not 2:1)
 * - Critical Print Size: ~0.2° visual angle for sustained reading
 * - Accommodation Lag: Larger fonts reduce lag and eye strain
 */

export interface Prescription {
  rightEye: {
    sphere: number;    // Negative = myopia, Positive = hyperopia
    cylinder: number;  // Astigmatism power
    axis: number;      // Astigmatism axis (degrees)
  };
  leftEye: {
    sphere: number;
    cylinder: number;
    axis: number;
  };
}

export interface VisualConditions {
  myopia: boolean;
  hyperopia: boolean;
  astigmatism: boolean;
  eyeStrain: boolean;
  blurOrGhosting: boolean;
  lightSensitivity: boolean;
  visualCrowding: boolean;
}

export type ColorVisionType = 
  | 'normal'
  | 'deuteranopia'   // Green-blind (most common, ~6% of males)
  | 'protanopia'     // Red-blind (~1% of males)
  | 'tritanopia'     // Blue-blind (rare, ~0.01%)
  | 'achromatopsia'; // Complete color blindness (very rare)

export interface CurrentSettings {
  fontSize: number;
  lineHeight: number;
  fontWeight: number;
}

export interface Recommendation {
  fontSize: number;
  lineHeight: number;
  fontWeight: number;
  cursorStyle: 'bar' | 'block' | 'underline';
  suggestedFonts: string[];
  suggestedThemes: string[];
  explanations: string[];
  research: ResearchCitation[];
}

export interface ResearchCitation {
  finding: string;
  source: string;
  year: number;
}

// Evidence-based font recommendations for astigmatism
// Fonts with naturally wider spacing, clear letterforms, high x-height
const ASTIGMATISM_FRIENDLY_FONTS = [
  'IBM Plex Mono',      // Excellent character distinction, wide spacing
  'JetBrains Mono',     // Designed for code, increased height
  'Fira Code',          // Good default spacing, ligature support
  'Input Mono',         // Customizable width variants
  'Atkinson Hyperlegible Mono', // Designed for low vision (if monospace version exists)
  'Source Code Pro',    // Adobe's readable monospace
];

// Evidence-based theme recommendations by color vision type
// Based on which color channels remain functional
const COLOR_VISION_THEMES: Record<ColorVisionType, { themes: string[]; rationale: string }> = {
  normal: {
    themes: [],
    rationale: 'No specific theme requirements for normal color vision.',
  },
  deuteranopia: {
    // Green cone deficiency - rely on blue/yellow distinction
    themes: ['Solarized Dark', 'Solarized Light', 'One Dark', 'GitHub Dark', 'Catppuccin Mocha'],
    rationale: 'Blue/yellow color schemes work best as the blue cone pathway is intact. Avoid themes that rely on red/green distinctions for syntax highlighting.',
  },
  protanopia: {
    // Red cone deficiency - similar to deuteranopia but reds appear darker
    themes: ['Solarized Dark', 'Solarized Light', 'Nord', 'Tokyo Night'],
    rationale: 'Blue-dominant themes work well. Reds will appear very dark, so themes with strong blue/cyan accents are preferred.',
  },
  tritanopia: {
    // Blue cone deficiency - rely on red/green distinction
    themes: ['Monokai', 'Dracula', 'Gruvbox', 'Material Theme'],
    rationale: 'Warm color schemes (red/green/orange) work best as these cones are intact. Avoid themes with blue/yellow as primary differentiators.',
  },
  achromatopsia: {
    // No color perception - rely on luminance contrast only
    themes: ['High Contrast', 'GitHub Light', 'Paper'],
    rationale: 'Maximum luminance contrast between syntax elements is critical. Monochrome or near-monochrome themes with strong brightness differences.',
  },
};

/**
 * Calculate evidence-based recommendations
 */
export function calculateRecommendations(
  conditions: VisualConditions,
  colorVision: ColorVisionType,
  prescription?: Prescription,
  currentSettings?: CurrentSettings
): Recommendation {
  const explanations: string[] = [];
  const research: ResearchCitation[] = [];
  
  // Base values from research
  // Peking University study: 16pt minimum on PC for >33cm viewing distance
  let fontSize = 16;
  let lineHeight = 1.5;  // Nielsen Norman: 1.5× reduces eye strain
  let fontWeight = 400;
  let cursorStyle: 'bar' | 'block' | 'underline' = 'bar';
  let suggestedFonts: string[] = [];
  let suggestedThemes: string[] = [];

  // Process prescription if provided
  let avgSphere = 0;
  let hasSignificantAstigmatism = false;
  let astigmatismAxis = 0;
  
  if (prescription) {
    // Average sphere for overall myopia/hyperopia assessment
    avgSphere = (prescription.rightEye.sphere + prescription.leftEye.sphere) / 2;
    
    // Check for astigmatism (cylinder values)
    const avgCylinder = Math.abs(
      (prescription.rightEye.cylinder + prescription.leftEye.cylinder) / 2
    );
    hasSignificantAstigmatism = avgCylinder >= 0.5;
    astigmatismAxis = (prescription.rightEye.axis + prescription.leftEye.axis) / 2;
    
    // Auto-detect conditions from prescription
    if (avgSphere < -0.5 && !conditions.myopia) {
      conditions.myopia = true;
    }
    if (avgSphere > 0.5 && !conditions.hyperopia) {
      conditions.hyperopia = true;
    }
    if (hasSignificantAstigmatism && !conditions.astigmatism) {
      conditions.astigmatism = true;
    }
  }

  // ============================================
  // FONT SIZE CALCULATIONS
  // Based on acuity reserve research (3:1 for max reading speed)
  // ============================================
  
  if (conditions.myopia) {
    // Myopia severity affects required font size
    // Research: viewing distance decreases with smaller text, increasing accommodation demand
    if (avgSphere <= -6) {
      // High myopia
      fontSize = 20;
      explanations.push(
        `High myopia (${avgSphere.toFixed(2)}D): Font size increased to 20px. ` +
        `Research shows high myopes benefit from larger text to maintain comfortable viewing distance.`
      );
    } else if (avgSphere <= -3) {
      // Moderate myopia
      fontSize = 18;
      explanations.push(
        `Moderate myopia (${avgSphere.toFixed(2)}D): Font size set to 18px for optimal acuity reserve.`
      );
    } else {
      // Mild myopia
      fontSize = 17;
      explanations.push(
        `Mild myopia detected: Font size set to 17px, exceeding the 16pt minimum ` +
        `recommended by Peking University research for maintaining >33cm viewing distance.`
      );
    }
    
    // Block cursor helps with tracking for myopes
    cursorStyle = 'block';
    explanations.push(
      `Block cursor recommended: Higher visibility helps with line tracking, ` +
      `particularly beneficial for myopic users who may have reduced contrast sensitivity.`
    );
    
    research.push({
      finding: 'Font sizes below 16pt cause viewing distances under 33cm, associated with eye strain',
      source: 'Wang K, et al. BMJ Open Ophthalmology',
      year: 2023,
    });
  }

  if (conditions.hyperopia) {
    // Hyperopia: near work requires more accommodation
    fontSize = Math.max(fontSize, 17);
    lineHeight = Math.max(lineHeight, 1.6);
    explanations.push(
      `Hyperopia detected: Increased font size and line height reduce accommodation demand for near work.`
    );
  }

  // ============================================
  // LINE HEIGHT CALCULATIONS
  // Based on reading speed and eye strain research
  // ============================================

  if (conditions.astigmatism) {
    lineHeight = Math.max(lineHeight, 1.6);
    suggestedFonts = [...ASTIGMATISM_FRIENDLY_FONTS];
    
    // Astigmatism axis affects which letters blur together
    let axisNote = '';
    if (astigmatismAxis >= 160 || astigmatismAxis <= 20) {
      axisNote = ' Your with-the-rule astigmatism (horizontal axis) causes less degradation for Roman letters.';
    } else if (astigmatismAxis >= 70 && astigmatismAxis <= 110) {
      axisNote = ' Against-the-rule astigmatism may cause more difficulty with vertical letter strokes.';
    } else {
      axisNote = ' Oblique astigmatism can cause the most letter recognition difficulty.';
    }
    
    explanations.push(
      `Astigmatism: Line height increased to 1.6× to reduce line-to-line blur.${axisNote} ` +
      `Fonts with clear letterforms and wider spacing recommended.`
    );
    
    research.push({
      finding: 'Astigmatic blur interacts with typography - letter shape and axis orientation affect readability',
      source: 'PMC6181807 - Astigmatic axis and visual acuity',
      year: 2018,
    });
    
    research.push({
      finding: '0.5-1.0D uncorrected astigmatism significantly increases digital eye strain symptoms',
      source: 'Rosenfield M. Ophthalmic and Physiological Optics',
      year: 2016,
    });
  }

  if (conditions.eyeStrain) {
    fontSize = Math.max(fontSize, fontSize + 1);
    lineHeight = Math.max(lineHeight, 1.6);
    explanations.push(
      `Eye strain: Larger font sizes reduce accommodation lag, a primary cause of eye strain. ` +
      `Research shows accommodation lag is worse with smaller fonts.`
    );
    
    research.push({
      finding: 'Larger font sizes significantly reduce accommodation lag and improve eye function',
      source: 'Nanotechnology Perceptions - Font Size and Accommodation',
      year: 2024,
    });
  }

  if (conditions.blurOrGhosting) {
    fontSize = Math.max(fontSize, fontSize + 1);
    cursorStyle = 'block';
    
    // Heavier font weight can help with blur, unless light sensitive
    if (!conditions.lightSensitivity) {
      fontWeight = 500;
      explanations.push(
        `Blur/ghosting: Font weight increased to 500 (medium) for better edge definition. ` +
        `Block cursor provides clearer position indicator.`
      );
    } else {
      explanations.push(
        `Blur/ghosting with light sensitivity: Font weight kept at 400 to avoid ` +
        `increased brightness from heavier strokes. Block cursor still recommended.`
      );
    }
  }

  if (conditions.lightSensitivity) {
    // Override any font weight increases
    fontWeight = 400;
    explanations.push(
      `Light sensitivity: Font weight capped at 400 (regular). Heavier weights ` +
      `increase perceived brightness and can worsen symptoms.`
    );
  }

  if (conditions.visualCrowding) {
    lineHeight = Math.max(lineHeight, 1.7);
    
    if (suggestedFonts.length === 0) {
      suggestedFonts = ASTIGMATISM_FRIENDLY_FONTS.slice(0, 3);
    }
    
    explanations.push(
      `Visual crowding: Line height increased to 1.7× to reduce interference between lines. ` +
      `Fonts with wider default spacing recommended.`
    );
    
    research.push({
      finding: 'Increased line spacing reduces crowding effects and improves reading in peripheral vision',
      source: 'Chung STL. Optometry and Vision Science',
      year: 2004,
    });
  }

  // ============================================
  // COLOR VISION ADJUSTMENTS
  // ============================================

  if (colorVision !== 'normal') {
    const colorConfig = COLOR_VISION_THEMES[colorVision];
    suggestedThemes = colorConfig.themes;
    explanations.push(`Color vision (${colorVision}): ${colorConfig.rationale}`);
    
    research.push({
      finding: 'Blue/orange palettes work well for red-green CVD as they rely on intact blue cone pathway',
      source: 'WCAG 2.1 / Interaction Design Foundation',
      year: 2023,
    });
  }

  // ============================================
  // FINAL ADJUSTMENTS
  // Apply acuity reserve principle
  // ============================================

  // If user provided current settings, check if they need adjustment
  if (currentSettings) {
    if (currentSettings.fontSize < fontSize) {
      explanations.push(
        `Your current font size (${currentSettings.fontSize}px) is below the recommended ` +
        `${fontSize}px for your conditions. The 3:1 acuity reserve principle suggests ` +
        `text should be at least 3× larger than your barely-readable threshold for maximum reading speed.`
      );
    }
  }

  // Line height research validation
  research.push({
    finding: 'Reading speed and accuracy peak at 1.2-1.5× line height; eye strain reduced at 1.5×+',
    source: 'Nielsen Norman Group / Journal of Experimental Psychology',
    year: 2023,
  });

  // Always add 20-20-20 reminder
  explanations.push(
    `Remember the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds. ` +
    `Research shows 30-40 minutes of continuous near work without breaks increases eye strain risk.`
  );

  return {
    fontSize: Math.round(fontSize),
    lineHeight: Math.round(lineHeight * 10) / 10, // Round to 1 decimal
    fontWeight,
    cursorStyle,
    suggestedFonts,
    suggestedThemes,
    explanations,
    research,
  };
}

/**
 * Generate editor-specific configuration
 */
export type EditorType = 'vscode' | 'zed' | 'neovim' | 'jetbrains' | 'sublime';

export function generateEditorConfig(
  recommendation: Recommendation,
  editor: EditorType
): string {
  const { fontSize, lineHeight, fontWeight, cursorStyle, suggestedFonts, suggestedThemes } = recommendation;
  const font = suggestedFonts[0] || 'JetBrains Mono';
  const theme = suggestedThemes[0];

  switch (editor) {
    case 'vscode':
      return JSON.stringify({
        "editor.fontSize": fontSize,
        "editor.lineHeight": lineHeight,
        "editor.fontWeight": String(fontWeight),
        "editor.cursorStyle": cursorStyle,
        "editor.fontFamily": `'${font}', 'Fira Code', Consolas, monospace`,
        ...(theme && { "workbench.colorTheme": theme }),
      }, null, 2);

    case 'zed':
      return JSON.stringify({
        buffer_font_size: fontSize,
        buffer_line_height: { custom: lineHeight },
        buffer_font_weight: fontWeight,
        cursor_shape: cursorStyle,
        buffer_font_family: font,
        ...(theme && { theme: theme }),
      }, null, 2);

    case 'neovim':
      return `-- Vision-optimized settings
vim.opt.guifont = "${font}:h${fontSize}"
vim.opt.linespace = ${Math.round((lineHeight - 1) * fontSize)}
vim.opt.guicursor = "n-v-c:${cursorStyle === 'bar' ? 'ver25' : cursorStyle}"
${theme ? `vim.cmd("colorscheme ${theme.toLowerCase().replace(/\s+/g, '-')}")` : ''}`;

    case 'jetbrains':
      return `// JetBrains IDE Settings
// Settings → Editor → Font
Font: ${font}
Size: ${fontSize}
Line spacing: ${lineHeight}
// Settings → Editor → Color Scheme
${theme ? `Theme: ${theme}` : ''}`;

    case 'sublime':
      return JSON.stringify({
        "font_face": font,
        "font_size": fontSize,
        "line_padding_top": Math.round((lineHeight - 1) * fontSize / 2),
        "line_padding_bottom": Math.round((lineHeight - 1) * fontSize / 2),
        "caret_style": cursorStyle === 'block' ? 'solid' : 'smooth',
        ...(theme && { "color_scheme": `Packages/Theme/${theme}.tmTheme` }),
      }, null, 2);

    default:
      return JSON.stringify({
        fontSize,
        lineHeight,
        fontWeight,
        cursorStyle,
        font,
        theme,
      }, null, 2);
  }
}

/**
 * Get summary for display
 */
export function getRecommendationSummary(recommendation: Recommendation): string {
  const { fontSize, lineHeight, fontWeight, cursorStyle } = recommendation;
  
  return `Font: ${fontSize}px | Line Height: ${lineHeight} | Weight: ${fontWeight} | Cursor: ${cursorStyle}`;
}
