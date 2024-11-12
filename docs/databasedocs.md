# Database
---

## MySQL Database

## Tables

### Listings
Columns: 
- listingId : int AI PK
- imagePath : varchar(100)
- listingName : varchar(45)
- chairCondition : varchar(45)
- chairPrice : int
- chairColor : varchar(20)
- creatorId : int FK REFERENCES User_information.id
- Latitude : decimal(10,0)
- Longitude : decimal(10,0)

### MatchedWith
Columns:
- userId : int PK FK REFERENCES User_information.id
- litingId int PK FK REFERENCES Listings.listingId

### Messages
Columns:
- messageId : int AI PK
- text : varchar(128)
- timestamp : timestamp
- userId : int FK REFERENCES User_information.id
- receiverId : int FK REFERENCES User_information.id
- listingId : int FK REFERENCES Listings.listingId

### Seen_listings
Columns:
- listingId : int PK FK REFERENCES Listings.listingId
- userId : int PK FK REFERENCES User_information.id

### User_information
Columns:
- id : int AI PK
- username : varchar(50)
- password : varchar(255)
- email : varchar(100)
- phone : varchar(20)
- created_at : timestamp
- Latitude : decimal(11,8)
- Longitude : decimal(11,8)
- Verified : tinyint(1)
- FirstName : varchar(100)
- LastName : varchar(100)
- vToken : varchar(100)

### UserPreferences
Columns:
- userId : int PK FK REFERENCES User_information.id
- prefPrice : int
- prefColor : varchar(45)
- prefCondition : varchar(45)