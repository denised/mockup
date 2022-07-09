<script>
export default {
  props: ['datapoints'],

  data() {
    return {
      realdp: null,
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
      this.realdp[5].enabled = !this.realdp[5].enabled;
    },
  },
};
</script>

<template>
  <p>Pardon the mess... There are {{ enabled.length }} items here.</p>
  <ul class="source-list">
    <li v-for="item of realdp">
      <input type="checkbox" :checked="item.enabled" />
      <span class="source">{{ item.source }}</span>
      (<span class="category">{{ item.category }}</span
      >):
      <span class="value">
        {{ item.original_value }} {{ item.original_units }}
        <span v-if="item.original_value != item.value">
          = {{ item.value }} {{ item.units }}</span
        >
      </span>
      <span class="citation"
        ><a href="item.link">{{ item.citation }}</a>
      </span>
    </li>
  </ul>
  <input type="button" value="Click Me" @click="tester" />
</template>

<style scoped>
.source-list {
  list-style: none;
}
.citation {
  display: none;
}
.category {
  font-size: 80%;
}
.value {
  font-size: 80%;
}
</style>
