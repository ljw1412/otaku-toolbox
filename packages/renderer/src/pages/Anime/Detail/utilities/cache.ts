import { reactive } from 'vue'
import $API from '/@/apis'

interface BangumiLoader {
  loading: boolean
  info: FormatedBangumiBasic
}

const cache = reactive({
  bangumi: {} as Record<string, BangumiLoader>,
  episodesInfo: {} as Record<string, EpisodesInfo>,
  episodes: {} as Record<string, Episode>,
  character: {} as Record<string, Character[]>,
  relation: {} as Record<string, BangumiBasic[]>,
  statusCount: {} as Record<string, { _id: number; count: number }[]>,
  reviewStats: {} as Record<string, { score: number; count: number }[]>
})

export default cache

export async function fetchBangumiInfo(bid: string) {
  if (cache.bangumi[bid] && cache.bangumi[bid].info._id) {
    return cache.bangumi[bid]
  }
  cache.bangumi[bid] = { loading: false, info: {} as FormatedBangumiBasic }
  const info = await $API.Bangumi.showBangumi(bid, { mode: 'simple' })
  cache.bangumi[bid].info = info
  cache.bangumi[bid].loading = true
  return cache.bangumi[bid]
}

export async function fetchEpisodeInfo(bid: string) {
  if (cache.episodesInfo[bid]) {
    return cache.episodesInfo[bid]
  }
  const info = await $API.Episode.showEpisodeInfo(bid)
  info.episodeList.forEach((episode) => {
    episode.airDate = new Date(episode.airDate)
  })
  cache.episodesInfo[bid] = info
  return cache.episodesInfo[bid]
}

export async function fetchCharacterList(bid: string) {
  if (cache.character[bid]) {
    return cache.character[bid]
  }
  const { characterList } = await $API.Character.listCharacter(bid)
  cache.character[bid] = characterList
  return cache.character[bid]
}

export async function fetchMediaRelations(bid: string) {
  if (cache.relation[bid]) {
    return cache.relation[bid]
  }
  const list = await $API.Series.showSeries(bid)
  const relation = list[0]
  if (relation) {
    cache.relation[bid] = relation.bangumis.filter((item) => item._id !== bid)
  }
  return cache.relation[bid] || []
}

export async function fetchStatusCount(bid: string) {
  if (cache.statusCount[bid]) {
    return cache.statusCount[bid]
  }
  const list = await $API.Favourite.getAmountStatus(bid)
  cache.statusCount[bid] = list
  return cache.statusCount[bid]
}

export async function fetchReviewStats(bid: string) {
  if (cache.reviewStats[bid]) {
    return cache.reviewStats[bid]
  }
  const list = await $API.Review.stats(bid)
  cache.reviewStats[bid] = list
  return cache.reviewStats[bid]
}

export async function fetchOneEpisode(epId: string) {
  if (cache.episodes[epId]) {
    return cache.episodes[epId]
  }
  const list = await $API.Episode.showOneEpisode(epId)
  cache.episodes[epId] = list
  return cache.episodes[epId]
}
