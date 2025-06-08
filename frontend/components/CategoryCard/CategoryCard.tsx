'use client';

import React from 'react';
import styles from './CategoryCard.module.css';
import Link from 'next/link';

type Props = {
  title: string;
  image: string;
  link: string;
};

export default function CategoryCard({ title, image, link }: Props) {
  return (
    <Link href={link}>
      <div className={`${styles.myCard} cursor-pointer`}>
        <div className={styles.cardTitle}>{title}</div>
        <div className={styles.cardImageContainer}>
          <img src={image} alt={title} className={styles.cardImage} />
        </div>
      </div>
    </Link>
  );
}
