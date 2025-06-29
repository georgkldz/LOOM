import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { reactive, ref, nextTick } from 'vue';
import PictureView from "../../src/components/PictureView/PictureView.vue";

/* -- voll reaktiver Store-Mock (reactive()!) -- */
function makeStore(seed: any) {
  const data = reactive(seed);
  return {
    getProperty: (p: string) =>
      p.replace(/^\$\./, '').split('.').reduce((a, k) => a?.[k], data),
    setProperty({ path, value }: { path: string; value: any }) {
      const ks = path.split('.'); const last = ks.pop()!;
      const tgt = ks.reduce((a, k) => (a[k] ??= {}), data);
      tgt[last] = value;
    }
  };
}

describe('PictureView – Integration Store ↔ Komponente', () => {
  it('re-rendert <img>, wenn sich der JSONPath-Wert ändert', async () => {
    const seed = {
      imgRef: '/images/initial.webp',
      comp  : {
        state: { fieldValue: '' },
        dependencies: { src: '$.imgRef' }
      }
    };
    const store = makeStore(seed);

    const w = mount(PictureView, {
      props: { storeObject: ref(store), componentID: 5, componentPath: 'comp' }
    });
    expect(w.get('img').attributes('src')).toBe('/images/initial.webp');

    /* ---- Bildpfad im Store ändern ---- */
    store.setProperty({ path: 'imgRef', value: '/images/live.webp' });
    await nextTick();

    expect(w.get('img').attributes('src')).toBe('/images/live.webp');
  });
});
