import { it, expect } from "vitest";
import { mountQuasar } from "../../test/utils";
import BtnCounter from "./BtnCounter.vue";
import { QInput, QBtn } from "quasar";

describe("BtnCounter test", () => {
  it("BtnCounter", async () => {
    expect(BtnCounter).toBeTruthy();

    const wrapper = mountQuasar(BtnCounter, {
      props: {
        supper: true,
      },
      plugins: [QInput, QBtn],
    });

    await wrapper.setProps({ supper: false });

    const inner = wrapper.findComponent(BtnCounter);

    expect(inner.get('[data-test="counter"]').text()).toBe("0");

    await inner.get('[data-test="plus"]').trigger("click");

    expect(inner.get('[data-test="counter"]').text()).toBe("1");

    await inner.get('[data-test="plus"]').trigger("click");
    await inner.get('[data-test="plus"]').trigger("click");

    expect(inner.get('[data-test="counter"]').text()).toBe("3");

    await inner.get('[data-test="minus"]').trigger("click");
    await inner.get('[data-test="minus"]').trigger("click");
    await inner.get('[data-test="minus"]').trigger("click");
    await inner.get('[data-test="minus"]').trigger("click");

    expect(inner.get('[data-test="counter"]').text()).toBe("-1");

    // Set QInput value
    const input = inner.find('[data-test="color"]');
    expect(input.getCurrentComponent()?.props.modelValue).toBe("yellow");
    await input.setValue("green");
    // await input.trigger("change");

    expect(input.getCurrentComponent()?.props.modelValue).toBe("green");

    // input.element.value = "green";
    // input.trigger("change");

    // console.log("html():");
    // console.log(input.getCurrentComponent()?.props);
    // console.log("text():");
    // console.log(inner.text());
  });
});
