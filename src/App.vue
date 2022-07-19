<script setup>
import Vue from 'vue';
import { Tabs } from 'buefy';
import VarViewer from './components/VarViewer.vue';
import { theTestData } from './testdata.js';

Vue.use(Tabs);

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
