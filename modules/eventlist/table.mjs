import { Grid, h } from '//unpkg.com/gridjs?module'

export function renderTable(dom, data) {
  return new Grid({
    columns: ['Level', 'Message', 'Time'],
    search: true,
    data: data.map((d) => [
      d.level,
      d.message,
      new Date(d.timestamp * 1000).toString(),
    ]),
    pagination: {
      enabled: true,
      limit: 5,
    },
  }).render(dom)
}
