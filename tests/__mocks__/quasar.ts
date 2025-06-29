import { defineComponent } from 'vue'
const make = (name: string, tag = 'div') =>
  defineComponent({ name, props: ['modelValue'], template: `<${tag}><slot /></${tag}>` })

export const QInput = make('QInput', 'input')
export const QExpansionItem = make('QExpansionItem')
export default { QInput, QExpansionItem }
