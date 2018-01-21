import chalk from "chalk"

export const TYPES = {
    WHITESPACE: "WHITESPACE",
    UNRECOGNISED: "UNRECOGNISED",
    NUMBER: "NUMBER",
    STRING: "STRING",
    STRING_KEY: "STRING_KEY",
    NULL: "NULL",
    BOOLEAN: "BOOLEAN",
    BRACE_START: "BRACE_START",
    BRACE_END: "BRACE_END",
    BRACKET_START: "BRACKET_START",
    BRACKET_END: "BRACKET_END",
    COMMA: "COMMA",
    COLON: "COLON",
    END: "END",
}

export const BRACKET_COLOR = chalk.white
export const COLORS = {
    [TYPES.STRING_KEY]:chalk.hsl(210, 44,47),
    [TYPES.STRING]: chalk.hsl(29,54,61),
    [TYPES.NUMBER]: chalk.hsl(95, 38, 62),
    [TYPES.NULL]:chalk.blue,
    [TYPES.BOOLEAN]:chalk.hsl(207, 82, 66),
    [TYPES.BRACE_START]:BRACKET_COLOR,
    [TYPES.BRACE_END]:BRACKET_COLOR,
    [TYPES.BRACKET_START]:BRACKET_COLOR,
    [TYPES.BRACKET_END]:BRACKET_COLOR,
    ERROR:chalk.underline.red.bold.bgHex("#333")  
}

export const TOKEN_TYPES = [
    { regex: /^\s+/, type: TYPES.WHITESPACE },
    { regex: /^-?\d+(?:\.\d+)?(?:e[+\-]?\d+)?/i, type: TYPES.NUMBER },
    { regex: /^"((?:\\.|[^"])*)"(?=\s*:)/, type: TYPES.STRING_KEY },
    { regex: /^"((?:\\.|[^"])*)"/, type: TYPES.STRING },
    { regex: /^(?:true|false)/, type: TYPES.BOOLEAN },
    { regex: /^null/, type: TYPES.NULL },
    { regex: /^\[/, type: TYPES.BRACKET_START },
    { regex: /^\]/, type: TYPES.BRACKET_END },
    { regex: /^\{/, type: TYPES.BRACE_START },
    { regex: /^\}/, type: TYPES.BRACE_END },
    { regex: /^,/, type: TYPES.COMMA },
    { regex: /^:/, type: TYPES.COLON },
    { regex: /^\w+/, type: TYPES.UNRECOGNISED },
    { regex: /^.+/, type: TYPES.UNRECOGNISED }
]

export class SourceCursor {
    constructor(currentString) {
        this.currentString = currentString
        this.cursor = 0
    }

    matchNextToken() {
        for (let tokenType of TOKEN_TYPES) {
            if (tokenType.regex.test(this.currentString)) {
                let matches = this.currentString.match(tokenType.regex)
                let value = matches[0]

                let token = {
                    type: tokenType.type,
                    value: matches[0],
                    groups: matches.slice(1),
                    cursor: this.cursor
                }

                this.cursor += value.length
                this.currentString = this.currentString.slice(value.length)
                return token
            }
        }
    }

    tokenize() {
        let tokens = []
        do {
            let token = this.matchNextToken()
            if (!token) {
                throw new Error("Could not match a token for " + this.currentString.slice(10))
            }
            tokens.push(token)
        } while (this.currentString.length > 0)
        return tokens
    }
}

export class TokensCursor {
    constructor(tokens){
        this.originalTokens = tokens
        this.tokens = tokens
    }

    take(){
        let token = this.tokens[0]
        this.tokens = this.tokens.slice(1)
        return token
    }

    hasNext(){
        return this.tokens.length > 0
    }

    takeStrictByType(type){
        let token = this.take()
        if(token.type != type){
            let errorMessage = `Expected ${type} but got ${token.type}`
            this.error(token, errorMessage)
            throw new Error(errorMessage)
        }
        return token
    }

    removeTokensByType(type){
        this.tokens = this.tokens.filter((token)=> {
            return token.type != type
        })
    }

    peek(){
        if(this.tokens.length === 0){
            return {
                type:TYPES.END                
            }
        } else {
            return this.tokens[0]
        }
    }

    highlightErrors(){

        return this.highlight(this.erroredTokens)
    }
    highlight(tokens=this.tokens){        
        return tokens.map((token)=> {
            let highlight = COLORS[token.type]
            if(token.error){
                highlight = COLORS.ERROR
            }
            return highlight ? highlight(token.value) : token.value
        }).join("")
    }

    error(erroredToken, errorMessage){
        if(erroredToken.type === TYPES.END){
            this.erroredTokens = this.originalTokens.concat({
                ...erroredToken,
                value:" ",
                error:errorMessage
            })
        } else {
            this.erroredTokens = this.originalTokens.map((token) => {
                if (erroredToken === token) {
                    return {
                        ...token,
                        error: errorMessage
                    }
                }
                return token
            })
        }
        
    }
}

export const JSONParse = (str)=>{
    let tokens = new SourceCursor(str).tokenize()
    let tokensCursor = new TokensCursor(tokens)
    tokensCursor.removeTokensByType(TYPES.WHITESPACE)
    try {
        let value = matchValue(tokensCursor)        
        if(tokensCursor.hasNext()){
            tokensCursor.error(tokensCursor.peek(), "Additional Tokens found")
            throw new Error("Additional tokens found")
        }
        return value
    } catch(e){
        console.log(e.stack)
        console.log(tokensCursor.highlightErrors(), "\n"+chalk.red(e.message))
        // console.error(e)
    }
}

export const matchValue = (tokensCursor)=> {
    let token = tokensCursor.peek()
    switch(token.type){
        case TYPES.BRACE_START:
            return matchObject(tokensCursor)
        case TYPES.BRACKET_START:
            return matchArray(tokensCursor)
        case TYPES.STRING:
            return tokensCursor.take().groups[0]
        case TYPES.NUMBER:
            return Number(tokensCursor.take().value)
        case TYPES.NULL:
            tokensCursor.take()
            return null
        case TYPES.BOOLEAN:
            return tokensCursor.take().value === 'true'
        default:
            tokensCursor.error(token, "Could not match value")
            throw new Error("Could not match value")
    }
}

export const matchObject = (tokensCursor)=> {
    tokensCursor.takeStrictByType(TYPES.BRACE_START)
    let token = tokensCursor.peek()
    let ob = {}
    if (token.type === TYPES.BRACE_END){
        tokensCursor.take()
        return ob
    }

    do {
        let key = tokensCursor.takeStrictByType(TYPES.STRING_KEY)
        tokensCursor.takeStrictByType(TYPES.COLON)
        let value = matchValue(tokensCursor)
        ob[key.groups[0]] = value
        token = tokensCursor.peek()
        if (token.type === TYPES.COMMA) {
            tokensCursor.take()
        } else if (token.type === TYPES.BRACE_END) {
            tokensCursor.take()
            return ob
        } else {
            let errorMessage = `Expected , or }`
            tokensCursor.error(token, errorMessage)
            throw new Error(errorMessage)
        }
    } while(tokensCursor.peek())
}

export const matchArray = (tokensCursor)=> {
    tokensCursor.takeStrictByType(TYPES.BRACKET_START)
    let token = tokensCursor.peek()
    let arr = []
    if(token.type === TYPES.BRACKET_END){
        tokensCursor.take()
        return arr
    }

    do {
        arr.push(matchValue(tokensCursor))
        token = tokensCursor.peek()
        if(token.type === TYPES.COMMA){
            tokensCursor.take()
        } else if(token.type === TYPES.BRACKET_END){
            tokensCursor.take()
            return arr
        } else {
            let errorMessage = `Expected , or ]`
            tokensCursor.error(token, errorMessage)
            throw new Error(errorMessage)
        }
    } while(tokensCursor.peek())
}