import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import PictureView from "../../../src/components/PictureView/PictureView.vue";
import { ref } from 'vue';

/* ---------- Mock-Store, diesmal mit echtem JSONPath ---------- */
function makeStore(data: any) {
  return {
    getProperty: vi.fn((p: string) =>
      p.replace(/^\$\./, '').split('.').reduce((acc, k) => acc?.[k], data)
    ),
    setProperty: vi.fn()
  };
}

describe('PictureView.vue', () => {
  const path = 'comp';

  it('rendert state.fieldValue, wenn keine dependency vorhanden', () => {
    const store = makeStore({
      comp: { state: { fieldValue: '/images/foo.webp' }, dependencies: {} }
    });

    const w = mount(PictureView, {
      props: { storeObject: ref(store), componentID: 1, componentPath: path }
    });

    expect(w.get('img').attributes('src')).toBe('/images/foo.webp');
  });

  it('priorisiert dependencies.src (Pfad) vor state.fieldValue', () => {
    const store = makeStore({
      imgPath: '/images/new.webp',                    // <-- hier liegt das Bild
      comp: {
        state: { fieldValue: '/images/old.png' },
        dependencies: { src: '$.imgPath' }            // JSONPath
      }
    });

    const w = mount(PictureView, {
      props: { storeObject: ref(store), componentID: 2, componentPath: path }
    });

    expect(w.get('img').attributes('src')).toBe('/images/new.webp');
  });
});
