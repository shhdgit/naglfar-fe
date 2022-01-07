import { Grid, h } from '//unpkg.com/gridjs?module'

export function renderTable(dom, data) {
  return new Grid({
    columns: ['Level', 'Message', 'Time', 'Fields'],
    search: true,
    data: data.map((d) => [
      d.level,
      d.message,
      new Date(d.timestamp * 1000).toString(),
      h(
        'pre',
        {},
        Object.entries(d)
          .filter(([k, v]) => k.startsWith('f_'))
          .map(([k, v]) => `${k.split(/^f_/)[1]}=${v}`)
          .join('\n=============================\n'),
      ),
    ]),
    pagination: {
      enabled: true,
      limit: 5,
    },
  }).render(dom)
}
