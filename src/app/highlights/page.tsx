import Link from 'next/link';
import Image from 'next/image';
import styles from '../page.module.css';
import newsData from '../../../public/data/news.json';
import { HighlightItem } from '../../types';
import FadeIn from '../../components/FadeIn';

const highlights: HighlightItem[] = newsData;

export default function HighlightsPage() {
  return (
    <main className={styles.main}>
      <FadeIn>
        <section className={`${styles.section} ${styles.highlightsSection}`}>
          <Link href="/" className={styles.backLink}>
            &lt; Home
          </Link>
          <h2 className={styles.sectionTitle}>News</h2>
          <div className={styles.highlightsGrid}>
            {highlights.map((item, idx) => (
              <article key={item.id} className={styles.highlightCard}>
                <div className={styles.highlightImageWrapper}>
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 900px) 50vw, 28rem"
                    className={styles.image}
                    priority={idx < 4}
                  />
                </div>
                <div className={styles.info}>
                  <h3 className={styles.title}>{item.title}</h3>
                  <p className={styles.details}>{item.details}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </FadeIn>
    </main>
  );
}
