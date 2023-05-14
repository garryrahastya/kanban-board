import React, { useState, useEffect } from "react";
import axios from "axios";

import KanbanCard from "../../components/KanbanCard/KanbanCard.component";
import ModalForm from "../../components/ModalForm/ModalForm.component";
import Loading from "../../components/Loading/Loading.component";
import styles from "./KanbanBoard.module.css";
import constants from "../../constants";

const { BASE_URL } = constants;

const KanbanBoard = () => {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("todo");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/cards`);
        setCards(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderCards = (status) => {
    return cards
      .filter((card) => card.status === status)
      .map((card) => (
        <KanbanCard
          key={card.id}
          card={card}
          onDeleteCard={(deletedCardId) => {
            setCards(cards.filter((card) => card.id !== deletedCardId));
          }}
          onMoveCard={handleMoveCard}
        />
      ));
  };

  const handleMoveCard = (cardId, newStatus) => {
    const updatedCards = cards.map((card) => {
      if (card.id === cardId) {
        return {
          ...card,
          status: newStatus,
        };
      }
      return card;
    });
    setCards(updatedCards);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategory("");
  };

  return (
    <div>
      {isLoading && <Loading />}
      {!isLoading && (
        <div className={styles.boardContainer}>
          <button className={styles.addButton} onClick={handleShowModal}>
            Add Task
          </button>
          {showModal && (
            <ModalForm
              onClose={handleCloseModal}
              selectedCategory={selectedCategory}
              onAddCard={(newCard) => {
                setCards([...cards, newCard]);
                handleCloseModal();
              }}
            />
          )}
          <div className={styles.board}>
            <div className={styles.col}>
              <h2 className="text-center">To Do</h2>
              {renderCards("todo")}
            </div>
            <div className={styles.col}>
              <h2 className="text-center">In Development</h2>
              {renderCards("in-dev")}
            </div>
            <div className={styles.col}>
              <h2 className="text-center">Done</h2>
              {renderCards("done")}
            </div>
          </div>
        </div>
      )}
      {error && <div>Error: {error.message}</div>}
    </div>
  );
};

export default KanbanBoard;
