// Cada sitio manda sólo datos a /mail/form: el remitente, a quién le llega y cómo se ve el mail se definen acá.
// Así nadie puede usar la API para mandar HTML propio ni elegir remitente o destinatario.
// Desde `testing` el aviso le llega sólo a Agustín, para que las pruebas no le lleguen al cliente.
export const CC_AGUS = 'agus.narvaez@outlook.com'

export const SITES = {
  mendezprop: {
    from: 'no_reply@mendezprop.com.ar',
    to: 'mendezprop.inmobiliaria@gmail.com',
    cc: CC_AGUS,
    url: 'https://mendezprop.com.ar',
    testing: 'https://mendez-prop-testing.bapps.com.ar',
    origins: ['https://mendezprop.com.ar', 'https://www.mendezprop.com.ar'],
    greeting: 'Hola!',
    confirm: true,
    colors: { bg: '#475838', fg: '#9D9480' },
    logos: [
      'https://mendezprop.com.ar/assets/logos/mendez-prop-logo.svg',
      'https://mendezprop.com.ar/assets/logos/mendez-prop-logo-text.svg',
    ],
  },
  pauladallochio: {
    from: 'no_reply@pauladallochio.com.ar',
    to: 'info@pauladallochio.com.ar',
    cc: CC_AGUS,
    url: 'https://www.pauladallochio.com.ar',
    testing: 'https://pau-dallochio-testing.bapps.com.ar',
    origins: ['https://pauladallochio.com.ar', 'https://www.pauladallochio.com.ar'],
    greeting: 'Hola Paula!',
    confirm: true,
    colors: { bg: '#FFFFF0', fg: '#9D9480' },
    logos: ['https://pauladallochio.com.ar/assets/logos/logo-header.png'],
  },
  veritokillian: {
    from: 'no_reply@veritokillian.ar',
    to: 'inmobiliaria@veritokillian.ar',
    cc: CC_AGUS,
    url: 'https://www.veritokillian.ar',
    testing: 'https://vero-killian-testing.bapps.com.ar',
    origins: ['https://veritokillian.ar', 'https://www.veritokillian.ar'],
    greeting: 'Hola Vero!',
    confirm: true,
    colors: { bg: '#475838', fg: '#9D9480' },
    logos: ['https://veritokillian.ar/assets/logos/logo-footer.webp'],
  },
  bapps: {
    from: 'no_reply@bapps.com.ar',
    to: CC_AGUS,
    url: 'https://bapps.com.ar',
    testing: 'https://bapps-front-testing.bapps.com.ar',
    origins: [
      'https://bapps.com.ar',
      'https://www.bapps.com.ar',
      'https://bapps-803f0.web.app',
      'https://bapps-803f0.firebaseapp.com',
    ],
    greeting: 'Hola!',
    confirm: false,
    colors: { bg: '#FFFFFF', fg: '#333333' },
    logos: [],
  },
  azimap: {
    from: 'noreply@azimap.bapps.com.ar',
    to: CC_AGUS,
    url: 'https://azimap.bapps.com.ar',
    testing: 'https://azimap-testing.bapps.com.ar',
    origins: ['https://azimap.bapps.com.ar'],
    greeting: 'Hola!',
    confirm: false,
    colors: { bg: '#FFFFFF', fg: '#333333' },
    logos: [],
  },
}
