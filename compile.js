function lexer(input) {
  const tokens = [];
  let cursor = 0;

  while (cursor < input.length) {
    let char = input[cursor];
    //skip whitespace characters
    if (/\s/.test(char)) {
      cursor++;
      continue;
    }

    if (/[a-zA-Z]/.test(char)) {
      let word = "";
      while (/[a-zA-Z0-9]/.test(char)) {
        word += char;
        char = input[++cursor];
      }
      if (word === "consider" || word === "print") {
        tokens.push({
          type: "keyword",
          value: word,
        });
      } else {
        tokens.push({
          type: "identifer",
          value: word,
        });
      }
      continue;
    }
    if (/[0-9]/.test(char)) {
      let num = "";
      while (/[0-9]/.test(char)) {
        num += char;
        char = input[++cursor];
      }
      tokens.push({
        type: "number",
        value: parseInt(num),
      });
      continue;
    }
    if (/[\+\-\*\/=]/.test(char)) {
      tokens.push({
        type: "operator",
        value: char,
      });
      cursor++;
      continue;
    }
  }
  return tokens;
}

function parser(tokens) {
  const ast = {
    type: "Program",
    body: [],
  };
  while (tokens.length > 0) {
    let token = tokens.shift();
    // check for keywords
    if (token.type === "keyword" && token.value === "consider") {
      let declaration = {
        type: "Declaration",
        name: tokens.shift().value,
        value: null,
      };
      // check for assignment
      if (tokens[0].type === "operator" && tokens[0].value === "=") {
        tokens.shift();
        let expression = "";
        while (tokens.length > 0 && tokens[0].type != "keyword") {
          expression += tokens.shift().value;
        }
        declaration.value = expression.trim();
      }
      ast.body.push(declaration);
    }
    if( token.type=== "keyword" && token.value === "print"){
        ast.body.push({
            type: 'Print',
            expression: tokens.shift().value
        })
    }
  }
  return ast;
} 

function codeGen(node){
  switch(node.type){
    case 'Program': return node.body.map(codeGen).join('\n');
    case 'Declaration': return `let ${node.name} = ${node.value};`;
    case 'Print': return `console.log(${node.expression})`
  }

}
function compiler(input) {
  const tokens = lexer(input);
  //create a abstract syntax tree
  const ast = parser(tokens);
  const executableCode = codeGen(ast);
  return executableCode;
}

function runner(input){
  eval(input)
}

const code = `
consider x = 10
consider y = 20

consider sum = x + y
print sum
`;
const exec = compiler(code);
runner(exec)