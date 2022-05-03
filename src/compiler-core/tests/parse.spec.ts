import { NodeTypes } from "../src/ast";
import { baseParse } from "../src/parse";

describe("Parse", ()=>{
	describe("interpolatio", ()=>{
		test("simple interpolatio", ()=>{
			const ast = baseParse("{{ message }}");
			// root
			expect(ast.children[0]).toStrictEqual({
				type: NodeTypes.INTERPOLATION,
				content: {
					type: NodeTypes.SIMPLE_EXPRESSION,
					content: "message"
				}
			});
		})
	})
})