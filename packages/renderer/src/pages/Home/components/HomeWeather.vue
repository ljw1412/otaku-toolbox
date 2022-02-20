<template>
  <div class="home-weather">
    <a-spin :loading="isLoading"
      class="d-flex layout-lr h-100 px-8">
      <div class="left">
        <div class="city">{{ weather.city }}</div>
        <div class="number-info d-flex">
          <div class="wendu">{{ weather.wendu }}℃</div>
          <div class="mx-4"> / </div>
          <div class="shidu">{{ weather.shidu }}</div>
          <div class="tips fs-14">温度/湿度</div>
        </div>
      </div>
      <div class="right">
        <div class="weather">
          <span>日：{{ weather.daytype }}</span>
          <br>
          <span>夜：{{ weather.nighttype }}</span>
        </div>
        <div class="sun">
          <span>日出：{{ weather.sunrise_1 }}</span>
          <br>
          <span>日落：{{ weather.sunset_1 }}</span>
        </div>
      </div>

      <div v-show="false"
        class="updatetime">{{ weather.updatetime }}</div>
    </a-spin>
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
      isLoading: true,
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
      this.isLoading = true
      this.weather = await this.$API.Outside.weather(this.weatherCity)
      this.isLoading = false
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
.home-weather {
  position: relative;
  height: 120px;
  border-radius: 4px;
  box-shadow: 0 1px 1px var(--color-fill-2) inset, 0 1px 3px var(--color-fill-3);
  .city {
    font-size: 48px;
  }
  .number-info {
    position: relative;
    font-size: 24px;

    .tips {
      display: none;
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translate(-50%, 100%);
      width: 100px;
      text-align: center;
      color: var(--color-text-3);
    }

    &:hover {
      .tips {
        display: block;
      }
    }
  }
  .weather {
  }
  .sun {
  }
  .updatetime {
  }
}
</style>
