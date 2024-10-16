# API Documentation
---

<blockquote>

# Back-end Access Points
---
<blockquote>

## /getListing

Method: POST

Will fetch listings for the current user.

Response body is a JSON object that has "imagePath" field to get the listing image on the back-end webserver.

## /isAuthroized

Method: POST

Will determine if the current token is authorized to access protected resources.

Request body must contain a "token" field with the users token (localStorage.getItem('token')).

Response body is a JSON object with "response" and "user" fields. If the token is authorized, "response" == true and "user" == (current username).

## /login

Method: POST

Will log user into server by creating session.

Body of request needs username and password fields. 

Response body is a JSON object with one guaranteed field, "response", that is either "accepted" if user credentials are accepted or "rejected" otherwise. In the case where "response" == "accepted", there will be an additional field "token" that contains the session JSON web token for the user.

</blockquote>
</blockquote>
