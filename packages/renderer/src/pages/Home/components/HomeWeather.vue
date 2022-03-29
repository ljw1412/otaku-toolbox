<template>
  <div class="home-weather">
    <a-spin :loading="isLoading" class="h-100 w-100">
      <div class="bg-container">
        <div class="bg" :style="bgStyle"></div>
      </div>
      <div class="sky layout-lr px-8 pt-6">
        <div class="weather">
          <div
            v-if="weatherIcon.day"
            class="day"
            :title="(isWeatherNotChange ? '天气:' : '白天:') + weather.daytype"
          >
            <acg-icon :name="weatherIcon.day" stroke="#000" size="50"></acg-icon>
          </div>
          <div
            v-if="weatherIcon.night"
            v-show="!isWeatherNotChange"
            class="night"
            :title="`夜间:${weather.nighttype}`"
          >
            <acg-icon :name="weatherIcon.night" stroke="#000" size="50"></acg-icon>
          </div>
        </div>
        <div class="base-info">
          <div class="wendu fs-36" title="温度">{{ weather.wendu }}℃</div>
          <div class="shidu fs-16" title="湿度">
            <acg-icon name="shidu" fill="currentColor" size="14"></acg-icon>
            <span class="ml-4">{{ weather.shidu }}</span>
          </div>
        </div>
      </div>
      <div class="earth-container pt-16 px-8 text-center">
        <div class="city layout-center">
          <a-input
            v-if="isEdit"
            ref="cityInput"
            v-model="inputCity"
            style="width:80%;"
            class="text-center"
            @blur="isEdit = false"
            @press-enter="handleCityChange"
          ></a-input>
          <div v-else class="city-text" @click="isEdit = true">
            {{
              isCityError ? '无效城市' : (weather.city || '城市')
            }}
          </div>
        </div>
        <div class="sun fs-20 mt-8">
          <acg-icon name="richu"></acg-icon>
          <span class="ml-4 fs-14">{{ weather.sunrise_1 }}</span>
          <span class="mx-4"></span>
          <acg-icon name="rila"></acg-icon>
          <span class="ml-4 fs-14">{{ weather.sunset_1 }}</span>
        </div>
        <div v-show="!isEdit" class="optional">
          <icon-refresh size="16px" @click="iniWeather" />
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const nightWeathers: Record<string, string> = {
  晴: 'wanjianqingtian',
  多云: 'wanjianduoyun'
}

const weathers: Record<string, string> = {
  晴: 'qingtian',
  雾: 'wu',
  阴: 'yintian',
  多云: 'duoyun',
  小雨: 'xiaoyu',
  中雨: 'xiaoyu',
  大雨: 'xiaoyu',
  暴雨: 'baoyu',
  雷阵雨: 'leizhenyu'
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
    now() {
      return this.$dayjs(this.$global.now.value).format('HH:mm')
    },
    nowMinute(): number {
      const now = this.$dayjs(this.$global.now.value)
      return now.hour() * 60 + now.minute()
    },
    skyLine(): number[] {
      if (!this.weather.sunrise_1 || !this.weather.sunset_1)
        return [0, 0, 0, 0, 0, 0]
      const sunrise = this.$dayjs(this.weather.sunrise_1, 'HH:mm')
      const sunset = this.$dayjs(this.weather.sunset_1, 'HH:mm')
      const sunriseMinute = sunrise.hour() * 60 + sunrise.minute()
      const sunsetMinute = sunset.hour() * 60 + sunset.minute()
      return [
        sunriseMinute - 15,
        sunriseMinute,
        sunriseMinute + 15,
        sunsetMinute - 15,
        sunsetMinute,
        sunsetMinute + 15
      ]
    },
    bgStyle(): Record<string, string> {
      const line = this.skyLine.map(item => `${(item / 1600) * 100}%`)
      // return { transform: `translateX(-${this.nowMinute * 100}%)` }
      return {
        background: `linear-gradient(90deg, 
        #000 0%, 
        #000 ${line[0]}, 
        #db9627 ${line[1]}, 
        #65a8ff ${line[2]},
        #65a8ff ${line[3]},
        #db9627 ${line[4]},
        #000 ${line[5]})`,
        left: `-${this.nowMinute * 100}%`
      }
    },
    weatherIcon(): { day: string; night: string } {
      return {
        day: weathers[this.weather.daytype],
        night:
          nightWeathers[this.weather.nighttype] ||
          weathers[this.weather.nighttype]
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
    getDayMinute() { },

    async fetchIpInfo() {
      const { city } = await this.$API.Outside.ipInfo()
      this.$global.config.weatherCity = city
    },

    async fetchWeather() {
      this.isLoading = true
      try {
        this.weather = await this.$API.Outside.weather(
          this.$global.config.weatherCity
        )
      } catch (error) {
        this.$message.error('天气获取失败！')
      }

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
  box-sizing: border-box;

  .bg-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .bg {
    position: absolute;
    top: 0;
    left: 0;
    transition: left 0.15s, background 0.15s;
    width: 160000%;
    height: 76px;
    background: linear-gradient(
      90deg,
      #000 0%,
      #db9627 10%,
      #65a8ff 20%,
      #db9627 30%,
      #000 50%
    );
    z-index: -1;
  }

  .sky {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    z-index: 1;
  }

  .weather {
    display: flex;
  }

  .base-info {
    line-height: 1;
    text-align: right;
    text-shadow: 0 0 5px var(--color-bg-1);
    color: var(--app-color-common);
  }

  .wendu {
    font-size: 36px;
  }

  .earth-container {
    position: relative;
    height: calc(100% - 40px);
    width: 100%;
    margin-top: 40px;
    border-radius: 50% 50% 4px 4px;
    background-color: var(--color-bg-3);
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
