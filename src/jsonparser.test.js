import { SourceCursor, TokensCursor, JSONParse } from "./JSONParse"
import fs from "fs"
import path from "path"
describe("json parser", function () {

    describe("tokenizer", () => {

        it("tokenizes numbers correctly", () => {
            let str = " 12 -12 -12.1222E12 +12.303"
            let tokens = new SourceCursor(str).tokenize()
            expect(tokens).toMatchSnapshot()
        })

        it("tokenizes strings correctly", () => {
            let str = `"\\"" "hello" "hello world"`
            let tokens = new SourceCursor(str).tokenize()
            expect(tokens).toMatchSnapshot()
        })

        it("matches null false true correctly", () => {
            let str = `null false true`
            let tokens = new SourceCursor(str).tokenize()
            expect(tokens).toMatchSnapshot()
        })

        it("matches array syntax", () => {
            let str = `[ 1, "2", 3]`
            let tokens = new SourceCursor(str).tokenize()
            expect(tokens).toMatchSnapshot()
        })

        it("matches object syntax", () => {
            let str = `{"a":1, "b":"c"}`
            let tokens = new SourceCursor(str).tokenize()
            expect(tokens).toMatchSnapshot()
        })
    })

    describe("TokensCursor", () => {
        it("peek take", () => {
            let tokens = new SourceCursor("1false2true").tokenize()
            let tokensCursor = new TokensCursor(tokens)
            expect(tokensCursor.peek().value).toEqual('1')
            expect(tokensCursor.tokens.length).toEqual(4)
            expect(tokensCursor.take().value).toEqual('1')
            expect(tokensCursor.tokens).toMatchSnapshot()
        })

        fit("test highlight", ()=> {
            let str = `{
  "name": "searchkit-starter-react16",
  "version": 1.1,
  "private": true,
  "devDependencies": {
    "enzyme": "^3.1.0",
    "enzyme-adapter-react-16": "^1.0.2",
    "js-beautify": "^1.7.4",
    "raf": "^3.4.0",
    "react-scripts": "^1.0.14"
  },
  "dependencies": {
    "react": "^16.0.0",
    "react-autocomplete": "^1.7.2",
    "react-autosuggest": "^9.3.2",
    "react-dom": "^16.0.0",
    "react-select": "^1.0.0-rc.10",
    "searchkit": "^2.3.0-7"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
`
            let tokens = new SourceCursor(str).tokenize()
            let tokensCursor = new TokensCursor(tokens)
            console.log(tokensCursor.highlight())
        })
    })

    describe("JSONParse", function(){

        it("parses strings", ()=> {
            expect(JSONParse(JSON.stringify("hi"))).toEqual("hi")
        })

        it("parses numbers", () => {
            expect(JSONParse(JSON.stringify(-12.12e12))).toEqual(-12.12e12)
        })

        it("parses null", ()=> {
            expect(JSONParse("null")).toEqual(null)
        })

        it("parses boolean", () => {
            expect(JSONParse("false")).toEqual(false)
        })

        it("handles whitespace", () => {
            expect(JSONParse(" false")).toEqual(false)
        })

        it("parses arrays", () => {
            expect(JSONParse("[]")).toEqual([])
            expect(JSONParse("[1, false, null]")).toEqual([1,false,null])
            // JSONParse("[1,2}")
        })

        it("parses objects", () => {
            expect(JSONParse("{}")).toEqual({})
            let ob = { "a": 1, "b": true, "c": { "d": null } }
            expect(JSONParse(JSON.stringify(ob))).toEqual(ob)
            console.log(JSONParse(`{"a":1}}`))
        })

        fit("parses big object", ()=> {
            let bigJsonStr = fs.readFileSync(path.join(__dirname + "/bigJson.txt")).toString()
            console.log(JSONParse(bigJsonStr))
        })

        // fit("parses additional tokens", ()=> {
        //     console.log(JSONParse(`{"a":2`))
        // })
    })
})