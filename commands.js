
const fs = require("fs");

var lineReader = require('line-by-line');


function done(output){
  process.stdout.write(output);
  process.stdout.write('\nprompt >');
}

function evaluateCmd(userInput) {

  const userInputArray = userInput.split(" ");
  const command = userInputArray[0];

  switch (command) {
    case "echo":
      commandLibrary.echo(userInputArray.slice(1).join(" "));
      break;
    case "cat":
      commandLibrary.cat(userInputArray.slice(1));
      break;
    case "head":
      commandLibrary.head(userInputArray.slice(1));
      break;
    case "tail":
      commandLibrary.tail(userInputArray.slice(1));
      break;
    default:
      errorHandler();
  }
}

const errorHandler = function(err){
  if(err) throw err;
    console.log("command not found");
}
const commandLibrary = {
  "echo": function(userInput){
    done(userInput);
  },
  "cat": function(fullPath){
    const fileName = fullPath[0];
    fs.readFile(fileName, (err, data) => {
      if (err) throw err;
      done(data);
    });
  },
  "head": function(fullLine){
    const fileName = fullLine[0];
    let numOfLines = 10;
    let data = [];
    let rl = new lineReader(fileName);

    rl.on('line', function (line) {
        data.push(line);

        if(data.length === numOfLines){
          done(data.join("\n"));
        }
    })
       .on('error', function(e){
         throw e;
       });

   },
  "tail": function(lastLine){
    const fileName = lastLine[0];
    let numOfLines = 10;
    let rl = new lineReader(fileName);
    let data = [];

    rl.on('line', function (line) {
        data.push(line);
    })
    .on('end', function () {
	     done(data.slice(-1 * numOfLines).join("\n"));
    })
    .on('error', function(e){
      throw e;
    });

  }
};
  module.exports.commandLibrary = commandLibrary;
  module.exports.evaluateCmd = evaluateCmd;
