import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Authorization } from '../components/Authorization';
import "../styles/Home.css";

export default function Listings() {
    Authorization();

    const [listings, setListings] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newListing, setNewListing] = useState({ name: '', description: '', image: null });
    const [isEditing, setIsEditing] = useState(false); // Track if we are editing
    const [editingIndex, setEditingIndex] = useState(null); // Track which listing is being edited

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
        setNewListing({ ...newListing, image: URL.createObjectURL(e.target.files[0]) });
    };

    // Handle form submission for adding or editing a listing
    const handleSubmit = () => {
        if (isEditing) {
            const updatedListings = [...listings];
            updatedListings[editingIndex] = newListing; // Update the listing at the specific index
            setListings(updatedListings);
        } else {
            setListings([...listings, newListing]); // Add a new listing
        }

        setNewListing({ name: '', description: '', image: null }); // Reset form
        setIsEditing(false); // Reset editing state
        toggleModal(); // Close modal
    };

    // Handle edit button click
    const handleEdit = (index) => {
        const listingToEdit = listings[index];
        setNewListing(listingToEdit); // Set the form to the listing's current details
        setEditingIndex(index); // Track the index of the listing being edited
        setIsEditing(true); // Set editing state
        toggleModal(); // Open modal for editing
    };

    // Handle delete listing
    const handleDelete = (index) => {
        const updatedListings = listings.filter((listing, i) => i !== index);
        setListings(updatedListings);
    };

    return (
        <div>
            <h1 className="header">Welcome to the Listings Page!</h1>
            <div className="body">
                <Link to="/Home">Home</Link>
            </div>

            {/* Add Listing Button */}
            <div className="add-listing-button-container">
                <button onClick={() => { setIsEditing(false); toggleModal(); }} className="add-listing-button">
                    Add Listing
                </button>
            </div>

            {/* Modal for adding or editing a listing */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{isEditing ? "Edit Listing" : "Add New Chair Listing"}</h2>
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={newListing.name}
                            onChange={handleInputChange}
                        />
                        <label>Description:</label>
                        <input
                            type="text"
                            name="description"
                            value={newListing.description}
                            onChange={handleInputChange}
                        />
                        <label>Picture:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                        <button onClick={handleSubmit} className="submit-button">
                            {isEditing ? "Save Changes" : "Done"}
                        </button>
                        <button onClick={toggleModal} className="close-button">Cancel</button>
                    </div>
                </div>
            )}

            {/* Display added listings */}
            <div className="listings-display">
                <h2>Your Listings</h2>
                {listings.map((listing, index) => (
                    <div key={index} className="listing-item">
                        <h3>{listing.name}</h3>
                        <p>{listing.description}</p>
                        {listing.image && <img src={listing.image} alt={listing.name} />}
                        <button onClick={() => handleEdit(index)} className="edit-button">Edit</button>
                        <button onClick={() => handleDelete(index)} className="delete-button">Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

