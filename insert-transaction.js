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
  return new Promise((resolve, reject) => {
    const params = {
      TransactItems: items.map((item) => ({
        Put: {
          TableName: tableName,
          Item: item,
        },
      })),
    };

    dynamoDb.transactWriteItems(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        console.log(`Inserted ${items.length} items`);
        resolve();
      }
    });
  });
}
