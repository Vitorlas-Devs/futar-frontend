<script setup lang="ts">
  import { ref, computed } from "vue";
  import { useQuasar } from "quasar";
  const props = defineProps({
    supper: Boolean,
  });
  const counter = ref(0);
  const color = ref("yellow");
  const $q = useQuasar();
  const version = computed(() => $q.version);
  const plus = () => {
    counter.value++;
  };
  const minus = () => {
    counter.value--;
  };
</script>

<template>
  <q-page padding>
    <div class="text-h4">
      {{ props.supper ? "SUPPER" : "" }} {{ version }}
      <q-badge align="top" data-test="counter">
        {{ counter }}
      </q-badge>
    </div>

    <q-separator />
    <q-btn-group push>
      <q-btn data-test="minus" @click="minus">-</q-btn>
      <q-btn data-test="plus" @click="plus">+</q-btn>
    </q-btn-group>
    <q-separator />
    <q-input v-model="color" data-test="color" label="Change the color:" outlined type="text"></q-input>
  </q-page>
</template>
