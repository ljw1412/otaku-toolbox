<template>
  <div class="home-weather">
    <a-spin :loading="isLoading" class="h-100 w-100 p-12">
      <div class="wendu gold-text" title="当前温度">
        <span class="temp">{{ weather.temp }}</span>
        <span class="unit">℃</span>
      </div>

      <div class="city" @click="isDisplayLocation = true">
        <span>{{ weather.cityname || '城市' }}</span>
        <icon-edit />
      </div>

      <div class="base-info">
        <div class="weather">{{ weather.weather }}</div>
        <div>{{ weather.min }}℃~{{ weather.max }}℃</div>
        <div>
          <span class="fengli">{{ weather.WD + weather.WS }}</span>
          <span class="mx-4">|</span>
          <span class="shidu">湿度{{ weather.sd }}</span>
        </div>
      </div>

      <div class="optional layout-lr">
        <span class="update-time color-text-3">{{ weather.time }}更新</span>
        <icon-refresh class="refresh" size="16px" @click="iniWeather" />
      </div>
    </a-spin>

    <home-weather-location
      v-model:visible="isDisplayLocation"
      @change="handleCityChange"
    ></home-weather-location>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HomeWeatherLocation from './HomeWeatherLocation.vue'

export default defineComponent({
  name: 'HomeWeather',

  components: {
    HomeWeatherLocation
  },

  data() {
    return {
      isLoading: true,
      isDisplayLocation: false,
      inputCity: '',
      weather: {
        nameen: '',
        cityname: '',
        city: '',
        temp: '',
        max: '',
        min: '',
        tempf: '',
        WD: '',
        wde: '',
        WS: '',
        wse: '',
        SD: '',
        sd: '',
        qy: '',
        njd: '',
        time: '',
        rain: '',
        rain24h: '',
        aqi: '',
        aqi_pm25: '',
        weather: '',
        weathere: '',
        weathercode: '',
        limitnumber: '',
        date: ''
      }
    }
  },

  computed: {
    isCityError(): boolean {
      return !this.weather.city && !this.isLoading
    },
    now() {
      return this.$dayjs(this.$global.now.value).format('HH:mm')
    },
    nowMinute(): number {
      const now = this.$dayjs(this.$global.now.value)
      return now.hour() * 60 + now.minute()
    }
  },

  watch: {
    isEdit(isEdit: boolean) {
      if (isEdit) {
        this.inputCity = this.weather.city
        this.$nextTick(() => {
          // @ts-ignore
          this.$refs.cityInput.focus()
        })
      }
    }
  },

  created() {
    this.iniWeather()
  },

  methods: {
    async fetchCityByIp() {
      const info = await this.$API.Outside.ipInfo()
      console.log(info)

      this.$global.config.weather.city = info.addr.split(',')[2] || '城市'
      this.$global.config.weather.cityId = info.id
    },

    async fetchWeather() {
      const cityId = this.$global.config.weather.cityId
      if (!cityId) {
        return
      }
      this.isLoading = true
      try {
        this.weather = await this.$API.Outside.weather(cityId)
      } catch (error) {
        this.$message.error('天气获取失败！')
      }

      this.isLoading = false
    },

    async iniWeather() {
      if (!this.$global.config.weather.cityId) {
        await this.fetchCityByIp()
      }
      this.fetchWeather()
    },

    handleCityChange(city: { city: string; cityId: string }) {
      this.$global.config.weather = city
      this.fetchWeather()
    }
  }
})
</script>

<style lang="scss">
.home-weather {
  position: relative;
  height: 120px;
  background-color: var(--color-bg-2);
  box-shadow: 0 1px 1px var(--color-fill-2) inset, 0 1px 3px var(--color-fill-3);
  line-height: 1;

  .arco-spin {
    box-sizing: border-box;
  }

  .gold-text {
    text-shadow: 0 0 5px var(--color-bg-1);
    color: var(--app-color-common);
  }

  .wendu {
    font-size: 36px;

    .temp {
      font-size: 56px;
    }
  }

  .base-info {
    position: absolute;
    right: 12px;
    top: 12px;
    font-size: 14px;
    text-align: right;
    line-height: 1.2;
  }

  .city {
    cursor: pointer;
    position: absolute;
    left: 12px;
    bottom: 12px;
    font-size: 30px;
    line-height: 30px;
    height: 30px;

    .arco-icon-edit {
      transition: opacity 0.2s;
      font-size: 16px;
      opacity: 0;
    }

    &:hover .arco-icon-edit {
      opacity: 1;
    }
  }

  .optional {
    position: absolute;
    right: 12px;
    bottom: 12px;

    .refresh {
      margin-left: 4px;
      cursor: pointer;
    }

    .update-time {
      font-size: 12px;
    }
  }

  .text-center .arco-input {
    text-align: inherit;
  }
}
</style>
