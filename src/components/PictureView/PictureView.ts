// src/components/PictureView/PictureView.ts
import type {
  SerializedBaseComponent,
  SerialisedDependencies,
  ComponentDependencies,
  ComponentProps,
  ComponentState,
  ComponentTypeSpecification
} from "@/components/BaseComponent/BaseComponent";
import { BaseComponent } from "@/components/BaseComponent/BaseComponent";
import type { JSONPathExpression } from "@/stores/Store";
import { unref } from "vue";

/* ---------- Typen ---------- */

/**
 * The PictureViewProps interface is used to define the properties, that are passed from the parent component to the TextView component.
 */
export interface PictureViewProps extends ComponentProps {
  modelValue?: string;
}

export type PictureViewComponentType = "PictureView";

export interface SerializedPictureViewDependencies
  extends SerialisedDependencies {
  /** Relativer oder absoluter Pfad zum Bild (z. B. "/images/foo.webp") */
  src?: JSONPathExpression;
}

export interface PictureViewDependencies extends ComponentDependencies {
  src?: string;
}

export interface PictureViewState extends ComponentState {
  /** Fallback-Alt-Text für Barrierefreiheit */
  alt?: string;
  /** CSS object-fit Wert (cover, contain, …) */
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
  fieldValue: string | undefined;
}

/* Serialisierte Komponente */
export interface SerializedPictureViewComponent
  extends SerializedBaseComponent<PictureViewComponentType> {
  dependencies: SerializedPictureViewDependencies;
  state: PictureViewState;
}

/* Spezifikation */
export interface PictureViewSpecification extends ComponentTypeSpecification {
  SerializedComponent: SerializedPictureViewComponent;
  Dependencies: PictureViewDependencies;
}

/* ---------- Klasse ---------- */

export class PictureViewComponent extends BaseComponent<PictureViewSpecification> {
  /** Prüft, ob der Pfad vorhanden & nicht leer ist */
  public validate(src: string | undefined | null) {
    const isValid = !!src && src.trim() !== "";
    const isCorrect = true;
    unref(this.storeObject).setProperty({
      path: `${this.serialisedBaseComponentPath}.state.isValid`,
      value: isValid
    });
    unref(this.storeObject).setProperty({
      path: `${this.serialisedBaseComponentPath}.state.isCorrect`,
      value: isCorrect
    });
    return { isValid, isCorrect };
  }
}
