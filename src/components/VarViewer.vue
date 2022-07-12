<script>
import { prettyprint } from '../utility.js';

export default {
  props: ['datapoints', 'title', 'slidermin', 'slidermax'],

  data() {
    return {
      realdp: [],
      minval: 0,
      maxval: 1,
      range: 1,
    };
  },

  mounted() {
    this.realdp = this.datapoints;
    this.set_positions();
  },

  computed: {},
  methods: {
    tester() {
      this.realdp[5].highlight = !this.realdp[5].highlight;
    },
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
      :class="{ enabled: item.enabled }"
      :style="{ color: 'red', left: item.xpos }"
    >
      x
    </div>
  </div>
  <input type="button" value="Click Me" @click="tester" />
  <div id="source-list">
    <ul>
      <li
        v-for="item of realdp"
        @pointerenter="item.highlight = true"
        @pointerleave="item.highlight = false"
      >
        <input type="checkbox" :checked="item.enabled" />
        <span class="source">{{ item.source }}</span>
        (<span class="category">{{ item.category }}</span
        >): <span class="value">{{ prettyprint(item.value) }}</span>
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
#source-list li:hover {
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
}
#chart .point {
  position: absolute;
  top: 10px;
}
</style>
