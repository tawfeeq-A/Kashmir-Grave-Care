import React from 'react';
import styles from './OrbitalHero.module.css';
import { useSite } from '@/context/SiteContext';

export default function OrbitalHero() {
  const { settings } = useSite();
  const content = settings?.content_json || {};

  return (
    <div className={styles.orbitalCard} aria-label="3D grave care illustration">
      <div className={styles.planet}></div>
      <div className={styles.graveStone}></div>
      <div className={`${styles.floatCard} ${styles.floatCardOne}`}>
        <strong>{content.floatOneTitle || "🌿 Gentle Weeding"}</strong>
        <p>{content.floatOneText || "Removing wild growth with care and respect."}</p>
      </div>
      <div className={`${styles.floatCard} ${styles.floatCardTwo}`}>
        <strong>{content.floatTwoTitle || "📐 Mindful Alignment"}</strong>
        <p>{content.floatTwoText || "Ensuring the grave sits beautifully with the earth."}</p>
      </div>
      <div className={`${styles.floatCard} ${styles.floatCardThree}`}>
        <strong>{content.floatThreeTitle || "🧱 Loving Restoration"}</strong>
        <p>{content.floatThreeText || "Protecting and renewing the resting place."}</p>
      </div>
    </div>
  );
}
