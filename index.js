let amqp = require('amqplib/callback_api');
let mysql = require('mysql');

let con = mysql.createConnection({
  host: "77.55.208.10",
  user: "michalz",
  password: "michalz-pass",
  database: "industry4medical"
});

function insertUserData(userID, sleepData){
  let data_to_insert = [userID, sleepData];
  let insert_statement = "INSERT INTO tbl_user_sleep_data (user_id, sleep_data) VALUES (?, ?);"

  con.query(insert_statement, data_to_insert, (err, results, fields) =>{
    if (err){
      return console.error(err.message);
    }
  });
}

function sendDataToDb(msg_recieved){
  let recievedJSON = JSON.parse(msg_recieved);
  let userID = recievedJSON.userID.toString();

  delete recievedJSON.userID;

  let sleepData = JSON.stringify(recievedJSON);
  insertUserData(userID, sleepData);
}


amqp.connect('amqp://admin:medical-pass@77.55.208.10:5672', function(error0, connection) 
{
  if (error0) 
  {
      throw error0;
  }
        
  connection.createChannel(function(error1, channel) {
    if (error1) 
    {
        throw error1;
    }
  
    const queue = 'Smartwatch';
          
    channel.assertQueue(queue, {durable: false});
          
      channel.consume(queue, function(msg) {
        if (msg !== null) {
          try{
          sendDataToDb(msg.content.toString());
          channel.ack(msg);
          }catch (error){
            console.log(error);
          }
        }
      });
  });
});
