import { renderTrendChart } from './trend_chart.mjs'
import { renderPieChart } from './pie_chart.mjs'
import { renderTable } from './table.mjs'
import { fetchJSON } from '../../util/fetch.mjs'
import { globalLoading } from '../../util/loading.mjs'
import { getSearchParams } from '../../util/url_search_params.mjs'
import localeEn from '../../util/air_datepicker_en.mjs'

const TOPN = 5

export async function renderOverview() {
  const params = getSearchParams()
  const stop = parseInt(params.stop) * 1000 || Math.floor(Date.now() / 1000)
  const start = parseInt(params.start) * 1000 || stop - 30 * 24 * 60 * 60

  globalLoading.show()
  const [data, similarityData] = await Promise.all([
    fetchJSON(`${start}/${stop}/fragments/${params.fid}/logs/trend`),
    fetchJSON(`fragments/${params.fid}/logs/similarity`),
  ])
  globalLoading.hide()

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

  const similarityArr = Object.entries(similarityData)
  if (similarityArr && similarityArr.length) {
    document.querySelector('#similarity_frags').innerHTML = similarityArr
      .map(
        ([k, v]) =>
          `<span>
      <a href="${location.origin}?fid=${k}">${k}</a>(${(v * 100).toFixed(2)}%)
  </span>`,
      )
      .join(', ')
  }

  // createDatepicker()
  renderTrendChart(document.querySelector('#trend_chart'), sortedData, topNData)
  renderPieChart(document.querySelector('#pie_chart'), topNData, othersCount)
  renderTable(document.querySelector('#table'), sortedData)
}

function createDatepicker() {
  new AirDatepicker('#datepicker', {
    locale: localeEn,
    autoClose: true,
    range: true,
    multipleDatesSeparator: ' - ',
    timepicker: true,
  })
}
