var express = require('express');
var router = express.Router();

// Create Connection to MySQL
connection = require('../models/mysql.js')();

// Catch data from Database and output console
connection.query('select * from messages', function(err, results, fields){
		// output results		
		console.log('Connection Test to MySQL from messages in index.js');
		console.log('---results---');
		console.log(results);
		console.log('---result end---');
		//console.log('---fields---');
		//console.log(fields);
		//console.log('---fields end---');
});

// Catch data from Database and output console
connection.query('select * from users', function(err, results, fields){
	// output results		
	console.log('Connection Test to MySQL from users in index.js');
	console.log('---results---');
	console.log(results);
	console.log('---result end---');
	//console.log('---fields---');
	//console.log(fields);
	//console.log('---fields end---');
});

//--- Routing of browser ---//

var loginCheck = function(req, res, next){
    
  if(req.session.user){
      console.log('red if');
    next();
  } else {
      console.log('rredirect login');
    res.redirect('/login');
  }
};

// output console request
var output = function(req, res, next){
	/*console.log('--- variable req ---');
	console.log(req);
	console.log('--- end req ---');*/

	console.log('--- variable req.body ---');
	console.log(req.body);
	console.log('--- end req.body ---');

	next();
};

// チャット画面をrend
router.get('/', output, loginCheck, function(req, res) {
    console.log("debug on /");
    console.log(req.session.user);
    res.render('index', { user: req.session.user });
});

// ログイン処理を行うlogin.html
router.get('/login', output, function(req, res){
    
    console.log("debug on /login");
    console.log(req.session.user);
    
    
    if(req.session.user){
        console.log('session redirect!');
        res.redirect('/');
    }
    else{
        res.render('login', {err: ''});
    }
});

// browser用のログイン処理
router.post('/login', output, function(req, res){
	
	connection.query('select * from users where (name = ?) and (password = ?)', [req.body.name, req.body.password], function(err, results){

        if(err){
           // エラー時の処理
            console.log(err);
        }
	// ユーザー名とパスワードが一致(resultsに値が格納されている)
         if(results.toString() !== ''){
             req.session.user = req.body.name;
             res.redirect('/');
         } else {
             res.render('login', {err: ' has-error'});
         }
         
        console.log("--- results of login ---");
        console.log(results);
        console.log("--- end results ---");
    });
});

// ユーザーの登録を行うPOSTの処理
router.post('/add', output, function(req, res){

  /* mysql */
  connection.query('insert into users(name, password) values(?, ?)', [req.body.name, req.body.password], function(err, results){
      if(err){
        // エラー時の処理
        console.log(err);
        res.redirect('back');
      } else {
          // セッションも一緒に送る
          req.session.user = req.body.name;
          res.redirect('/');
      }
  });
});

router.get('/logout', output, function(req, res){
  req.session.destroy();
  console.log('deleted session');
  res.redirect('/');
});


// Routing of Application

// アカウント登録
router.post('/appCreate', output, function(req, res) {
	// output request data
	console.log(req.body);
    var name = req.body.name;
    var password = req.body.password;
   
    connection.query('insert into users(name, password) values(?, ?)', [name, password], function(err, results){
		// output variable err
		console.log('--- err ---');
		console.log(err);
		console.log('--- err end ---');

		// output variable results
		console.log('--- results ---');
		console.log(results);	

		var checkResult = function(re, er){
            if(er){
                return false;   
            }
            console.log('--- r ---');
		console.log(r);	
		console.log('--- r end ---');
		console.log('--- r.toString ---');
		console.log(r.toString());
		console.log('--- r.toString end ---');
			if(r.toString() !== ''){
				console.log('in if');
				return true;
			} else {
				console.log('in else');
				return false;
			}
		};

		var response = {
			"result": r = checkResult(results, err),
			"err": !r ? "cannot create new account" : null
		};
        
		req.session.user = req.body.name;
		res.send(response);
    });
});

// Login for application
router.post('/appLogin', output, function(req, res){
	var name = req.body.name;
	var password = req.body.password;
	console.log('name : ' + name);
	console.log('password : ' + password);

	connection.query('select * from users where (name = ?) and (password = ?)', [name, password], function(err, results){
		// output variable err
		console.log('--- err ---');
		console.log(err);
		console.log('--- err end ---');
        
        
        
		var checkResult = function(re, er){
            if(er){
                return false;
            }
		console.log('--- r ---');
		console.log(r);	
		console.log('--- r end ---');
		console.log('--- r.toString ---');
		console.log(r.toString());
		console.log('--- r.toString end ---');
			if(r.toString() !== ''){
				console.log('in if');
				return true;
			} else {
				console.log('in else');
				return false;
			}
		};

		var response = {
			"result": r = checkResult(results, err),
			"err": !r ? "cannot login" : null
		};
        
		req.session.user = req.body.name;
		res.send(response);
	});
    
});

// セッションのチェック
router.get('/checkSession', output, function(req, res){
	console.log("checkSessionにGETされました。");

	console.log("--- req ---");
	//console.log(req);
	console.log("--- end req ---");
	
	console.log("--- res ---");
	//console.log(res);
	console.log("--- end res ---");
    
    console.log("--- req.headers ---");
	console.log(req.headers);
	console.log("--- end req.headers ---");

    console.log("--- req.headers.sessionid ---");
    console.log(req.headers.sessionid);
    console.log("--- end req.headers.sessionid ---");

   	if(req.headers.sessionid){
		console.log("trueを送信します.");
		// セッションが有効
		res.send({"result": true});
	} 
	else {
		console.log("falseを送信します.");
		// セッションが無効
		res.send({"result": false});
	}	
});

// ログアウト
router.get('/appLogout', output, function(req, res){
  req.session.destroy();
  console.log('deleted session');
  // セッションを無効にしたことを通知
  var response = {
    "result": true
  };
  res.send(response);
});

module.exports = router;
