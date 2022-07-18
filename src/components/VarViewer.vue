<script>
import { prettyprint } from '../utility.js';

export default {
  props: ['datapoints', 'title', 'slidermin', 'slidermax', 'sliderval'],

  data() {
    return {
      realdp: [],
      minval: 0,
      maxval: 1,
      range: 1,
      value: 1,
    };
  },

  mounted() {
    this.realdp = this.datapoints;
    this.set_positions();
  },

  computed: {},
  methods: {
    prettyprint,
    set_positions() {
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
  },
};
</script>

<template>
  <h2>
    {{ title }}
    <span class="units" v-if="realdp.length"><br />{{ realdp[0].units }}</span>
  </h2>
  <div id="chart">
    <div
      v-for="item of realdp"
      class="point"
      :class="{ en: item.enabled, hi: item.highlight }"
      :style="{ left: item.xpos }"
      @pointerenter="item.highlight = true"
      @pointerleave="item.highlight = false"
    >
      &vert;
    </div>
    <div class="line"></div>
    <div class="thumb" :style="{ left: value }"></div>
    <div class="val">{{ prettyprint(this.value) }}</div>
  </div>
  <div id="source-list">
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
  </div>
</template>

<style scoped>
#source-list {
  font-size: 14px;
  line-height: 15px;
}
#source-list ul {
  list-style: none;
  padding: 2px;
}
#source-list li.hi {
  background-color: antiquewhite;
}
.category {
  font-size: 80%;
}
.citation {
  padding: 0.5em;
  font-size: 12px;
  line-height: 15px;
}
.value {
  font-size: 80%;
}
h2 .units {
  font-size: 60%;
}
#pane {
  height: 80px;
  background-color: antiquewhite;
}
#chart {
  width: 100%;
  height: 80px;
  position: relative;
  background-color: antiquewhite;
}
#chart .point {
  position: absolute;
  bottom: 20px;
  color: #bbb;
}
#chart .point.en {
  color: black;
}
#chart .point.hi {
  color: blue !important;
  font-weight: bold;
}
#chart .line {
  position: absolute;
  width: 100%;
  height: 0;
  border-top: inset;
  bottom: 32px;
}
#chart .thumb {
  position: absolute;
  width: 2px;
  height: 15px;
  bottom: 20px;
  border: solid black;
}
#chart .val {
  position: absolute;
  bottom: 0;
  font-size: 70%;
}
</style>
