import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { LatexInputFieldComponent } from "../../../src";

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
})