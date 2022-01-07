import { fetchJSON } from '../../util/fetch.mjs'
import { getSearchParams } from '../../util/url_search_params.mjs'
import { globalLoading } from '../../util/loading.mjs'
import { renderTrendChart } from './trend_chart.mjs'
import { renderTable } from './table.mjs'
import { renderPieChart } from './pie_chart.mjs'

export async function renderEventList() {
  let start, stop
  const params = getSearchParams()
  const fid = params.fid

  if (params.start && params.stop) {
    start = parseInt(params.start)
    stop = parseInt(params.stop)
  } else {
    stop = Math.floor(Date.now() / 1000)
    start = stop - 30 * 24 * 60 * 60
  }

  globalLoading.show()
  const [data, threshold, changepoints, { logs, stats }] = await Promise.all([
    fetchJSON(
      `${start}/${stop}/fragments/${fid}/logs/trend?events=${params.eid}`,
    ),
    fetchJSON(`fragments/${fid}/events/${params.eid}/logs/threshold`),
    fetchJSON(`fragments/${fid}/events/${params.eid}/logs/changepoints`),
    fetchJSON(`${start}/${stop}/fragments/${fid}/events/${params.eid}/logs`),
  ])
  globalLoading.hide()

  const filteredStats = Object.entries(stats).filter(
    ([k, v]) => v > 1 && v < 10,
  )
  if (filteredStats.length) {
    const statsDetail = await Promise.all(
      filteredStats.map(([k, v]) => {
        return fetchJSON(
          `${start}/${stop}/fragments/${fid}/events/${params.eid}/fields/${k}/logs/stats`,
        ).then((d) => ({ key: k, data: d }))
      }),
    )

    const fragment = document.createDocumentFragment()
    statsDetail.forEach((d) => {
      const div = document.createElement('div')
      div.classList.add('col-3')
      const c = document.createElement('canvas')
      c.id = d.key

      div.appendChild(c)
      fragment.appendChild(div)
    })
    document.querySelector('#pie_chart').appendChild(fragment)
    statsDetail.forEach((d) => {
      console.log(d)
      renderPieChart(document.querySelector(`#${d.key}`), d.key, d.data)
    })
  }

  renderTrendChart(
    document.querySelector('#trend_chart'),
    data[0],
    threshold,
    changepoints,
  )
  renderTable(document.querySelector('#table'), logs)
}
