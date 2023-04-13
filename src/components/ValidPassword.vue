<script setup lang="ts">
  import { reactive, watch } from "vue";
  import LoginHelper from "./LoginHelper";

  interface IProps {
    password: string;
  }
  const props = defineProps<IProps>();

  const emit = defineEmits<{
    // eslint-disable-next-line no-unused-vars
    (e: "password_changed", result: string | boolean): void;
  }>();

  interface IMapData {
    isOk: boolean;
    label: string;
    test: string; // use later
  }

  interface IReactiveData {
    check: Map<string, IMapData>;
  }

  const r = reactive<IReactiveData>({
    check: new Map(),
  });

  function isValidPassword(pass: string): boolean | string {
    r.check.set("length", {
      isOk: LoginHelper.IsLengthOk(pass),
      label: "Length >= 8",
      test: "QCheckBoxLength", // use later
    });
    r.check.set("upper", {
      isOk: LoginHelper.IsAnyUppercaseChar(pass),
      label: "Uppercase char(s)",
      test: "QCheckBoxUpper", // use later
    });
    r.check.set("lower", {
      isOk: LoginHelper.IsAnyLowercaseChar(pass),
      label: "Lowercase char(s)",
      test: "QCheckBoxLower", // use later
    });
    r.check.set("special", {
      isOk: LoginHelper.IsAnySpecialChar(pass),
      label: "Special char(s)",
      test: "QCheckBoxSpecial", // use later
    });
    r.check.set("number", {
      isOk: LoginHelper.IsAnyNumber(pass),
      label: "Number(s)",
      test: "QCheckBoxNumber", // use later
    });
    if (pass.length == 0) return "Please fill in!";
    return (r.check.get("length")?.isOk &&
      r.check.get("upper")?.isOk &&
      r.check.get("lower")?.isOk &&
      r.check.get("special")?.isOk &&
      r.check.get("number")?.isOk) as boolean;
  }

  isValidPassword(props.password);

  watch(props, () => {
    emit("password_changed", isValidPassword(props.password));
  });
</script>

<template>
  <q-checkbox
    v-for="e in r.check.entries()"
    :key="e[0]"
    v-model="e[1].isOk"
    checked-icon="star"
    :class="e[1].isOk ? 'text-green' : 'text-red'"
    :color="e[1].isOk ? 'green' : 'red'"
    :data-test="e[1].test"
    disable
    keep-color
    :label="e[1].label"
    unchecked-icon="star_border"
  />
</template>

<style lang="scss" scoped></style>
