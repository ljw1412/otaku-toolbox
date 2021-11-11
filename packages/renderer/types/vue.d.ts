declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    apiGet: MyFetch
    apiPost: MyFetch
    apiPut: MyFetch
    apiDelete: MyFetch
  }
}

export {}
