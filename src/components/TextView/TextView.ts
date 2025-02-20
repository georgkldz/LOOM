import type {
  SerializedBaseComponent,
  SerialisedDependencies,
  ComponentDependencies,
  ComponentProps,
  ComponentTypeSpecification, ComponentState, ValidationConfiguration
} from "@/components/BaseComponent/BaseComponent";
import { BaseComponent } from "@/components/BaseComponent/BaseComponent";
import type { JSONPathExpression } from "@/stores/Store";
import { ref, unref } from "vue";
import type { QInputProps } from "quasar";


/**
 * The TextViewProps interface is used to define the properties, that are passed from the parent component to the TextView component.
 */
export interface TextViewProps extends ComponentProps {
  modelValue?: string;
}
/**
 * The type of the TextView component.
 */
export declare type TextViewComponentType = "TextView";

/**
 * The InputField-component may receive a path to a reference value for the initialization of the input field value.
 */
export interface SerializedTextViewDependencies
  extends SerialisedDependencies {
  referenceValue?: JSONPathExpression;
}

/**
 * The TextView-component may utilize a reference value for the initialization of the input field value.
 */
export interface TextViewDependencies extends ComponentDependencies {
  referenceValue?: string | undefined | null;
}

export interface TextViewFieldConfiguration extends Omit<QInputProps, "modelValue" | "inputStyle"> {
  placeholder?: string;
}

export interface TextSegment {
  text: string;
  bold?: boolean;
  italic?: boolean;
  cssClass?: string;
}

/**
 * The InputField-component may hold a static input field value in its componentData.
 */
export declare interface TextViewComponentState extends ComponentState {
  fieldConfiguration: TextViewFieldConfiguration;
  textSegments?: Array<TextSegment>;
}


/**
 * The SerializedTextViewComponent interface is used to define the serialised properties of the TextView component.
 */
export declare interface SerializedTextViewComponent
  extends SerializedBaseComponent<TextViewComponentType> {
    dependencies: SerializedTextViewDependencies;
    state: TextViewComponentState;

  }

export interface TextViewSpecification extends ComponentTypeSpecification {
  SerializedComponent: SerializedTextViewComponent;
  Dependencies: TextViewDependencies;
}

/**
 * The InputFieldComponent class is a derived taskComponent, that allows users to enter textual or numeric input.
 */
export class TextViewComponent extends BaseComponent<TextViewSpecification> {
  /**
   * validate: checks, if the loaded text (or the concatenated string) is undefined, null or empty.
   */
  public validate(textValue: string | undefined | null) {
    // Start: Angenommen, der Wert ist erst mal gültig
    let isValid = true;
    const isCorrect = true;

    // Prüfen, ob der Wert nicht erlaubt ist (undefined, null oder leerer String)
    if (textValue === undefined || textValue === null || textValue.trim() === "") {
      isValid = false;
    }

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

