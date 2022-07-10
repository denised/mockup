<script>
import { prettyprint } from '../utility.js';

export default {
  props: ['datapoints', 'title', 'slidermin', 'slidermax'],

  data() {
    return {
      realdp: [],
      minval: 0,
      maxval: 1
    };
  },

  mounted() {
    this.realdp = this.datapoints;
  },

  computed: {
    enabled() {
      return this.realdp.filter((item) => item.enabled);
    },
  },
  methods: {
    tester() {
      this.realdp[5].highlight = !this.realdp[5].highlight;
    },
    prettyprint,
  },
};
</script>

<template>
  <h2>
    {{ title }}
    <span class="units" v-if="realdp.length"><br />{{ realdp[0].units }}</span>
  </h2>
  <input type="button" value="Click Me" @click="tester" />
  <div id="chart">

  </div>
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
</style>
