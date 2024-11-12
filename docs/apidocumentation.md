# API Documentation
---

<blockquote>

# Back-end Access Points
---
<blockquote>

## /addListing
Method: POST

Will create a listing for the user.

Request body must contain the users "token", the listings "image" and the rest of the listings details: "name", "condition", "price", "color".

Response body will be {response: true} if succeeded, {response: false} otherwise.

## /deleteListing
Method: POST

Will delete the users listing.

Request body must contain the listings "listingId".

Response body will be {response: true}, {response: false} otherwise.

## /getChatOverviews

Method: POST

Will fetch chat overviews for the current user.

Request body must contain a "token" field with the users token.

Response body contains a List, with index 0 containing all outgoingChatListings, and index 1 containing all incomingChatListings. Both of which are SQL responses with "listingId", "listingName", and "username" (for the listing creator) fields.

## /getIndividualChat

Method: POST

Will fetch all messages for an individual chat between 2 users, for a single listing.

Request body must contain a "token" field with the users token, a "listingId" field with the listingId that has been matched with, and a "userId" field with the creator of the matched listing.

Response body contains a list, with index 0 containing the id of the current user, index 1 containing the name of the current listing, index 2 containing a SQL response for each message with "text", "timestamp", and "userId" fields, index 3 contains imgPath, index 5 contains the chair condition, index 6 contains the price of the chair, index 7 contains the color of the chair, index 8 contains the listings creator username, index 9 contains the username for the requesting user. If the match, and therefore the chat, do not exist, the response body will be empty.

## /getListing

Method: POST

Will fetch listings for the current user.

Request body must contain a "token" field with the users token (localStorage.getItem('token')).

Response body is a JSON object that has "imagePath" field to get the listing image on the back-end webserver, the "listingId" for the listing, the "creatorUsername" for the listing, the "listingName" for the listing, the "chairCondition" on the chair, the "chairPrice" for the chair, and the "chairColor" for the chair.

## /getMyListings

Method: POST

Will fetch all of the current users created listings.

Request body requires "token" field with the users token.

Response body contains a JSON object will all of the columns in the listing table: listingId, imagePath, listingName, chairCondition, chairPrice, chairColor, creatorId.

## /isAuthroized

Method: POST

Will determine if the current token is authorized to access protected resources.

Request body must contain a "token" field with the users token (localStorage.getItem('token')).

Response body is a JSON object with "response" and "user" fields. If the token is authorized, "response" == true and "user" == (current username).

## /login

Method: POST

Will log user into server by creating session.

Body of request needs "username" and "password" fields for the user. 

Response body is a JSON object with one guaranteed field, "response", that is either "accepted" if user credentials are accepted or "rejected" otherwise. In the case where "response" == "accepted", there will be an additional field "token" that contains the session JSON web token for the user.

## /matchedListing

Method: POST

Will insert matched listing into the database.

Body of request needs "token" field with the users token, and "currListing" with the listingId of the current listing.

No response, simply inserts matched data into database.

## /newPreferences

Method: POST

Will set user preferences.

Body of request needs "token" with the users token, "newPrice", "newColor" and "newCondition" for the new preferences.

Response will be {response: true} if succeeded, {response: false} otherwise.

## /sendMessage

Method: POST

Will insert message into the database.

Body of request needs "myId" field with the sending users id, "recvName" with the receiving username, "listingId" with the current matched listing, and "message" with the contents of the message.

No response, simply inserts message into database.

</blockquote>

# Functions
---
<blockquote>

## isAuthorized()

Takes currToken : String, where currToken is the token needing verification.

Will return a username if the token is verified. Otherwise, will return false.

## sendQuery()

Takes query : String, where query is the SQL query for the database.

Will return Database response JSON (see mysql2 pools and .query()). upon error, will return false.

</blockquote>
</blockquote>