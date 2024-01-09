
export class Mail{
    cc = ''
    constructor(from, to, subject,message, html){
        this.from = from
        this.to = to
        this.subject = subject
        this.body = message
        this.html = html
    }
    setCC(cc){
        this.cc = cc
    }
}