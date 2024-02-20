const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  accessKeyId: "accessKeyId",
  secretAccessKey: "secretAccessKey",
  endpoint: "http://localhost:8000",
});

const dynamoDb = new AWS.DynamoDB();

const tableName = "BaseballStats";

getGame("LAA", "20190420")
  .then((game) => {
    console.log(JSON.stringify(game));
  })
  .catch((err) => console.error("Get failed", err));

getGames("LAA", "20190401", "20190501", "SEA")
  .then((games) => {
    console.log(JSON.stringify(games));
  })
  .catch((err) => console.error("Get failed", err));

function getGame(teamID, gameDate) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: tableName,
      Key: {
        TeamID: { S: `GAMES_${teamID}` },
        SK: { S: gameDate },
      },
    };

    dynamoDb.getItem(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Item);
      }
    });
  });
}

function getGames(teamID, startDate, endDate, opponent) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: tableName,
      KeyConditionExpression:
        "TeamID = :teamID AND SK BETWEEN :startDate AND :endDate",
      ExpressionAttributeValues: {
        ":teamID": { S: `GAMES_${teamID}` },
        ":startDate": { S: startDate },
        ":endDate": { S: endDate },
        ":opponent": { S: opponent },
      },
      FilterExpression: "OpposingTeamID = :opponent",
    };

    dynamoDb.query(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Items);
      }
    });
  });
}
