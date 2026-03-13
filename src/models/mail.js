export class Mail {
    constructor({ from, to, subject, message, html, cc = null }) {
        this.from = from
        this.to = to
        this.subject = subject
        this.body = message
        this.html = html
        this.cc = cc || null
    }

    static fromRequest(body) {
        return new Mail(body)
    }
}