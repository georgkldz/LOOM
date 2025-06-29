import { config } from '@vue/test-utils'

// alle Komponenten, die mit „q-“ beginnen, stumpf durch <div> ersetzen
config.global.stubs = {
  QInput: { template: '<input />' },
  QExpansionItem: { template: '<div><slot /></slot></div>' },
  component: { template: '<div><slot/></div>' }
}
