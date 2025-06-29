import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { LatexInputFieldComponent } from "../../../src";
import katex from 'katex';

// Mock Katex vollständig
vi.mock('katex', () => ({
  default: {
    renderToString: vi.fn(),
    __esModule: true
  }
}))

describe('LatexInputFieldComponent – Minimal Smoke', () => {
  it('validate() akzeptiert gültiges LaTeX & getSyntaxError() erkennt leeren String', () => {
    /* 1  Instanz ohne ctor anlegen */
    const cmp: any = Object.create(LatexInputFieldComponent.prototype)

    /* 2  storeObject stubben (wird in validate() benötigt) */
    cmp.storeObject = ref({
      setProperty: vi.fn()
    })

    /* 3  Pfade, die validate() verwendet */
    cmp.serialisedBaseComponentPath = '$.components.lit1'

    /* 4  Tests */
    expect(cmp.validate('\\frac{1}{2}').isValid).toBe(true)
    expect(cmp.getSyntaxError('')).toMatch(/Leerer Input/)
  })

  // Neuer Test: Ungültige LaTeX-Syntax
  it('erkennt ungültige LaTeX-Syntax', () => {
    const cmp: any = Object.create(LatexInputFieldComponent.prototype)
    cmp.storeObject = ref({ setProperty: vi.fn() })
    cmp.serialisedBaseComponentPath = '$.components.lit2'

    // Simuliere einen Syntaxfehler
    const error = new Error('Ungültige Syntax')
    vi.spyOn(katex, 'renderToString').mockImplementation(() => {
      throw error
    })

    // Korrektur: Überprüfe zuerst getSyntaxError
    expect(cmp.getSyntaxError('\\invalid{')).toBe('Ungültige Syntax')

    // Korrektur: isValid sollte false sein
    expect(cmp.validate('\\invalid{').isValid).toBe(false)
  })

  // Neuer Test: Korrekte Fehlerbehandlung
  it('behandelt unbekannte Fehler korrekt', () => {
    const cmp: any = Object.create(LatexInputFieldComponent.prototype)
    cmp.storeObject = ref({ setProperty: vi.fn() })
    cmp.serialisedBaseComponentPath = '$.components.lit3'

    // Simuliere einen nicht-Error Fehler
    vi.spyOn(katex, 'renderToString').mockImplementation(() => {
      throw 'Nicht-Error-Objekt'
    })

    expect(cmp.getSyntaxError('\\broken')).toBe('Unbekannter Fehler.')
  })
  it('behandelt undefinierte Werte als gültig', () => {
    const cmp: any = Object.create(LatexInputFieldComponent.prototype)
    cmp.storeObject = ref({ setProperty: vi.fn() })
    cmp.serialisedBaseComponentPath = '$.components.lit4'

    const result = cmp.validate(undefined)
    expect(result.isValid).toBe(false)
  })
  it('behandelt null-Werte als gültig', () => {
    const cmp: any = Object.create(LatexInputFieldComponent.prototype)
    cmp.storeObject = ref({ setProperty: vi.fn() })
    cmp.serialisedBaseComponentPath = '$.components.lit5'

    const result = cmp.validate(null)
    expect(result.isValid).toBe(false)
  })

})