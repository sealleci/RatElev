const os = require('os')
const fs = require('fs')
const readln = require('readline')
const output_name = './dist/rat_elev.html'
const main_html_file_name = './index.html'
const css_file_name = './css/style.css'
const js_file_name = './js/elev.js'

function checkSourceFilesIntegrity() {
    try {
        return fs.existsSync(main_html_file_name) &&
            fs.existsSync(css_file_name) &&
            fs.existsSync(js_file_name)
    } catch (err) {
        return false
    }
}

const lineReader = readln.createInterface({
    input: fs.createReadStream(main_html_file_name)
})

function main() {
    try {
        if (!checkSourceFilesIntegrity()) {
            console.log('file lost')
            return
        }
        let encode = 'utf-8'
        let css_file = fs.readFileSync(css_file_name, encode)
        let js_file = fs.readFileSync(js_file_name, encode)
        let is_skip = false
        fs.writeFileSync(output_name, '', { encoding: encode, flag: 'w' })
        let output_file = fs.openSync(output_name, 'r+')
        lineReader.on('line', (line) => {
            if (is_skip) {
                is_skip = false
                return
            }
            switch (line.trim()) {
                case '<!-- CSS -->':
                    fs.writeSync(output_file, '<style type="text/css">' + os.EOL)
                    fs.writeSync(output_file, css_file)
                    fs.writeSync(output_file, '</style>' + os.EOL)
                    is_skip = true
                    break
                case '<!-- JS -->':
                    fs.writeSync(output_file, '<script>' + os.EOL)
                    fs.writeSync(output_file, js_file)
                    fs.writeSync(output_file, '</script>' + os.EOL)
                    is_skip = true
                    break
                default:
                    fs.writeSync(output_file, line + os.EOL)
                    break
            }
        })
        console.log('exec success')
    } catch (err) {
        console.log('exec fail')
    }
}

main()