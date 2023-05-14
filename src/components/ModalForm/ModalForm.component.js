import React, { useState, useRef } from "react";
import axios from "axios";

import styles from "./ModalForm.module.css";
import Loading from "../Loading/Loading.component";
import constants from "../../constants";

const { BASE_URL } = constants;

const ModalForm = ({ onClose, selectedCategory, onAddCard }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(selectedCategory);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const categoryRef = useRef(null);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validasi input
    if (!title || !description || !category) {
      setError("Please fill in all fields!");
      if (!title) titleRef.current.classList.add(styles.error);
      if (!description) descriptionRef.current.classList.add(styles.error);
      if (!category) categoryRef.current.classList.add(styles.error);
      setTimeout(() => {
        titleRef.current.classList.remove(styles.error);
        descriptionRef.current.classList.remove(styles.error);
        categoryRef.current.classList.remove(styles.error);
        setError("");
      }, 2000);
      return;
    }

    const newCard = {
      title,
      description,
      status: category || selectedCategory,
    };

    setIsLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/cards`, newCard);
      onAddCard(response.data);
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);

    setTitle("");
    setDescription("");
    setCategory("");
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
        <h2>Add Task</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={handleTitleChange}
              ref={titleRef}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              ref={descriptionRef}
            ></textarea>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={handleCategoryChange}
              ref={categoryRef}
            >
              <option value="" disabled>
                Select category
              </option>
              <option value="todo">To Do</option>
              <option value="in-dev">In Development</option>
              <option value="done">Done</option>
            </select>
          </div>
          {error && <div className={styles.errorText}>{error}</div>}
          <div className={styles.formGroup}>
            {isLoading ? <Loading /> : <button type="submit">Save</button>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalForm;
