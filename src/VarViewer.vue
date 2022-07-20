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
      &#x1F7C2;
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
    <div class="val">{{ prettyprint(this.value) }}</div>
  </div>
  <o-button
    @click="toggle_details()"
    :icon-left="show_details ? 'caret-right' : 'caret-down'"
    >Sources</o-button
  >
  <o-tabs
    v-model="active_tab"
    :animated="false"
    :multiline="false"
    type="boxed"
    :class="show_details ? '' : 'hide'"
  >
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
  bottom: 15px;
  color: #bbb;
}
#chart .point.en {
  color: black;
}
#chart .point.hi {
  color: blue !important;
  font-weight: bold;
}
#chart .val {
  position: absolute;
  bottom: 0;
  font-size: 70%;
  left: 5px;
}
#slider {
  -webkit-appearance: none; /* Override default CSS styles */
  appearance: none;
  width: 100%;
  position: absolute;
  bottom: 34px;
  height: 2px;
}

.hide {
  display: none;
}
</style>
