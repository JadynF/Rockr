# Feature Documentation
---
<blockquote>

# React App Client
---
## Pages
<blockquote>

### Chat.js
The Chat overview page.

Displays all incoming and outgoing chats for a user. Each chat represents a match with a listing, so it is not on a per-user basis, and instead per-match.
Incoming chats represent matches that have been opened by other users for YOUR listing.
Outgoing chats represent matches that YOU have actively opened.

Requires Authorization

### CreateAccount.js
The Create Account Page. Can be accessed via the Login page.

Displays input boxes for a user's first name, last name, username, password, email, and phone number, as well as a 'Submit' button and a link to the Login Page.

Create Account Inputs:
User can input their personal information and submit it.
- Successful Submission: The user's account is added and saved to the database, and the user can then log in on future webpage visits.
- Unsuccessful Submission: The user's account is not created.

### Home.js
The Home Page. Can be accessed via a successful login on the Login Page.

Displays a 'listing' for the user to 'swipe' "Yes!" or "No!" on, which contains an image of a chair.
Will only pull listings that fall into the current user's preferences.
Contains a side menu which is accessed via a 'Show Menu' button in the top-left of the page.
Contains a header which displays the name of the webpage.

Requires Authorization

### IndividualChat.js
The singular chat page. Can be accessed through Chat.js page.

Contains URL parameters:
<blockquote>

IndividualChat/{userId}/{listingId}
- Where userId is the other user that the current user is chatting with.
- Where listingId is the id of the listing that the other user created.

</blockquote>

Displays chat messages between 2 users for one match. The 2 users are determined by the user that matched, and the user that created the listing.
The chat will actively update every 5 seconds to ensure the user is able to see incoming messages without refreshing the page.
If request for messages returns empty (not the same as the "Messages" index being empty), the user will be redirected back to the Chat overview page.

updateChat(): Takes no parameters, will request to update chat messages from /getIndividualChat endpoint

sendMessage(): Takes no parameters, will request to insert current message into the database through /sendMessage endpoint

Requires Authorization

### Login.js
The Login Page. Displayed upon webpage startup.

Displays the webpage name, username input, password input, and a link to the 'Create Account' page.

Login Inputs:
User can input their personal username and password to gain access to the main site.
- Successful Login: Redirected to Home Page
- Unsuccessful Login: Remains on Login Page

</blockquote>

## Components
<blockquote>

### AllChats.js
Returns a div that contains previews of all of the current users chats.

Upon mount, will request to get chat overviews from /getChatOverviews endpoint. The div will then be populated with 2 sections, outgoing-chats and incoming-chats, that show previews for the current user.

Takes (navigate: react-router-dom.useNavigate())
- Due to the nature of React Hooks, useNavigate() must be defined in the parent component at the top level. In order to use navigation to redirect properly, AllChats.js requires this as a parameter.

### Authorization.js
Returns nothing. Contains method Authorization() that can be used to check if the current user is authorized.

To protect resources, simply call Authorization() before loading the resource.
This will query the back-end server to see if the current token is authorized, if so continue, else redirect to the Login page.

### Header.js
Returns a header component. Creates a strip at the top of the page with a title and side-menu button.

MUST be used alongside SideMenu component 

Takes (isMenuVisible : useState) and (toggleMenu : method) props.
- Requires declaration of boolean useState variable for isMenuVisible prop.
- Requires declaration of method to change state of isMenuVisible prop.

### Listing.js
Returns a listing div. Creates a section to display a listing image and for decision buttons.

Currently only pulls from locally stored images, in future it should pull from back-end server.

### SideMenu.js
Returns a side menu component. Creates a toggleable menu on the left of the page with links to other pages.

MUST be used alongside Header component

Takes (isMenuVisible : useState), (menuLinks : String[]), and (menuNames : String[]) props.
- Requires declaration of boolean useState variable for isMenuVisile prop.
- Requires declaration of parallel lists (menuLinks and menuNames), where each link is the same index as the name of the link. Will create a button with the    menuNames text that redirects to corresponding menuLinks link

</blockquote>

</blockquote>