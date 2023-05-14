import React, { useState } from "react";
import axios from "axios";

import styles from "./KanbanCard.module.css";
import constants from "../../constants";
import Loading from "../Loading/Loading.component"

const { BASE_URL } = constants;

const KanbanCard = ({ card, onDeleteCard, onMoveCard }) => {
  const [newStatus, setNewStatus] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this task?"
      );
      if (confirmDelete) {
        setIsLoading(true);
        await axios.delete(`${BASE_URL}/cards/${card.id}`);
        setIsLoading(false);
        onDeleteCard(card.id);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleMove = async () => {
    try {
      if (newStatus === "") {
        setError("Please select a status before moving task.");
        setTimeout(() => {
          setError("");
        }, 3000);
        return;
      }
      setIsLoading(true);
      await axios.put(`${BASE_URL}/cards/${card.id}`, {
        ...card,
        status: newStatus,
      });
      setIsLoading(false);
      onMoveCard(card.id, newStatus);
      setNewStatus("");
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      {isLoading && <Loading />}
      <div className={styles.cardBody}>
        <button className={styles.deleteButton} onClick={handleDelete}>
          &times;
        </button>
        <h5 className={styles.cardTitle}>{card.title}</h5>
        <p className={styles.cardText}>{card.description}</p>
        <div className={styles.selectWrapper}>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <option value="">Move to...</option>
            <option value="todo">To Do</option>
            <option value="in-dev">In Development</option>
            <option value="done">Done</option>
          </select>
          <button className={styles.moveButton} onClick={handleMove}>
            Move Task
          </button>
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
      <div className={styles.cardFooter}>
        <small className={styles.cardMuted}>{card.status}</small>
      </div>
    </div>
  );
};

export default KanbanCard;
