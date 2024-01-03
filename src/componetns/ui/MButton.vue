<template>
  <template v-if="bool">
    <button
      class="cursor-pointer px-[30px] py-[20px] border-none rounded text-[18px] text-white mb-[10px] w-full bg-[#35A947]"
      @click="positiveNewDot"
    >
      <slot></slot>
    </button>
  </template>
  <template v-else>
    <button
      class="cursor-pointer px-[30px] py-[20px] border-none rounded text-[18px] text-white mb-[10px] w-full bg-[#E34828]"
      @click="negativeNewDot"
    >
      <slot></slot>
    </button>
  </template>
</template>

<script>
export default {
  name: "MButton",
  props: {
    bool: {
      type: Boolean,
      required: true,
    },
    positiveNewDot: {
      type: Function,
    },
    negativeNewDot: {
      type: Function,
    },
  },

  setup() {},
};
</script>
