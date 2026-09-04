'use client';

import { PublicationItem } from '@/types';
import { smoothScrollToElement } from '@/utils/smoothScroll';
import styles from './Publication.module.css';
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs';
import { useMemo, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface PublicationListProps {
  publications: PublicationItem[];
  authorWebsites: Record<string, string>;
}

export default function PublicationList({ publications, authorWebsites }: PublicationListProps) {
  const { filters, setFilters } = usePublicationFilters();

  const options = useMemo(() => {
    return findPossibleOptions(publications);
  }, [publications]);

  const filteredPublications = useMemo(() => {
    return filterPublications(publications, filters).reduce<Record<string, PublicationItem[]>>(
      (acc, pub) => {
        const year = pub.year;
        if (!acc[year]) acc[year] = [];
        acc[year].push(pub);
        return acc;
      },
      {},
    );
  }, [publications, filters]);
  const sortedGroups = Object.entries(filteredPublications).sort((a, b) => {
    return b[0].localeCompare(a[0]);
  });

  return (
    <div className={styles.container}>
      <section className={styles.years}>
        <YearAnchors options={options} />
      </section>
      <section className={styles.publications}>
        <PublicationFilterController
          options={options}
          filters={filters}
          setFilters={setFilters}
        />
        <FilteredList signature={JSON.stringify(filters)}>
          {sortedGroups.map(([year, publications]) => (
            <section key={year} className={styles.pubYearSection}>
              <h2 className={styles.pubYearTitle} id={year}>
                {year}
              </h2>

              <div className={styles.pubYearList}>
                {publications.map((pub) => (
                  <PublicationItemView pub={pub} authorWebsites={authorWebsites} key={pub.title} />
                ))}
              </div>
            </section>
          ))}
        </FilteredList>
      </section>
    </div>
  );
}

const filterLabels = ['researchTopic', 'modality', 'recognition'] as const;
const recognitionOptions = ['Award winning', 'Oral/Spotlight', 'Highly cited'];
const formatRecognitionLabel = (value: string) =>
  value === 'Oral/Spotlight' ? 'Oral / Spotlight' : value;
const publicationFiltersSchema = {
  modality: parseAsArrayOf(parseAsString).withDefault([]),
  recognition: parseAsArrayOf(parseAsString).withDefault([]),
  researchTopic: parseAsArrayOf(parseAsString).withDefault([]),
};

type PublicationFilter = {
  [K in keyof typeof publicationFiltersSchema]: NonNullable<
    ReturnType<(typeof publicationFiltersSchema)[K]['parseServerSide']>
  >;
};
type PublicationFilterOptions = {
  [K in keyof typeof publicationFiltersSchema]: string[];
} & { year: string[] };

function filterPublications(
  publications: PublicationItem[],
  filters: PublicationFilter,
): PublicationItem[] {
  return publications.filter((pub) => {
    if (
      filters.modality.length > 0 &&
      !pub.modality.some((v) => filters.modality.includes(v))
    ) {
      return false;
    }
    if (
      filters.researchTopic.length > 0 &&
      !pub.researchTopic.some((v) => filters.researchTopic.includes(v))
    ) {
      return false;
    }
    if (
      filters.recognition.length > 0 &&
      !pub.recognition.some((v) => filters.recognition.includes(v))
    ) {
      return false;
    }
    return true;
  });
}

function findPossibleOptions(publications: PublicationItem[]) {
  const year = new Set<string>();
  const modality = new Set<string>();
  const researchTopic = new Set<string>();

  publications.forEach((pub) => {
    year.add(pub.year);
    pub.modality.forEach((v) => modality.add(v));
    pub.researchTopic.forEach((v) => researchTopic.add(v));
  });

  return {
    year: Array.from(year).sort().reverse(),
    modality: Array.from(modality).sort(),
    recognition: recognitionOptions,
    researchTopic: Array.from(researchTopic).sort(),
  };
}

function usePublicationFilters() {
  const [filters, setFilters] = useQueryStates(publicationFiltersSchema);
  return { filters, setFilters };
}

type PublicationFilterControllerProps = {
  options: PublicationFilterOptions;
  filters: PublicationFilter;
  setFilters: ReturnType<typeof usePublicationFilters>['setFilters'];
};

function YearAnchors({ options }: { options: PublicationFilterOptions }) {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      smoothScrollToElement(element);
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <>
      <div className={styles.yearsWrapper}>
        <span className={styles.yearTitle}>Year</span>
        <div className={styles.yearDetails}>
          {options['year'].map((o) => (
            <a
              key={o}
              href={`#${o}`}
              className={styles.yearLink}
              onClick={(e) => handleScroll(e, o)}
            >
              {o}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

function PublicationFilterController({
  options,
  filters,
  setFilters,
}: PublicationFilterControllerProps) {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenFilter(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (filterName: (typeof filterLabels)[number], value: string) => {
    setFilters((prev) => {
      const current = prev[filterName];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [filterName]: next };
    });
  };

  const clearFilter = (filterName: (typeof filterLabels)[number]) => {
    setFilters((prev) => ({ ...prev, [filterName]: [] }));
  };

  const toggleDropdown = (label: string) => {
    setOpenFilter(openFilter === label ? null : label);
  };

  return (
    <div className={styles.filtersWrapper} ref={containerRef}>
      {filterLabels.map((l) => {
        const currentValues = filters[l];
        const isOpen = openFilter === l;
        const defaultLabel = l === 'recognition' ? 'None' : 'All';
        const displayText =
          currentValues.length === 0
            ? defaultLabel
            : currentValues.map(formatRecognitionLabel).join(', ');

        return (
          <div key={l} className={styles.filterGroup}>
            <span className={styles.filterTitle}>{l === 'researchTopic' ? 'Topic' : camelToTitle(l)}</span>

            <div className={styles.customSelectWrapper}>
              <div
                className={`${styles.filterDropdown} ${isOpen ? styles.active : ''}`}
                onClick={() => toggleDropdown(l)}
              >
                {displayText}
              </div>

              {isOpen && (
                <ul className={styles.optionsList}>
                  <li
                    className={`${styles.optionItem} ${currentValues.length === 0 ? styles.optionItemSelected : ''}`}
                    onClick={() => clearFilter(l)}
                  >
                    <span className={styles.optionLabel}>{defaultLabel}</span>
                    {currentValues.length === 0 && <CheckIcon />}
                  </li>
                  {options[l].map((o) => {
                    const selected = currentValues.includes(o);
                    return (
                      <li
                        key={o}
                        className={`${styles.optionItem} ${selected ? styles.optionItemSelected : ''}`}
                        onClick={() => toggleOption(l, o)}
                      >
                        <span className={styles.optionLabel}>{formatRecognitionLabel(o)}</span>
                        {selected && <CheckIcon />}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className={styles.optionCheck}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      <polyline points="4 12 10 18 20 6" />
    </svg>
  );
}

function FilteredList({
  signature,
  children,
}: {
  signature: string;
  children: React.ReactNode;
}) {
  const [displayed, setDisplayed] = useState({ signature, children });
  const [phase, setPhase] = useState<'in' | 'out'>('in');

  useEffect(() => {
    if (signature === displayed.signature) return;
    setPhase('out');
    const timeout = setTimeout(() => {
      setDisplayed({ signature, children });
      setPhase('in');
    }, 400);
    return () => clearTimeout(timeout);
  }, [signature, children, displayed.signature]);

  return (
    <div className={`${styles.filteredList} ${phase === 'out' ? styles.fadingOut : ''}`}>
      {displayed.children}
    </div>
  );
}

function normalizeAuthorName(name: string) {
  return name.replace(/[^a-z]/gi, '').toLocaleLowerCase();
}

function renderAuthors(authors: string[], authorWebsites: Record<string, string>): React.ReactNode {
  return (
    <>
      {authors.map((author, index) => {
        const website = authorWebsites[normalizeAuthorName(author)];
        return (
          <span key={`${author}-${index}`}>
            {index > 0 && ', '}
            {website ? (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.authorLink}
              >
                {author}
              </a>
            ) : (
              author
            )}
          </span>
        );
      })}
    </>
  );
}

const HIGHLIGHT_TERMS = ['ORAL', 'Spotlight', 'Best Paper Award'];
const HIGHLIGHT_SPLIT = /(ORAL|Spotlight|Best Paper Award)/g;

function renderJournalsInfo(text: string): React.ReactNode {
  return text.split(HIGHLIGHT_SPLIT).map((part, i) =>
    HIGHLIGHT_TERMS.includes(part) ? (
      <span key={i} className={styles.journalsHighlight}>
        {part}
      </span>
    ) : (
      part
    ),
  );
}

function PublicationItemView({
  pub,
  authorWebsites,
}: {
  pub: PublicationItem;
  authorWebsites: Record<string, string>;
}) {
  const authors = renderAuthors(pub.authors, authorWebsites);
  const thumbnailUrl = pub.thumbnailUrl;
  const hasMedal = pub.recognition.some(
    (recognition) => recognition === 'Award winning' || recognition === 'Oral/Spotlight',
  );
  const medalCount = hasMedal ? 1 : 0;
  const hasMultipleMedals = medalCount > 1;
  const medalSource = pub.journalsInfo.includes('Spotlight')
    ? '/icons/publication/medal2.png'
    : pub.recognition.includes('Award winning')
      ? '/icons/publication/medal3.png'
      : '/icons/publication/medal5.png';
  const medalLabel = pub.journalsInfo.includes('Spotlight')
    ? 'Spotlight'
    : pub.recognition.includes('Award winning')
      ? 'Best Paper'
      : 'Oral';
  return (
    <article
      className={`${styles.article} ${hasMedal ? styles.articleRecognized : ''} ${hasMultipleMedals ? styles.articleMultipleRecognitions : ''}`}
    >
      {hasMedal && (
        <div className={styles.medalIcons} title={pub.recognitionVenues?.join(', ') ?? pub.recognition.join(', ')}>
          {Array.from({ length: medalCount }, (_, index) => (
            <div key={index} className={styles.medalWithLabel}>
              <Image
                src={medalSource}
                alt={index === 0 ? 'Recognized publication' : ''}
                width={64}
                height={64}
                className={styles.medalIcon}
                sizes="(max-width: 900px) 34px, 45px"
              />
              <span className={styles.medalLabel}>{medalLabel}</span>
            </div>
          ))}
        </div>
      )}
      <div className={styles.imageTitleWrapper}>
        <div className={styles.imageWrapper}>
          <Image
            src={thumbnailUrl}
            alt={pub.title}
            fill
            sizes="(max-width: 900px) 9rem, 14rem"
            className={styles.image}
          />
        </div>
        <div className={styles.mobileDetailsWrapper}>
          <p className={styles.articleTitle}>{pub.title}</p>
          <p className={styles.authorsText}>{authors}</p>
          <p className={styles.journalsText}>{renderJournalsInfo(pub.journalsInfo)}</p>
        </div>
      </div>
      <div className={styles.infoWrapper}>
        <div className={styles.detailsWrapper}>
          <p className={styles.articleTitle}>{pub.title}</p>
          <p className={styles.authorsText}>{authors}</p>
          <p className={styles.journalsText}>{renderJournalsInfo(pub.journalsInfo)}</p>
        </div>
        <div className={styles.linksWrapper}>
          {pub.links.map(({ label, url }) => (
            <IconLink label={label} href={url} key={`${label}-${url}`} />
          ))}
        </div>
      </div>
    </article>
  );
}

function IconLink({ label, href }: { label: string; href: string }) {
  const categoryClass = styles[getLinkCategoryClass(label)];
  return (
    <a
      href={href}
      className={`${styles.iconLinkWrapper} ${categoryClass}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon label={label} />
      <span className={styles.linkLabel}>{label}</span>
    </a>
  );
}

function Icon({ label }: { label: string }) {
  if (label.toLowerCase().startsWith('pdf')) {
    return <img src="/icons/publication/file.svg" alt={label} className={styles.icon} />;
  }
  return <img src="/icons/publication/globe.svg" alt={label} className={styles.icon} />;
}

function getLinkCategoryClass(label: string): string {
  const l = label.toLowerCase();
  if (l.startsWith('pdf') || l.includes('arxiv')) return 'linkPdf';
  if (l === 'code') return 'linkCode';
  if (l.includes('data') || l.includes('rain')) return 'linkData';
  if (l.includes('supp')) return 'linkSupp';
  if (l.includes('video') || l === 'demo' || l === 'talk') return 'linkMedia';
  if (l === 'slides' || l === 'poster') return 'linkSlides';
  return 'linkPage';
}

/**
 * Converts a camelCase string to Title Case.
 * Example: "helloWorld" -> "Hello World"
 */
function camelToTitle(text: string): string {
  if (!text) return text;

  return (
    text
      // 1. Insert a space before all caps
      .replace(/([A-Z])/g, ' $1')
      // 2. Capitalize the first letter and trim potential leading space
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  );
}
