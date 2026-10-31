import { Mail } from '../models/mail.js'

const ENTIDADES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

// Todo lo que llega del formulario se muestra como texto, nunca como HTML.
export const escapeHtml = (valor) => String(valor).replace(/[&<>"']/g, (c) => ENTIDADES[c])

// El asunto va en un header: sin saltos de línea.
const enUnaLinea = (valor) => String(valor).replace(/\s+/g, ' ')

const conSaltos = (valor) => escapeHtml(valor).replace(/\r?\n/g, '<br>')

// El link sólo puede apuntar a una página del propio sitio (ej. /catalogo/123).
const linkDelSitio = (site, path) => {
  if (!path) return null
  const url = new URL(path, site.url)
  return url.origin === new URL(site.url).origin ? url.href : null
}

const layout = (site, contenido) => {
  const { bg, fg } = site.colors
  const logos = site.logos
    .map((src) => `<img src="${src}" alt="Logo" style="width: 100px; height: auto;" />`)
    .join('\n')

  return `
<body style="width:100%; height: 100%; background-color: ${bg}; font-size: 10px; padding: 5% 0;">
  <div style="padding: 0 5%; font-size: 12px; color: ${fg};">
    ${contenido}
  </div>
  ${logos ? `<div style="background-color: ${bg}; text-align: center; padding: 10px;">${logos}</div>` : ''}
</body>`
}

const filas = (datos) =>
  datos
    .filter(([, valor]) => valor)
    .map(([label, valor]) => `<p><strong>${escapeHtml(label)}:</strong> ${conSaltos(valor)}</p>`)
    .join('\n')

export const buildFormMails = (site, form) => {
  const { name, email, phone, subject, message, fields = [], link } = form
  const href = linkDelSitio(site, link)
  const datos = [['Email', email], ['Teléfono', phone], ...fields.map((f) => [f.label, f.value])]

  const html = layout(
    site,
    `<h1 style="font-size: 15px;">${escapeHtml(site.greeting)} - Tenés un nuevo mensaje${name ? ` de ${escapeHtml(name)}` : ''}</h1>
    <h2 style="font-size: 12px;">${escapeHtml(subject)}</h2>
    ${message ? `<p>${conSaltos(message)}</p>` : ''}
    ${filas(datos)}
    ${href ? `<p><a href="${escapeHtml(href)}" style="color: ${site.colors.fg};">Ver publicación</a></p>` : ''}`,
  )

  const texto = [
    name ? `Nuevo mensaje de ${name}` : 'Nuevo mensaje',
    subject,
    message,
    ...datos.filter(([, v]) => v).map(([l, v]) => `${l}: ${v}`),
    href,
  ]
    .filter(Boolean)
    .join('\n')

  const notification = new Mail({
    from: site.from,
    to: site.to,
    cc: site.cc,
    replyTo: email,
    subject: enUnaLinea(name ? `Nuevo mensaje de ${name} - ${subject}` : subject),
    message: texto,
    html,
  })

  if (!site.confirm || !email) return [notification]

  const confirmation = new Mail({
    from: site.from,
    to: email,
    subject: enUnaLinea(`Solicitud de información - ${subject}`),
    message: 'Gracias por contactarte con nosotros, en breve nos pondremos en contacto con vos.',
    html: layout(
      site,
      `<h1 style="font-size: 15px;">Hola${name ? ` ${escapeHtml(name)}` : ''}! - Gracias por contactarte con nosotros</h1>
      <h2 style="font-size: 12px;">Tu consulta sobre ${escapeHtml(subject)} ya fue enviada</h2>
      <p>Te estaremos contestando a la brevedad</p>`,
    ),
  })

  return [notification, confirmation]
}
