Archery Server
==============

Event List
--------------

__Event Name__ : send  
__Emit__ : emit from client  
__On__ : handle on server  
__Type__ : Object  
__Data Format__ : `{ “name” : string, “message” : string }`  
__Description__ : send inputed data to server and insert database.  

---

__Event Name__ : receive  
__Emit__ : emit from server  
__On__ : handle on client  
__Type__ : Object  
__Data Format__ : `{ “id” : int, “name” : string, “message” : string }`  
__Description__ : receive comment data someone input from server.  

---

__Event Name__ : init\_receive  
__Emit__ : emit from server  
__On__ : handle on client  
__Type__ : Array[ Object, Object, … ]  
__Data Format__ : `{ { “id” : int, “name” : string, “message” : string }, { “id” : int, “name” : string, “message” : string }, … }`  
__Description__ : receive all comments when first connection.  

---

__Event Name__ : SeDelete  
__Emit__ : emit from client  
__On__ : handle on server  
__Type__ : Object  
__Data Format__ : `{ “id”: int }`  
__Description__ : send comment's id which user want to remove.  
__Note__ : You don't remove when user push delete button.You can only delete when handle “ClDelete” Event.

---

__Event Name__ : ClDelete  
__Emit__ : emit from server  
__On__ : handle on client  
__Type__ : Object  
__Data Format__ : `{ “id” : int }`  
__Description__ : receive comment's id for remove.  
If you handle “ClDelete” Event, you have to remove comment on form.

---

__Event Name__ : connect\_message  
__Emit__ : emit from server  
__On__ : handle on client  
__Type__ : Object  
__Data Format__ : `{ “name : “NodejsServer”, “message” : “Success Connection” }`  
__Description__ : receive first connection before handle "init\_receive".  

---

__Event Name__ : truncate  
__Emit__ : emit from client and server  
__On__ : handle on server and client  
__Type__ : nothing  
__Data Format__ : nothing  
__Description__ : there are this event to remove all comments. if this event is handled on Nodejs Server (emited from client), server try to remove all data inserted database.after it, server emit truncate event to client. handled on client, please remove all comments that are displayed on screen.  
