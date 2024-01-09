<template>
  <MInputs
    :model-value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  >
    {{ inputLabel }}
  </MInputs>
  <div class="w-3/12 flex flex-col">
    <MButton class="text-[18px]" @on-click-action="$emit('on-plus-action')"
      >+</MButton
    >
    <MButton class="text-[18px]" @on-click-action="$emit('on-minus-action')"
      >-</MButton
    >
  </div>
</template>

<script lang="ts" setup>
import MInputs from "@/components/ui/MInputs.vue";
import MButton from "@/components/ui/MButton.vue";
import { defineEmits, defineProps } from "vue";

defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  inputLabel: {
    type: String,
    required: true,
  },
});

defineEmits(["on-plus-action", "on-minus-action", "update:modelValue"]);
</script>
