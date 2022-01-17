<template>
  <div v-show="false"
    class="home-weather">
    {{ weather }}
  </div>
</template>

<script lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeWeather',

  setup() {
    const weatherCity = useLocalStorage('WEATHER_CITY', '')
    return { weatherCity }
  },

  data() {
    return {
      weather: {
        city: '',
        updatetime: '',
        wendu: '',
        shidu: '',
        sunrise_1: '',
        sunset_1: '',
        daytype: '',
        nighttype: ''
      }
    }
  },

  created() {
    this.iniWeather()
  },

  methods: {
    async fetchIpInfo() {
      const { city } = await this.$API.Outside.ipInfo()
      this.weatherCity = city
    },

    async fetchWeather() {
      this.weather = await this.$API.Outside.weather(this.weatherCity)
    },

    async iniWeather() {
      if (!this.weatherCity) {
        await this.fetchIpInfo()
      }
      this.fetchWeather()
    }
  }
})
</script>

<style lang="scss">
</style>
