import { renderTrendChart } from './trend_chart.mjs'
import { renderPieChart } from './pie_chart.mjs'
import { renderTable } from './table.mjs'
import { fetchJSON } from '../../util/fetch.mjs'
import { globalLoading } from '../../util/loading.mjs'
import {
  getSearchParams,
  addSearchParam,
  removeSearchParam,
} from '../../util/url_search_params.mjs'
import localeEn from '../../util/air_datepicker_en.mjs'

const TOPN = 5

export async function renderOverview() {
  const params = getSearchParams()
  const stop = parseInt(params.stop)
  const start = parseInt(params.start)

  createDatepicker(async (start, stop) => {
    globalLoading.show()
    await updateData(start, stop)
    globalLoading.hide()
  })

  globalLoading.show()
  const [_, similarityData] = await Promise.all([
    updateData(start, stop),
    fetchJSON(`fragments/${params.fid}/logs/similarity`),
  ])
  globalLoading.hide()

  const similarityArr = Object.entries(similarityData)
  if (similarityArr && similarityArr.length) {
    document.querySelector(
      '#similarity_frags',
    ).innerHTML = `Similarity fragments: ${similarityArr
      .map(
        ([k, v]) =>
          `<span>
      <a href="${location.origin}?fid=${k}">${k}</a>(${(v * 100).toFixed(2)}%)
  </span>`,
      )
      .join(', ')}`
  }
}

async function updateData(start, stop) {
  if (start && stop) {
    stop = parseInt(stop)
    start = parseInt(start)
  } else {
    stop = Math.floor(Date.now() / 1000)
    start = stop - 30 * 24 * 60 * 60
  }

  if (start === stop) {
    stop += 1
  }

  const params = getSearchParams()
  const data = await fetchJSON(
    `${start}/${stop}/fragments/${params.fid}/logs/trend`,
  )
  const sortedData = data
    .map((d) => ({
      ...d,
      total: d.points.reduce((prev, current) => prev + current.value, 0),
    }))
    .sort((a, b) => (a.total - b.total > 0 ? -1 : 1))
  const topNData = sortedData.slice(0, TOPN)
  const othersCount = sortedData
    .slice(TOPN)
    .reduce((prev, current) => prev + current.total, 0)

  renderTrendChart(document.querySelector('#trend_chart'), sortedData, topNData)
  renderPieChart(document.querySelector('#pie_chart'), topNData, othersCount)
  renderTable(document.querySelector('#table'), sortedData)
}

function createDatepicker(callback = () => {}) {
  const params = getSearchParams()
  let stop = parseInt(params.stop)
  let start = parseInt(params.start)
  let startPicker, stopPicker

  startPicker = new AirDatepicker('#datepicker_start', {
    locale: localeEn,
    selectedDates: start && [start * 1000],
    maxDate: stop && new Date(stop * 1000),
    autoClose: true,
    timepicker: true,
    onSelect({ date }) {
      if (date) {
        start = (date.getTime() / 1000).toFixed(0)
        addSearchParam('start', start)
      } else {
        start = null
        removeSearchParam('start')
      }
      stopPicker.update({
        minDate: date,
      })

      if ((start && stop) || (!start && !stop)) {
        callback(start, stop)
      }
    },
  })
  stopPicker = new AirDatepicker('#datepicker_end', {
    locale: localeEn,
    selectedDates: stop && [stop * 1000],
    minDate: start && new Date(start * 1000),
    autoClose: true,
    timepicker: true,
    onSelect({ date }) {
      if (date) {
        stop = (date.getTime() / 1000).toFixed(0)
        addSearchParam('stop', stop)
      } else {
        stop = null
        removeSearchParam('stop')
      }
      startPicker.update({
        maxDate: date,
      })

      if ((start && stop) || (!start && !stop)) {
        callback(start, stop)
      }
    },
  })

  document.querySelector('#clean_datepicker').addEventListener('click', () => {
    startPicker.clear()
    stopPicker.clear()
  })
}
