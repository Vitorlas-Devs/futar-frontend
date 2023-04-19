import { QBtn, QInput, Quasar } from 'quasar'
import { expect, test } from 'vitest'
import LoginDialog from 'src/components/LoginDialog.vue'
import { mountQuasar } from '../../test/utils'

test('Test AccountView', async () => {
  expect(LoginDialog).toBeTruthy()

  const wrapper = mountQuasar(LoginDialog, {
    props: { email: 'student001@jedlik.eu', password: 'student001', showDialog: false },
    // for testing QDialogs:
    global: {
      stubs: {
        teleport: true,
      },
    },
    mocks: {
      $q: Quasar,
    },
    plugins: [QInput, QBtn],
  })

  await wrapper.setProps({ showDialog: true })

  const inner = wrapper.findComponent(LoginDialog)

  const inputPassword = inner.find('[data-test="QInputPassword"]')

  // expect(inner.get('[data-test="QCheckBoxLength"]').isVisible());
  // expect(inner.get('[data-test="QCheckBoxLength"]').classes()).toContain("text-green");

  expect(inputPassword.getCurrentComponent()?.props.modelValue).toBe('student001')
  // console.log(inputPassword.html())
})
