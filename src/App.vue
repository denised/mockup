<script setup>
import VarViewer from './components/VarViewer.vue';
import { theTestData } from './testdata.js';

const td = JSON.parse(theTestData);
for (var i in td) {
  td[i].enabled = true;
  td[i].highlight = false;
}
</script>

<template>
  <VarViewer :datapoints="td" title="Energy Saved" />
</template>

<style scoped></style>
