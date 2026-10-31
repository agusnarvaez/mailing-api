export class Mail {
    constructor({ from, to, subject, message, html, cc = null, replyTo = null }) {
        this.from = from
        this.to = to
        this.subject = subject
        this.body = message
        this.html = html
        this.cc = cc || null
        this.replyTo = replyTo || null
    }

    static fromRequest(body) {
        return new Mail(body)
    }
}
