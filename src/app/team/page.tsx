'use client';

import Image from 'next/image';
import Title from '@/components/Title';
import FadeIn from '@/components/FadeIn';
import { smoothScrollToElement } from '@/utils/smoothScroll';
import styles from './page.module.css';
import peopleData from '../../../public/data/people.json';

interface Member {
  name: string;
  position: string;
  image: string;
  website?: string | null;
  email?: string | null;
  github?: string | null;
}

interface Alumnus {
  name: string;
  degree: string;
  current: string;
  website: string | null;
}

const sections: { key: keyof typeof peopleData.members; title: string }[] = [
  { key: 'faculty_and_researchers', title: 'Faculty & Researchers' },
  // { key: 'graduate_students', title: 'Graduate Students' },
  { key: 'phd_students', title: 'Ph.D. Students' },
  { key: 'masters_students', title: "Master's Students" },
  { key: 'undergraduate_interns', title: 'Undergraduate Interns' },
  { key: 'robots', title: 'Robots' },
  { key: 'administrative_staff', title: 'Administrative Staff' },
];

function MemberCard({ member }: { member: Member }) {
  const links = [
    { url: member.website, label: 'Website', icon: '/icons/team/website.svg' },
    {
      url: member.email ? `mailto:${member.email}` : null,
      label: 'Email',
      icon: '/icons/team/email.svg',
    },
    { url: member.github, label: 'GitHub', icon: '/icons/team/github.svg' },
  ].filter((link) => link.url);

  const body = (
    <>
      <div className={styles.imageWrapper}>
        <Image
          src={member.image}
          alt={member.name}
          fill
          sizes="(max-width: 900px) 33vw, 22rem"
          className={styles.image}
        />
      </div>
      <span className={styles.name}>{member.name}</span>
      {/*<span className={styles.position}>{member.position}</span>*/}
      {member.position && (
        <span className={styles.position}>
          {member.position.split('\n').map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </span>
      )}
    </>
  );

  return (
    <div className={`${styles.card} ${member.website ? styles.cardClickable : ''}`}>
      {member.website ? (
        <a
          href={member.website}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cardLink}
          aria-label={member.name}
        >
          {body}
        </a>
      ) : (
        body
      )}
      {links.length > 0 && (
        <div className={styles.links}>
          {links.map((link) => (
            <a
              key={link.label}
              href={link.url!}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkBox}
              aria-label={link.label}
            >
              <img src={link.icon} alt={link.label} className={styles.linkIcon} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function AlumniSection({
  id,
  title,
  subtitle,
  members,
}: {
  id?: string;
  title: string;
  subtitle?: string;
  members: Alumnus[];
}) {
  return (
    <section id={id} className={styles.alumniSection}>
      <div className={styles.alumniHeader}>
        <div>
          <h2 className={styles.alumniTitle}>{title}</h2>
          {subtitle && <span className={styles.alumniSubtitle}>{subtitle}</span>}
        </div>
        <div className={styles.alumniList}>
          {members.map((member) => (
            <div key={member.name} className={styles.alumniRow}>
              <span>
                {member.website ? (
                  <a
                    href={member.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.alumniName} ${styles.alumniNameLink}`}
                  >
                    {member.name}
                  </a>
                ) : (
                  <span className={styles.alumniName}>{member.name}</span>
                )}
              </span>
              <span className={styles.alumniDegree}>
                {(() => {
                  const match = member.degree.match(/^(.*?)[,.]?\s*(Co-advised.*)$/i);
                  if (match) {
                    return (
                      <>
                        {match[1]}
                        <br />
                        <span className={styles.alumniDegreeSub}>{match[2]}</span>
                      </>
                    );
                  }
                  return member.degree;
                })()}
              </span>
              <span className={styles.alumniCurrent}>{member.current}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionAnchors() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      smoothScrollToElement(element);
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <div className={styles.anchorWrapper}>
      <span className={styles.anchorTitle}>Team</span>
      <div className={styles.anchorList}>
        {sections.map(({ key, title }) => (
          <a
            key={key}
            href={`#${key}`}
            className={styles.anchorLink}
            onClick={(e) => handleScroll(e, key)}
          >
            {title}
          </a>
        ))}
        {/* Alumni 링크 따로 추가 */}
        <a href="#alumni" className={styles.anchorLink} onClick={(e) => handleScroll(e, 'alumni')}>
          Alumni
        </a>        
      </div>
    </div>
  );
}

export default function TeamPage() {
  return (
    <div className={styles.pageContainer}>
      <FadeIn>
        <Title title="Our Team" />
      </FadeIn>
      <div className={styles.contentWrapper}>
        <aside className={styles.anchorPanel}>
          <FadeIn>
            <SectionAnchors />
          </FadeIn>
        </aside>
        <div className={styles.mainContent}>
          {sections.map(({ key, title }) => {
            const members = peopleData.members[key] as Member[];
            return (
              <FadeIn key={key}>
                <section className={styles.section}>
                  <h2 id={key} className={styles.sectionTitle}>
                    {title}
                  </h2>
                  <div className={styles.grid}>
                    {members.map((member) => (
                      <MemberCard key={member.name} member={member} />
                    ))}
                  </div>
                </section>
              </FadeIn>
            );
          })}
          <FadeIn>
            <AlumniSection
              id="alumni"
              title="Alumni"
              members={peopleData.members.alumni_graduate as Alumnus[]}
            />
          </FadeIn>
          <FadeIn>
            <AlumniSection
              id="alumni_ug_intern"
              title="Alumni"
              subtitle="Undergrad Interns"
              members={peopleData.members.alumni_undergrad as Alumnus[]}
            />
          </FadeIn>
          <FadeIn>
            <AlumniSection
              id="alumni_ug_intl_intern"
              title="Alumni"
              subtitle="Int'l UG Interns"
              members={peopleData.members.alumni_intl_undergrad as Alumnus[]}
            />
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
