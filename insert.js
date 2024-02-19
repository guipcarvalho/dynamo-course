const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  accessKeyId: "accessKeyId",
  secretAccessKey: "secretAccessKey",
  endpoint: "http://localhost:8000",
});

const dynamoDb = new AWS.DynamoDB();

const tableName = "BaseballStats";

//Load the data
const teams = require("./data/teams.json");
const players = require("./data/players.json");
const games = require("./data/games.json");

putItems(teams)
  .then(() => putItems(players))
  .then(() => putItems(games))
  .catch((err) => console.error("Insert failed", err));

function putItems(items) {
  let insertedCount = 0;

  return new Promise((resolve, reject) => {
    items.forEach((item) => {
      const params = {
        TableName: tableName,
        Item: item,
      };

      dynamoDb.putItem(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          insertedCount++;
          if (insertedCount === items.length) {
            resolve();
          }
        }
      });
    });
  });
}
