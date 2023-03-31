import React from 'react';
import styles from './GroupCard.module.css';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

function GroupCard({ name, firstSeat, lastSeat, onDeleteClick}) {
  return (
    <div className={styles.groupCard}>
      <p>{name}</p>
      <p>{firstSeat + " - " + lastSeat}</p>
      <div className={styles.groupCardButtonContainer}>
        <button className={styles.groupLeaveButton} onClick={(e) => onDeleteClick(e, name)}><MeetingRoomIcon /></button>
      </div>
    </div >
  )
}

export default GroupCard;