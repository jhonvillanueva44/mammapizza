'use client';

import React from 'react';
import styles from './CategoryCard.module.css';

type Props = {
  title: string;
  image: string;
};

export default function CategoryCard({ title, image }: Props) {
  return (
    <div className={styles.myCard}>
      <div className={styles.cardTitle}>{title}</div>
      <div className={styles.cardImageContainer}>
        <img src={image} alt={title} className={styles.cardImage} />
      </div>
    </div>
  );
}
