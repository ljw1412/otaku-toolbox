<template>
  <a-modal
    v-model:visible="mVisible"
    simple
    title="天气位置"
    width="480px"
    modal-class="home-weather-location"
    @before-open="handleBeforeOpen"
  >
    <template #title>
      <div class="location-title">
        <div>天气位置</div>
        <a-divider direction="vertical" />
        <a-tabs v-model:active-key="tab" type="capsule">
          <a-tab-pane key="china" title="国内"></a-tab-pane>
          <a-tab-pane key="external" title="海外"></a-tab-pane>
        </a-tabs>
      </div>
    </template>
    <a-cascader-panel v-model="city" :options="options" expand-child />
    <template #footer>
      <div class="layout-lr w-100">
        <div>
          当前城市：<span class="text-color-common">{{ current }}</span>
        </div>
        <a-space>
          <a-button @click="mVisible = false">取消</a-button>
          <a-button type="primary" @click="save">保存</a-button>
        </a-space>
      </div>
    </template>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeWeatherLocation',

  props: {
    visible: Boolean
  },

  emits: ['update:visible', 'change'],

  data() {
    return {
      tab: 'china',
      city: '{}',
      cities: {
        china: {} as Record<string, any>,
        external: {} as Record<string, any>
      }
    }
  },

  computed: {
    mVisible: {
      get() {
        return this.visible
      },
      set(val: boolean) {
        this.$emit('update:visible', val)
      }
    },

    options() {
      if (this.tab === 'china') {
        const provinces = this.cities.china
        return Object.keys(provinces).map((key) => {
          const cities = provinces[key]
          return {
            label: key,
            value: `0-${key}`,
            children: Object.keys(cities).map((city) => {
              const districts = cities[city]
              return {
                label: city,
                value: `1-${city}`,
                children: Object.keys(districts).map((district) => {
                  return {
                    label: district,
                    value: JSON.stringify(districts[district])
                  }
                })
              }
            })
          }
        })
      } else {
        const countries = this.cities.external
        return Object.keys(countries).map((country) => {
          const cities = countries[country]
          return {
            label: country.replace('（所属国家不一致，经纬度却一致）', ''),
            value: `0-${country}`,
            children: Object.keys(cities).map((city) => {
              return {
                label: city,
                value: JSON.stringify({ AREAID: cities[city], NAMECN: city })
              }
            })
          }
        })
      }
    },

    current() {
      try {
        const city = JSON.parse(this.city)
        return city.NAMECN
      } catch (error) {
        return ''
      }
    }
  },

  methods: {
    async fetchCityList(isChina = true) {
      if (isChina && Object.keys(this.cities.china).length) return
      if (!isChina && Object.keys(this.cities.external).length) return
      const cities = await this.$API.Outside.weatherCityList(isChina)
      if (isChina) {
        this.cities.china = cities
      } else {
        this.cities.external = cities
      }
    },

    async handleBeforeOpen() {
      const city = this.$global.config.weather
      if (typeof city === 'object') {
        this.city = JSON.stringify({ AREAID: city.cityId, NAMECN: city.city })
      }
      this.fetchCityList()
      this.fetchCityList(false)
    },

    save() {
      const { AREAID = '', NAMECN = '' } = JSON.parse(this.city)
      this.$emit('change', { cityId: AREAID, city: NAMECN })
      this.mVisible = false
    }
  }
})
</script>

<style lang="scss">
.home-weather-location {
  .location-title {
    display: flex;
    align-items: center;
    width: 100%;

    .arco-tabs-content {
      display: none;
    }
  }
}
</style>
