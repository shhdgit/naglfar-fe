import { Grid, h } from '//unpkg.com/gridjs?module'
import { getSearchParams } from '../../util/url_search_params.mjs'

export function renderTable(dom, data) {
  const params = getSearchParams()
  return new Grid({
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
              onClick: () =>
                (location.href = `/detail.html?fid=${params.fid}&eid=${row.cells[0].data}`),
            },
            'Details',
          )
        },
      },
    ],
    search: true,
    data: data.map((d) => [d.event_id, d.name, d.total]),
    pagination: {
      enabled: true,
      limit: 5,
    },
  }).render(dom)
}
