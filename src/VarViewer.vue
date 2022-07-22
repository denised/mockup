<script>
import { prettyprint } from './utility.js';

export default {
  props: ['datapoints', 'title', 'slidermin', 'slidermax', 'sliderval'],

  data() {
    return {
      realdp: [],
      minval: 0,
      maxval: 1,
      range: 1,
      value: 1,
      show_details: false,
      active_tab: 0,
    };
  },

  mounted() {
    this.realdp = this.datapoints;
    this.initialize();
  },

  computed: {
    slider_pos() {
      return (this.value - this.minval) / this.range;
    },
  },
  methods: {
    prettyprint,
    initialize() {
      this.minval = this.slidermin
        ? this.slidermin
        : 0.9 * Math.min(...this.realdp.map((x) => x.value));
      this.maxval = this.slidermax
        ? this.slidermax
        : 1.1 * Math.max(...this.realdp.map((x) => x.value));
      this.range = this.maxval - this.minval;
      for (let i in this.realdp) {
        this.realdp[i].xpos =
          ((100 * this.realdp[i].value) / this.range).toString() + '%';
      }
      this.value = this.sliderval
        ? this.sliderval
        : this.minval + this.range / 2;
    },
    update_value(e) {
      const newval = e.target.value * this.range + this.minval;
      this.value = newval;
    },
    toggle_details() {
      this.show_details = !this.show_details;
    },
  },
};
</script>

<template>
  <div class="container max-w-sm">
    <h1 class="text-lg text-center">
      {{ title }}
    </h1>
    <h2 class="text-sm text-center leading-none" v-if="realdp.length">
      {{ realdp[0].units }}
    </h2>
    <div id="chart" class="container relative h-32 bg-zinc-100">
      <div
        v-for="item of realdp"
        class="point absolute bottom-[14px]"
        :class="{
          'text-blue-500': item.highlight,
          'text-zinc-400': !item.enabled,
        }"
        :style="{ left: item.xpos }"
        @pointerenter="item.highlight = true"
        @pointerleave="item.highlight = false"
      >
        🟂
      </div>
      <input
        type="range"
        id="slider"
        min="0"
        max="1"
        step="any"
        :value="slider_pos"
        @input="update_value"
      />
      <div class="absolute bottom-0.5 left-1 text-xs">
        {{ prettyprint(value) }}
      </div>
    </div>
    <div
      class="w-fit rounded-sm text-sm p-1.5 pr-2 hover:bg-zinc-400"
      @click="toggle_details()"
    >
      {{ show_details ? 'hide' : 'show' }} sources
    </div>
    <!-- why isn't v-if working?  It shows when clicked, but does not hide. 
         same thing happens if v-if is on the o-tabs component directly.
         v-show works though, so we'll stick with that. -->
    <div id="details-container" v-show="show_details">
      <!-- So if I'm understanding Oruga properly, the correct way to style
      oruga-generated stuff is to -->
      <o-tabs v-model="active_tab" :animated="false">
        <o-tab-item value="0" label="List">
          <ul>
            <li
              v-for="item of realdp"
              @pointerenter="item.highlight = true"
              @pointerleave="item.highlight = false"
              :class="{ en: item.enabled, hi: item.highlight }"
            >
              <input
                type="checkbox"
                :checked="item.enabled"
                @click="item.enabled = !item.enabled"
              />
              <span class="source">{{ item.source }}</span>
              <span class="category"> ({{ item.category }})</span>:
              <span class="value">{{ prettyprint(item.value) }}</span>
              <!-- Show more details when highlighted -->
              <Teleport to="#pane">
                <div v-if="item.highlight" class="citation">
                  <a href="item.link">{{ item.citation }}</a>
                  <div class="value">
                    {{ prettyprint(item.original_value) }}
                    <span class="units">{{ item.original_units }}</span>
                    <span v-if="item.original_value != item.value">
                      = {{ prettyprint(item.value) }} {{ item.units }}</span
                    >
                  </div>
                </div>
              </Teleport>
            </li>
          </ul>
          <div id="pane"></div>
        </o-tab-item>
        <o-tab-item :value="1" label="Select by Source">
          Lorem <br />
          ipsum <br />
          dolor <br />
          sit <br />
          amet.
        </o-tab-item>
        <o-tab-item :value="2" label="Select by Category">
          Lorem <br />
          ipsum <br />
          dolor <br />
          sit <br />
          amet.
        </o-tab-item>
      </o-tabs>
    </div>
  </div>
</template>

<style scoped>
#slider {
  -webkit-appearance: none; /* Override default CSS styles */
  appearance: none;
  width: 100%;
  position: absolute;
  bottom: 34px;
  height: 2px;
}
/* styling of the oruga tabs component. 
   Currently this isn't getting applied at all?
   Why not?    Doesn't matter if I use just nav, or just
   .o-tabs__nav --- or if I set the text to red.  It just isn't 
   showing up in the rules list. 
   
   If I put the customization in index.css, following the techniques
   used by tailwind, it does show up in the rules list, but at the bottom. */
nav.o-tabs__nav {
  overflow-x: hidden !important;
}
</style>
