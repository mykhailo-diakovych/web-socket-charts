<template>
  <select
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    class="w-full p-[7px] text-white bg-[#151f31] border-[#3e3f45] border-2 focus:outline-0 cursor-pointer sm:w-[90%]"
  >
    <option v-for="item in options" :key="item.value" :value="item.value">
      {{ item.title }}
    </option>
  </select>
</template>

<script>
export default {
  name: "MSelect",
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
  },
};
</script>
