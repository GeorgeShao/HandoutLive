const rewire = require("rewire")
const index = rewire("./index")
const getDefaultState = index.__get__("getDefaultState")
// @ponicode
describe("getDefaultState", () => {
    test("0", () => {
        let callFunction = () => {
            getDefaultState()
        }
    
        expect(callFunction).not.toThrow()
    })
})
