## Thought-line Back End

For Local Copy 

`npm i --s npm run dev`
create .env file 
copy content of file from slack channel.

### Routes

#### Auth Routes

`http POST :3000/api/v1/signup`
 + body must contain username password email

`http GET :3000/api/v1/signin`
 + basic auth: supply username and password
  will recieve a JWT response.

`http PUT :3000/api/v1/changepassword`
 + bearer auth - JWT
  supply old password and new password
  response will be 204 status code.

#### Target Routes

`http POST :3000/api/v1/target`
 + bearer auth
  body contains target info:
      name : { type: String, required: true},
      email : { type: String, required: false},
      photo : {type: String, required: false},

`http GET :3000/api/v1/target/:id ?`
 + bearer auth 
if target id supplied returns that target or returns all targets for that user.

`http DELETE :3000/api/v1/target/:id?`
 + bearer auth 
  if no id supplied return 400 error else 204 no content.

`http PUT :3000/api/v1/target/:id?`
 + bearer auth 
  supply changed Target parameters in body
  if no id supplied return 400 error else 204 no content.

#### Target Entries
 
`http GET :3000/api/v1/targetentry`

 + bearer auth
   supply target id in request body
   returnds all entries for specified target for logged in user.
   

#### Entries Routes

`http POST :3000/api/v1/entry`

 + bearer auth
   body of request 
   recipient: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'targetModel'},
    mood: {type: String, required: false},
    description: {type: String, required: false },
  
`http GET :3000/api/v1/entry/:id?`

 + bearer auth
   if id supplied returns one else all entries by user.

`http PUT :3000/api/v1/entry/:id?`
+ bearer auth 
  supply changed Entry parameters in body
  if no id supplied return 400 error else 204 no content.

`http DELETE :3000/api/v1/entry/:id?`
 + bearer auth 
  if no id supplied return 400 error else 204 no content.

  #### Inbox Route
  This is for getting the "inbox" entries that have been sent to us.

  `http POST :3000/api/v1/inbox/`

 + bearer auth
  + in the body include "sender" this will be the user id of the person that send the messages. 

#### Deliver Entries to user
`http PUT :3000/api/v1/deliverentries/`
+ bearer auth
+ Include in body of request the recipient id.
+ This will send all enrtries from one user to another.

#### User Search
`http GET :3000/api/v1/usersearch/`
+bearer auth
+ include in body of request email address.
+ basic validation done on email format, front end should validate aswell.