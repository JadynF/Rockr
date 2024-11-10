import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Authorization } from '../components/Authorization';
import "../styles/Home.css";

export default function Listings() {
    Authorization();

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
        const updatedListings = listings.filter((listing, i) => i !== index);
        setListings(updatedListings);
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
                list.push({name: listing.listingName, color: listing.chairColor, condition: listing.chairCondition, price: listing.chairPrice, imagePath: listing.imagePath});
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

    return (
        <div>
            <h1 className="header">Welcome to the Listings Page!</h1>
            <div className="body">
                <Link to="/Home">Home</Link>
            </div>

            {/* Filter options */}
            <div className="filter-container">
                <label>
                    Color:
                    <select name="color" value={filters.color} onChange={handleFilterChange}>
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
                <label>
                    Condition:
                    <select name="condition" value={filters.condition} onChange={handleFilterChange}>
                        <option value="">All</option>
                        <option value="New">New</option>
                        <option value="Used (No Defects)">Used (No Defects)</option>
                        <option value="Used (Slightly Damaged)">Used (Slightly Damaged)</option>
                        <option value="Used (Heavily Damaged)">Used (Heavily Damaged)</option>
                    </select>
                </label>
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
                    <div className="modal-content">
                        {selectedListing ? (
                            <>
                                <h2>{selectedListing.name}</h2>
                                <div className="listing-details">
                                    {selectedListing.image && <img src={selectedListing.imagePath} alt={selectedListing.name} />}
                                    <p>{selectedListing.description}</p>
                                    <p>Color: {selectedListing.color}</p>
                                    <p>Condition: {selectedListing.condition}</p>
                                    <p>Price: ${selectedListing.price}</p>
                                    <p>Status: {selectedListing.status}</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="close-button">Close</button>
                            </>
                        ) : (
                            <>
                                <h2>{isEditing ? "Edit Listing" : "Add New Listing"}</h2>
                                <label>Name:</label>
                                <input type="text" name="name" value={newListing.name} onChange={handleInputChange} />
                                
                                <label>Color:</label>
                                <select name="color" value={newListing.color} onChange={handleInputChange}>
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

                                <label>Condition:</label>
                                <select name="condition" value={newListing.condition} onChange={handleInputChange}>
                                    <option value="">Select Condition</option>
                                    <option value="New">New</option>
                                    <option value="Used (No Defects)">Used (No Defects)</option>
                                    <option value="Used (Slightly Damaged)">Used (Slightly Damaged)</option>
                                    <option value="Used (Heavily Damaged)">Used (Heavily Damaged)</option>
                                </select>

                                <label>Price:</label>
                                <input type="number" name="price" value={newListing.price} onChange={handleInputChange} />
                                
                                <label>Status:</label>
                                <select name="status" value={newListing.status} onChange={handleInputChange}>
                                    <option value="Active">Active</option>
                                    <option value="Sold">Sold</option>
                                </select>

                                <label>Picture:</label>
                                <input type="file" accept="image/*" onChange={handleImageUpload} />
                                <button onClick={handleSubmit} className="submit-button" disabled={(newImage != null && newListing.status != '' && newListing.price != '' && newListing.condition != '' && newListing.color != '' && newListing.name != '') ? false : true}>
                                    {isEditing ? "Save Changes" : "Done"}
                                </button>
                                <button onClick={toggleModal} className="close-button">Cancel</button>
                            </>
                        )}
                    </div>
                </div>
            )}

            
        {/* Display filtered listings */}
        <div className="listings-display">
                <h2 className="listings-header">Your Listings</h2>
                <div className="listings-grid"> 
                    {filteredListings.map((listing, index) => (
                        <div key={index} className="listing-item" onClick={() => handleListingClick(index)}>
                            <div className="checkbox-container">
                                <input
                                    type="checkbox"
                                    checked={selectedListings.includes(index)}
                                    onChange={() => toggleSelectListing(index)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                            <img src={listing.imagePath} alt={listing.name} />
                            <h3>{listing.name}</h3>
                            <p>Price: ${listing.price}</p>

                            <div className="hover-overlay">
                                <p>Description: {listing.description}</p>
                                <p>Color: {listing.color}</p>
                                <p>Condition: {listing.condition}</p>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(index);
                                }}
                                className="edit-button"
                            >
                                Edit
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(index);
                                }}
                                className="delete-button"
                            >
                                Delete
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleStatus(index);
                                }}
                                className="status-button"
                            >
                                {listing.status === 'Active' ? 'Mark as Sold' : 'Mark as Active'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}