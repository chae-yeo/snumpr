import Image from 'next/image';
import Title from '@/components/Title';
import FadeIn from '@/components/FadeIn';
import styles from './page.module.css';
import { FormIcon } from '@/components/Icons';


const links = {
  googleFormGrad: "https://forms.gle/UZG6x73bueu2szhy6", // Grad application
  googleFormUGIntern: "https://forms.gle/rzTYgEBT1CjsLL6W8", // Grad application
};

export default function JoinUsPage() {
  return (
    <main className={styles.pageContainer}>
      <FadeIn>
        <Title title="Join Us" />
      </FadeIn>

      <FadeIn>
        <div className={styles.noticeBox}>
          <h2 className={styles.noticeTitle}>Spring 2027 Applicants</h2>
          <p className={styles.noticeText}>
            We will have openings for Spring 2027 applicants. Detailed number of slots will be announced later. 
          </p>

          <h3 className={styles.noticeSubTitle}>Ph.D. Opportunities</h3>
          <ul className={styles.noticeList}>
            <li>
              <strong>Department of Electrical and Computer Engineering</strong> — ? Slots
            </li>
            <li>
              <strong>AI Graduate School</strong> (formerly, IPAI) - ? Slots
            </li>
          </ul>

          <h3 className={styles.noticeSubTitle}>MS/Ph.D. Opportunities</h3>
          <ul className={styles.noticeList}>
            <li>
              <strong>Department of Electrical and Computer Engineering</strong> — ? Slots
            </li>
            <li>
              <strong>AI Graduate School</strong> (formerly, IPAI) - ? Slots
            </li>
          </ul>

          <h3 className={styles.noticeSubTitle}>MS Opportunities</h3>
          <ul className={styles.noticeList}>
            <li>
              <strong>Department of Electrical and Computer Engineering</strong> — ? Slots
            </li>
            <li>
              <strong>AI Graduate School</strong> (formerly, IPAI) - ? Slots
            </li>
          </ul>
        </div>
      </FadeIn>

      <FadeIn>
        <section className={styles.section}>
          <p className={styles.heroDescription}>
            {`If you are interested in working with us, (1) please read below and fill up the Google form and (2) send me an email if you want to hear from me quickly.`}
          </p>
          <p>
            <a
              href={links.googleFormGrad}
              className={`${styles.linkButton} ${styles.graduateBtn}`}
              target="_blank"
              rel="noreferrer"
            >
              <FormIcon className={styles.formIcon} />
              Google Form: Graduate Application
            </a>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <a
              href={links.googleFormUGIntern}
              className={`${styles.linkButton} ${styles.undergradBtn}`}
              target="_blank"
              rel="noreferrer"
            >
              <FormIcon className={styles.formIcon} />
              Google Form: Undergraduate Internship Application
            </a>
          </p>
        </section>
      </FadeIn>

      <FadeIn>
        <section className={`${styles.section} ${styles.aboutSection}`}>
          <h2 className={styles.sectionTitle}>About us</h2>
          <p className={styles.description}>
            The team&apos;s primary focus is to get you succeeded in your career path. Customizing
            to your interest, we try to help your way to reach the goal after you graduate the lab.
            Most of our team members are for academic positions (<i>e.g.</i>, faculty, world class
            industry researchers) and a few are for engineering positions (<i>e.g.</i>, world class
            software companies). We mostly aim for sharing our results in top venus in computer
            vision and machine learning (<i>e.g.</i>, CVPR, ICCV, ECCV, NeurIPS, ICLR, ICML, CoRL, ICRA) and
            contribute to open source softwares to benefit other researchers including ourselves.
          </p>
          {/* <div className={styles.imageWrapper}>
            <Image
              src="/images/join-us/homecoming_protected.jpg"
              alt="The first homecoming @ Gangnam, Seoul"
              width={1600}
              height={1067}
              sizes="(max-width: 900px) 100vw, 80vw"
              className={styles.image}
            />
            <div className={styles.captionArea}>
              <span className={styles.caption}>The first homecoming @ Gangnam, Seoul</span>
              <span className={styles.date}>(May 28, 2024)</span>
            </div>
          </div> */}
        </section>
      </FadeIn>

      <FadeIn>
        <section className={styles.section}>
          <div className={styles.infoContainer}>
            <div className={styles.infoRow}>
              <h3 className={styles.infoTitle}>Our Daily Life</h3>
              <p className={styles.infoContent}>
                We want to come up with working ideas for a lot of bottlenecks in
                visual/multi-modal understanding problems and relevant machine learning problems.
                We read papers, discuss with fellow students and faculty, implement them and come
                up with new ideas for the issues in the state of the arts. We welcome any crazy
                ideas to try and discuss among the team and the faculty is always open to discuss
                on anything.
              </p>
            </div>

            {/* <div className={styles.infoRow}>
              <h3 className={styles.infoTitle}>Resources & Development Environment</h3>
              <p className={styles.infoContent}>
                {`We try our best to provide you the best development environments (standing desks, noise cancelling headphones (depending on funding situation) and etc.). Each graduate student will have a state of the art workstation equipped with one A6000 and a 39" wide curved monitor for fast prototyping. We are equipped with roughly 80 GPU's (A6000 or 3090) (roughtly 6+ GPUs per person).
We are buying more!`}
              </p>
            </div> */}
            {/* <div className={styles.infoRow}>
              <h3 className={styles.infoTitle}>Monetary compensation</h3>
              <p className={styles.infoContent}>
                We try our best to give you the best of monetary compensation. Usually, most of our
                team members are paid to the legally allowed maximum graduate student salaries and
                more for additional project workloads if you want to be involved.
              </p>
            </div> */}
            <div className={styles.infoRow}>
              <h3 className={styles.infoTitle}>Collaborations</h3>
              <p className={styles.infoContent}>
                We work closely with{' '}
                <a
                  href="https://allenai.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.infoLink}
                >
                  Allen Institute for AI (AI2)
                </a>
                ,{' '}
                <a
                  href="https://www.cs.washington.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.infoLink}
                >
                  computer science at University of Washington
                </a>
                ,{' '}
                <a
                  href="https://www.massgeneral.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.infoLink}
                >
                  Harvard medical school via Massachusetts General Hospital
                </a>
                ,{' '}
                <a
                  href="https://cse.umn.edu/cs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.infoLink}
                >
                  computer science at University of Minnesota, Twin City
                </a>
                , and{' '}
                <a
                  href="https://www.cs.umd.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.infoLink}
                >
                  computer science at University of Maryland, College Park
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className={`${styles.section} ${styles.researchTopicsSection}`}>
          <h2 className={styles.sectionTitle}>Research Topics</h2>
          <div className={styles.researchGrid}>
            <article className={styles.card}>
              <h3 className={styles.cardTitle}>Machine Learning, Continual (Un-)Learning, Knowledge Transfer</h3>
              <p className={styles.cardDesc}>
                We try to transfer knowledge in models to expedite learning and reasoning. 
                We focus on model adaptability, efficiently updating.
                It also connects to continuous evolution of models, reason in dynamic/real-world environments with minimal computational overhead.
              </p>
            </article>
            <article className={styles.card}>
              <h3 className={styles.cardTitle}>Multi-modal / Agentic AI</h3>
              <p className={styles.cardDesc}>
                We try to build models to understand languages alongside with visual signals. Other
                than the vision-and-language understanding, we are also interested in various
                modalities including sketch, diagram and neuromorphic (or event) understanding.
              </p>
            </article>
            <article className={styles.card}>
              <h3 className={styles.cardTitle}>Video and Language</h3>
              <p className={styles.cardDesc}>
                We try to architect new models for understanding videos, a long-waited open problem in computer vision.
                We want to learn a model to capture complex temporal dynamics and rich context across long video sequences along with language understanding.
              </p>
            </article>
            <article className={styles.card}>
              <h3 className={styles.cardTitle}>Embodied / Physical AI</h3>
              <p className={styles.cardDesc}>
                Combining few-shot, continual video understanding with language understanding, we
                try to architect new models to build a robotics agent to help household tasks
                (<i>e.g.</i>, bring a cup of water from the kitchen).
              </p>
            </article>
          </div>
        </section>
      </FadeIn>

      {/* <FadeIn>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Fill up the Google form here: 
            <a
              href={links.googleForm}
              className={styles.linkButton}
              target="_blank"
              rel="noreferrer"
            >
              <FormIcon className={styles.formIcon} />
              Google Form Link
            </a>
          </h>
          {p className={styles.description}>
            {`We are a team of researchers and engineers who are serious in machine learning and computer vision.
Here are our answers to some of frequently asked questions regarding joining our group.`}
          </p>
        </section>
      </FadeIn> */}


    </main>
  );
}
