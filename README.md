Archery Server
==============

Event List
--------------

Event Name : send  
Emit : emit from client  
On : handle on server  
Type : Object  
Data Format : {“name” : string, “message” : string}  
Description : send inputed data to server and insert database.  

Event Name : receive  
Emit : emit from server  
On : handle on client  
Type : Object  
Data Format : {“id” : int, “name” : string, “message” : string}  
Description : receive comment data someone input from server.  

Event Name : init_receive  
Emit : emit from server  
On : handle on client  
Type : Array[ Object, Object, … ]  
Data Format : { {“id” : int, “name” : string, “message” : string},  
                {“id” : int, “name” : string, “message” : string}, … }  
Description : receive all comments when first connection.  

Event Name : SeDelete  
Emit : emit from client  
On : handle on server  
Type : Object  
Data Format : { “id”: int }  
Description : send comment's id which user want to remove.  
Note : You don't remove when user push delete button.  
	You can only delete when handle “ClDelete” Event.


Event Name : ClDelete  
Emit : emit from server  
On : handle on client  
Type : Object  
Data Format : { “id” : int }  
Description : receive comment's id for remove.  
		If you handle “ClDelete” Event, you have to remove comment on form.

Event Name : connect_message  
Emit : emit from server  
On : handle on client  
Type : Object  
Data Format : { “name : “NodejsServer”,  
		   “message” : “Success Connection” }  
Description : receive first connection before handle init_receive.  

Event Name : truncate  
Emit : emit from client and server  
On : handle on server and client  
Type : nothing  
Data Format : nothing  
Description : there are this event to remove all comments.  
		if this event is handled on Nodejs Server (emited from client), server try to remove all data inserted database.
		after it, server emit truncate event to client.
		If this event is handled on client, please remove all comments that are displayed on screen.
