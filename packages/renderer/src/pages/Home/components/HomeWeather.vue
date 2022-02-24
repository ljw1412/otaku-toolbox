<template>
  <div class="home-weather">
    <a-spin :loading="isLoading"
      class="h-100 w-100">
      <div class="sky layout-lr px-8">
        <div class="weather">
          <div v-if="weatherIcon.day"
            class="day"
            :title="isWeatherNotChange?'天气':'白天天气'">
            <acg-icon :name="weatherIcon.day"
              size="60"></acg-icon>
          </div>
          <div v-if="weatherIcon.night"
            v-show="!isWeatherNotChange"
            class="night"
            title="夜间天气">
            <acg-icon :name="weatherIcon.night"
              size="60"></acg-icon>
          </div>
        </div>
        <div class="base-info">
          <div class="wendu fs-36"
            title="温度">{{ weather.wendu }}℃</div>
          <div class="shidu fs-16"
            title="湿度">
            <acg-icon name="shidu"
              size="14"></acg-icon>
            <span class="ml-4">{{ weather.shidu }}</span>
          </div>
        </div>
      </div>
      <div class="earth-container pt-16 px-8 text-center">
        <div class="city layout-center">
          <a-input v-if="isEdit"
            ref="cityInput"
            v-model="inputCity"
            style="width:80%;"
            class="text-center"
            @blur="isEdit = false"
            @press-enter="handleCityChange"></a-input>
          <div v-else
            class="city-text"
            @click="isEdit = true">{{
               isCityError ? '无效城市': ( weather.city || '城市' ) 
            }}</div>
        </div>
        <div class="sun fs-20 mt-8">
          <acg-icon name="richu"></acg-icon>
          <span class="ml-4 fs-14">{{ weather.sunrise_1 }}</span>
          <span class="mx-4"></span>
          <acg-icon name="rila"></acg-icon>
          <span class="ml-4 fs-14">{{ weather.sunset_1 }}</span>
        </div>
        <div v-show="!isEdit"
          class="optional">
          <icon-refresh size="16px"
            @click="iniWeather" />
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const weathers: Record<string, string> = {
  晴: 'qingtian'
}

export default defineComponent({
  name: 'HomeWeather',

  data() {
    return {
      isLoading: true,
      isEdit: false,
      inputCity: '',
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

  computed: {
    isWeatherNotChange(): boolean {
      return this.weather.daytype === this.weather.nighttype
    },
    isCityError(): boolean {
      return !this.weather.city && !this.isLoading
    },
    weatherIcon(): { day: string; night: string } {
      return {
        day: weathers[this.weather.daytype],
        night: weathers[this.weather.nighttype]
      }
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
    async fetchIpInfo() {
      const { city } = await this.$API.Outside.ipInfo()
      this.$global.config.weatherCity = city
    },

    async fetchWeather() {
      this.isLoading = true
      this.weather = await this.$API.Outside.weather(
        this.$global.config.weatherCity
      )
      this.isLoading = false
    },

    async iniWeather() {
      if (!this.$global.config.weatherCity) {
        await this.fetchIpInfo()
      }
      this.fetchWeather()
    },

    handleCityChange() {
      if (!this.inputCity.trim()) {
        this.isEdit = false
        return
      }
      this.$global.config.weatherCity = this.inputCity
      this.fetchWeather()
      this.isEdit = false
    }
  }
})
</script>

<style lang="scss">
.home-weather {
  position: relative;
  height: 120px;
  padding-top: 40px;
  box-sizing: border-box;

  .sky {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
  }

  .weather {
    display: flex;
  }

  .base-info {
    line-height: 1;
    text-align: right;
  }

  .wendu {
    font-size: 36px;
  }

  .earth-container {
    position: relative;
    height: 100%;
    width: 100%;
    border-radius: 50% 50% 4px 4px;
    box-shadow: 0 1px 1px var(--color-fill-2) inset,
      0 1px 3px var(--color-fill-3);
    box-sizing: border-box;
  }

  .city {
    font-size: 30px;
    line-height: 30px;
    height: 30px;
  }

  .city-text {
    cursor: text;
  }

  .optional {
    position: absolute;
    right: 6px;
    bottom: 2px;
    display: none;
    > * {
      cursor: pointer;
    }
  }

  &:hover {
    .optional {
      display: block;
    }
  }

  .text-center .arco-input {
    text-align: inherit;
  }
}
</style>
