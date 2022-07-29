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
            last_item: null
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
            // Oruga Tab has a bug that on first display, the default tab is not shown.
            // So we're resorting to hacking to do it ourselves.
            // This also has the desirable side effect of always opening the display at the 1st tab.
            if (this.show_details) {
                this.$refs.tabs.homePressed();  // internal Oruga Tab method
            }
            if (!this.show_details) {
                this.last_item = null;
            }
        },
        highlight_list_item(item) {
            item.highlight = true;
            this.last_item = item;
        }
    },
};
</script>
<!-- TEMPLATE -->
<template>
    <div class="container max-w-sm mx-auto mt-5">
        <h1 class="text-lg text-center">
            {{ title }}
        </h1>
        <h2 class="text-sm text-center leading-none" v-if="realdp.length">
            {{ realdp[0].units }}
        </h2>
        <!-- BEGIN CHART -->
        <div id="chart" class="container relative h-32 bg-zinc-100 cursor-pointer">
            <!-- points -->
            <div v-for="item of realdp" class="point absolute bottom-[14px]" :class="{
                'text-blue-500': item.highlight,
                'text-zinc-400': !item.enabled,
            }" :style="{ left: item.xpos }" @pointerenter="item.highlight = true" @pointerleave="item.highlight = false">
                🟂
            </div>
            <!-- slider -->
            <input type="range" id="slider" min="0" max="1" step="any" :value="slider_pos" @input="update_value" />
            <!-- value -->
            <div class="absolute bottom-0.5 left-1 text-xs">
                {{ prettyprint(value) }}
            </div>
        </div>
        <!-- BEGIN DETAILS -->
        <div class="w-fit text-sm p-1.5 pr-2 hover:bg-zinc-400" @click="toggle_details()">
            {{ show_details ? 'hide' : 'show' }} sources
        </div>
        <!-- why isn't v-if working?  It shows when clicked, but does not hide. 
         same thing happens if v-if is on the o-tabs component directly.
         v-show works though, so we'll stick with that. -->
        <div id="details-container" v-show="show_details" class="cursor-default">
            <!-- Oruga styling is in ../index.css -->
            <o-tabs v-model="active_tab" :animated="false" ref="tabs">
                <!-- Tab 1: the list of entries -->
                <o-tab-item value="0" label="List">
                    <ul>
                        <li v-for="item of realdp" @pointerenter="highlight_list_item(item)"
                            @pointerleave="item.highlight = false" class="text-sm ml-2" :class="{
                                'text-blue-500': item.highlight,
                                'text-zinc-400': !item.enabled,                                
                            }">
                            <input type="checkbox" :checked="item.enabled"
                                @click="item.enabled = !item.enabled" :class="{
                                    'accent-blue-500': item.highlight,
                                    'accent-zinc-400': !item.enabled,  
                                }"/>&nbsp;
                            {{ item.source }} ({{ item.category }}): {{ prettyprint(item.value) }}
                            <!-- Show more details when highlighted -->
                            <Teleport to="#pane">
                                <div v-if="item == last_item">
                                    {{ item.citation }}
                                    <span v-if="item.link">
                                        <a :href="item.link" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                                    </span>
                                    <br/>
                                    {{ prettyprint(item.original_value) }} {{ item.original_units }}
                                    <span v-if="item.original_value != item.value"> = 
                                        {{ prettyprint(item.value) }} {{ item.units }}
                                    </span>
                                </div>
                            </Teleport>
                        </li>
                    </ul>
                    <div id="pane" class="w-full h-36 bg-zinc-100 py-1 px-2 text-sm"></div>
                </o-tab-item>
                <!-- Tab 2: selection by source-->
                <o-tab-item :value="1" label="Select by Source">
                    Lorem <br />
                    ipsum <br />
                    dolor <br />
                    sit <br />
                    amet.
                </o-tab-item>
                <!-- Tab 3: se3lection by category -->
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
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    position: absolute;
    bottom: 34px;
    height: 2px;
}
</style>
