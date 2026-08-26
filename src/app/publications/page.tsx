import { Suspense } from 'react';
import publications from '../../../public/data/publications.json';
import peopleData from '../../../public/data/people.json';
import PublicationList from './PublicationList';
import styles from './Publication.module.css';
import Title from '@/components/Title';
import FadeIn from '@/components/FadeIn';

function normalizeAuthorName(name: string) {
  return name.replace(/[^a-z]/gi, '').toLocaleLowerCase();
}

export default function PublicationsPage() {
  const authorWebsites = Object.values(peopleData.members)
    .flat()
    .reduce<Record<string, string>>((websites, member) => {
      if (member.website) {
        websites[normalizeAuthorName(member.name)] = member.website;
      }
      return websites;
    }, {});

  return (
    <main className={styles.main}>
      <FadeIn>
        <Title title="Publications" />
      </FadeIn>
      <FadeIn>
        <Suspense>
          <PublicationList publications={publications} authorWebsites={authorWebsites} />
        </Suspense>
      </FadeIn>
    </main>
  );
}
