import { describe, it, expect, vi } from 'vitest';
import { reactive, ref } from 'vue';
import { PictureViewComponent } from "../../../src/components/PictureView/PictureView";

/* ---------- superkleiner Store ---------- */
const store = {
  getProperty: vi.fn(),
  setProperty: vi.fn()
};

describe('PictureViewComponent (pure TS-Klasse)', () => {
  it('liefert korrekte Validierung & ruft setProperty auf', () => {
    const c = new PictureViewComponent();          // Konstruktor hat 0 args
    /*  --- Store & Pfad nachträglich injizieren  --- */
    (c as any).storeObject = ref(store);
    (c as any).serialisedBaseComponentPath = '$.comp';

    // ungültiger Pfad
    const r1 = (c as any).validate('');
    expect(r1.isValid).toBe(false);

    // gültiger Pfad
    const r2 = (c as any).validate('/images/x.webp');
    expect(r2.isValid).toBe(true);

    // Prüfen, ob setProperty mit true/false aufgerufen wurde
    expect(store.setProperty).toHaveBeenCalledWith(
      expect.objectContaining({ value: false })
    );
    expect(store.setProperty).toHaveBeenLastCalledWith(
      expect.objectContaining({ value: true })
    );
  });
});
