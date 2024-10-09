# Feature Documentation
---
<blockquote>

# React App Client
---

## Components
<blockquote>

### Header.js
Returns a header component. Creates a strip at the top of the page with a title and side-menu button.

MUST be used alongside SideMenu component 

Takes (isMenuVisible : useState) and (toggleMenu : method) props.
- Requires declaration of boolean useState variable for isMenuVisible prop.
- Requires declaration of method to change state of isMenuVisible prop.

### SideMenu.js
Returns a side menu component. Creates a toggleable menu on the left of the page with links to other pages.

MUST be used alongside Header component

Takes (isMenuVisible : useState), (menuLinks : String[]), and (menuNames : String[]) props.
- Requires declaration of boolean useState variable for isMenuVisile prop.
- Requires declaration of parallel lists (menuLinks and menuNames), where each link is the same index as the name of the link. Will create a button with the    menuNames text that redirects to corresponding menuLinks link

### Listing.js
Returns a listing div. Creates a section to display a listing image and for decision buttons.

Currently only pulls from locally stored images, in future it should pull from back-end server.

</blockquote>

</blockquote>