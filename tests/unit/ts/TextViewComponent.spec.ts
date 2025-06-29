// tests/unit/ts/TextViewComponent.smoke.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { TextViewComponent } from "../../../src";

describe('TextViewComponent – Minimal Smoke', () => {
  it('markiert leeren Text als ungültig', () => {
    /* 1 ─ Dummy-Store: besitzt nur setProperty (wird im Code aufgerufen) */
    const store = ref<any>({ setProperty: vi.fn() })

    /* 2 ─ Instanz OHNE ctor-Args erzeugen … */
    //    die Basisklasse erwartet eigentlich 3 Argumente,
    //    deshalb unterdrücken wir den TypeScript-Check:

    const cmp: any = new TextViewComponent()

    /* 3 ─ … und danach den Store manuell injizieren */
    cmp.storeObject = store

    /* 4 ─ Testausführung */
    const { isValid } = cmp.validate('')
    expect(isValid).toBe(false)
  })
})
