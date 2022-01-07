import { Grid, h } from '//unpkg.com/gridjs?module'
import { getSearchParams } from '../../util/url_search_params.mjs'

let table

export function renderTable(dom, data) {
  const params = getSearchParams()
  const _data = data.map((d) => [d.event_id, d.name, d.total])

  if (table) {
    table
      .updateConfig({
        data: _data,
      })
      .forceRender()

    return table
  }

  table = new Grid({
    columns: [
      'Event ID',
      'Event Name',
      'Count',
      {
        name: 'Actions',
        formatter: (cell, row) => {
          return h(
            'button',
            {
              className: 'btn btn-light',
              onClick: () => {
                const params = getSearchParams()
                let date = ''
                if (params.start && params.stop) {
                  date = `&start=${params.start}&stop=${params.stop}`
                }
                location.href = `/detail.html?fid=${params.fid}&eid=${row.cells[0].data}${date}`
              },
            },
            'Details',
          )
        },
      },
    ],
    search: true,
    data: _data,
    pagination: {
      enabled: true,
      limit: 5,
    },
  })
  table.render(dom)
  return table
}
