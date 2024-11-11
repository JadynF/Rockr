import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import { Link } from 'react-router-dom';
import { Authorization } from '../components/Authorization';
import "../styles/Home.css";

export default function Listings() {
    Authorization();

    //sidebar variables
    const [isMenuVisible, setIsMenuVisible] = useState(true);
    const menuNames = ["Home", "Profile", "Chat", "Settings"];
    const menuLinks = ["/Home",  "/Profile", "/Chat", "/Settings"];

    const toggleMenu = () => {
        setIsMenuVisible(prev => !prev);
    }

    const host = process.env.REACT_APP_BACKEND_HOST;

    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState(listings);
    const [showModal, setShowModal] = useState(false);
    const [newListing, setNewListing] = useState({ name: '', description: '', color: '', condition: '', price: '', status: 'Active',});
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [selectedListing, setSelectedListing] = useState(null);
    const [selectedListings, setSelectedListings] = useState([]);
    const [newImage, setNewImage] = useState(null);
    

    const [filters, setFilters] = useState({
        color: '',
        condition: '',
        maxPrice: ''
    });

    // Open and close modal
    const toggleModal = () => {
        setShowModal(!showModal);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewListing({ ...newListing, [name]: value });
    };

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewImage(file);
        }
    };

    // Handle submission for adding or editing a listing
    const handleSubmit = () => {
        if (isEditing) {
            const updatedListings = [...listings];
            updatedListings[editingIndex] = newListing;
            setListings(updatedListings);
        } else {
            setListings([...listings, newListing]);
            console.log(newImage);
            const formData = new FormData();
            formData.append('token', localStorage.getItem('token'));
            for (const [key, value] of Object.entries(newListing)) {
                formData.append(key, value);
            }
            formData.append('image', newImage);
            fetch(host + "/addListing", {
                method: "POST",
                body: formData,
            })
            .then(res => res.json())
            .then(data => {
                console.log("here");
                console.log(data);
                getMyListings();
                setNewListing({ name: '', description: '', image: null, color: '', condition: '', price: '' });
                setIsEditing(false);
                toggleModal();
                setNewImage(null);
            });
        }
    };

    // handle edit button click
    const handleEdit = (index) => {
        const listingToEdit = listings[index];
        setNewListing(listingToEdit);
        setEditingIndex(index);
        setIsEditing(true);
        toggleModal();
    };

    // handle delete listing
    const handleDelete = (index) => {
        console.log(listings[index]);
        let listingId = listings[index].id;
        fetch(host + '/deleteListing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({listingId: listingId})
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            getMyListings();
        });
        
    };


    const toggleStatus = (index) => {
        const updatedListings = [...listings];
        updatedListings[index].status = updatedListings[index].status === 'Active' ? 'Sold' : 'Active';
        setListings(updatedListings);
    };

    // handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    // filter listings based on user input
    const filterListings = () => {
        const updatedListings = listings.filter((listing) => {
            const matchColor = !filters.color || listing.color === filters.color;
            const matchCondition = !filters.condition || listing.condition === filters.condition;
            const matchPrice = !filters.maxPrice || parseInt(listing.price) <= parseInt(filters.maxPrice);
            return matchColor && matchCondition && matchPrice;
        });
        setFilteredListings(updatedListings);
    };

    useEffect(() => {
        console.log("Filtering listings:");
        console.log(listings);
        filterListings();
    }, [filters, listings]);

    
    useEffect(() => {
        // fetch listings
        getMyListings();
    }, []);

    const getMyListings = () => {
        let mytoken = localStorage.getItem("token");
        fetch(host + '/getMyListings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({token: mytoken})
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            let list = [];
            for (let i = 0; i < data.length; i++) {
                console.log(data[i]);
                let listing = data[i];
                console.log(listing.listingName);
                console.log(listing.chairColor);
                list.push({name: listing.listingName, color: listing.chairColor, condition: listing.chairCondition, price: listing.chairPrice, imagePath: listing.imagePath, id: listing.listingId});
            }
            console.log(listings);
            console.log(list);
            setListings(list);
        })
        ;
    }


    const handleListingClick = (index) => {
        setSelectedListing(filteredListings[index]);
        toggleModal();
    };


    const handleOutsideClick = (e) => {
        if (e.target.className === 'modal') {
            setShowModal(false);
            setSelectedListing(null);
        }
    };

    const toggleSelectListing = (index) => {
        setSelectedListings((prevSelected) =>
            prevSelected.includes(index)
                ? prevSelected.filter((i) => i !== index)
                : [...prevSelected, index]
                );
            };

    const deleteSelectedListings = () => {
        setListings(listings.filter((_, index) => !selectedListings.includes(index)));
        setSelectedListings([]); 
    };

    const closeModal = () => {
        setShowModal(false); 
        setSelectedListing(null);
    };

    return (
        <>
            <Header class="header" isMenuVisible = {isMenuVisible} toggleMenu = {toggleMenu}/>
            <div className="main-container" style = {{
                    flex: '2',
                    height: "100vh",
                }}>
                <SideMenu isMenuVisible = {isMenuVisible} menuNames = {menuNames} menuLinks = {menuLinks}/>
                <div style = {{
                    width: "100%",
                }}>
                    {/* Filter options */}
                    <div className="filter-container" style = {{
                        backgroundColor: "#111418",
                    }}>
                        <h2>Filters</h2>
                        <label>
                            Color:
                            <select name="color" value={filters.color} onChange={handleFilterChange} style = {{
                                    backgroundColor: "#111418",
                                    color: "white",
                                    borderRadius: "5px",
                                }}>
                                <option value="">All</option>
                                <option value="Red">Red</option>
                                <option value="Orange">Orange</option>
                                <option value="Yellow">Yellow</option>
                                <option value="Green">Green</option>
                                <option value="Blue">Blue</option>
                                <option value="Purple">Purple</option>
                                <option value="White">White</option>
                                <option value="Black">Black</option>
                                <option value="Gray">Gray</option>
                                <option value="Brown">Brown</option>
                                <option value="Beige">Beige</option>
                                <option value="Pink">Pink</option>
                            </select>
                        </label>
                        &nbsp;&nbsp;
                        <label>
                            Condition:
                            <select name="condition" value={filters.condition} onChange={handleFilterChange} style = {{
                                    backgroundColor: "#111418",
                                    color: "white",
                                    borderRadius: "5px",
                                }}>
                                <option value="">All</option>
                                <option value="New">New</option>
                                <option value="Used (No Defects)">Used (No Defects)</option>
                                <option value="Used (Slightly Damaged)">Used (Slightly Damaged)</option>
                                <option value="Used (Heavily Damaged)">Used (Heavily Damaged)</option>
                            </select>
                        </label>
                        &nbsp;&nbsp;
                        <label>
                            Max Price:
                            <input
                                type="number"
                                name="maxPrice"
                                value={filters.maxPrice}
                                onChange={handleFilterChange}
                                placeholder="Enter max price"
                            />
                        </label>
                    </div>

                    {/* add Listing Button */}
                    <div className="add-listing-button-container">
                        <button onClick={() => { setIsEditing(false); toggleModal(); }} className="add-listing-button">
                            Add Listing
                        </button>
                    </div>

                    {selectedListings.length > 0 && (
                        <button onClick={deleteSelectedListings} className="delete-selected-button">
                            Delete Selected
                        </button>
                    )}

                    {showModal && (
                        <div className="modal" onClick={handleOutsideClick}>
                            <div className="modal-content" style = {{
                                color: "white",
                            }}>
                                {selectedListing ? (
                                    <>
                                        <h2>{selectedListing.name}</h2>
                                        <div className="listing-details">
                                            {selectedListing.imagePath && <img src={selectedListing.imagePath} alt={selectedListing.name} style = {{
                                                width: "50%",
                                                height: "50%",
                                                objectFit: "contain",
                                            }}/>}
                                            <p>{selectedListing.description}</p>
                                            <p>Color: {selectedListing.color}</p>
                                            <p>Condition: {selectedListing.condition}</p>
                                            <p>Price: ${selectedListing.price}</p>
                                        </div>
                                        <button onClick={() => closeModal()} className="close-button" style = {{
                                            margin: "5px",
                                        }}>Close</button>
                                    </>
                                ) : (
                                    <div style = {{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                    }}>
                                        <h2>{isEditing ? "Edit Listing" : "Add New Listing"}</h2>
                                        <div style = {{
                                            width: "75%",
                                            alignSelf: "center",
                                            padding: "5px",
                                        }}>
                                            <label>Name:</label>
                                            <input type="text" name="name" value={newListing.name} onChange={handleInputChange} style = {{
                                                backgroundColor: "black",
                                                color: "white",
                                            }}/>
                                        </div>

                                        <div style = {{
                                            width: "75%",
                                            alignSelf: "center",
                                            padding: "5px",
                                        }}>
                                            <label>Color:</label>
                                            <select name="color" value={newListing.color} onChange={handleInputChange} style = {{
                                                backgroundColor: "#111418",
                                                color: "white",
                                                borderRadius: "5px",
                                                }}>
                                                <option value="">Select Color</option>
                                                <option value="Red">Red</option>
                                                <option value="Orange">Orange</option>
                                                <option value="Yellow">Yellow</option>
                                                <option value="Green">Green</option>
                                                <option value="Blue">Blue</option>
                                                <option value="Purple">Purple</option>
                                                <option value="White">White</option>
                                                <option value="Black">Black</option>
                                                <option value="Gray">Gray</option>
                                                <option value="Brown">Brown</option>
                                                <option value="Beige">Beige</option>
                                                <option value="Pink">Pink</option>
                                            </select>
                                        </div>

                                        <div style = {{
                                            width: "75%",
                                            alignSelf: "center",
                                            padding: "5px",
                                        }}>
                                            <label>Condition:</label>
                                            <select name="condition" value={newListing.condition} onChange={handleInputChange} style = {{
                                                backgroundColor: "#111418",
                                                color: "white",
                                                borderRadius: "5px",
                                                }}>
                                                <option value="">Select Condition</option>
                                                <option value="New">New</option>
                                                <option value="Used (No Defects)">Used (No Defects)</option>
                                                <option value="Used (Slightly Damaged)">Used (Slightly Damaged)</option>
                                                <option value="Used (Heavily Damaged)">Used (Heavily Damaged)</option>
                                            </select>
                                        </div>

                                        <div style = {{
                                            width: "75%",
                                            alignSelf: "center",
                                            padding: "5px",
                                        }}>
                                            <label>Price:</label>
                                            <input type="number" name="price" value={newListing.price} onChange={handleInputChange} style = {{
                                                backgroundColor: "black",
                                                color: "white",
                                            }}/>
                                        </div>

                                        <div style = {{
                                            width: "75%",
                                            alignSelf: "center",
                                            padding: "5px",
                                        }}>
                                            <label>Picture:</label>
                                            <input type="file" accept="image/*" onChange={handleImageUpload} />
                                        </div>

                                        <div style = {{
                                            width: "75%",
                                            alignSelf: "center",
                                            padding: "5px",
                                        }}>
                                            <button onClick={handleSubmit} className="submit-button" disabled={(newImage != null && newListing.price != '' && newListing.condition != '' && newListing.color != '' && newListing.name != '') ? false : true}>
                                                {isEditing ? "Save Changes" : "Done"}
                                            </button>
                                            &nbsp;
                                            &nbsp;
                                            <button onClick={toggleModal} className="close-button">Cancel</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}


                    {/* Display filtered listings */}
                    <div className="listings-display" style = {{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                    }}>
                            <h2 className="listings-header">Your Listings</h2>
                            <div className="listings-grid" style = {{
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "center",
                            }}> 
                                {filteredListings.map((listing, index) => (
                                    <div key={index} className="listing-item" onClick={() => handleListingClick(index)} style = {{
                                        marginLeft: "20px",
                                        marginRight: "20px",
                                    }}>
                                        <div className="checkbox-container">
                                            <input
                                                type="checkbox"
                                                checked={selectedListings.includes(index)}
                                                onChange={() => toggleSelectListing(index)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                        <img src={listing.imagePath} alt={listing.name} style = {{
                                            width: "100%",
                                            height: "55%",
                                            objectFit: "contain",
                                        }}/>
                                        <h3>{listing.name}</h3>
                                
                                        <div className="hover-overlay">
                                            <p>Price: ${listing.price}</p>
                                            <p>Color: {listing.color}</p>
                                            <p>Condition: {listing.condition}</p>
                                        </div>
                                
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(index);
                                            }}
                                            className="delete-button"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
        </>
    );
}