import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// Don't try to pre-load html2pdf - we'll import it on demand

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'cv.md');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(fileContents);
  const processedContent = remark().use(html).processSync(content);
  const contentHtml = processedContent.toString();

  return {
    props: {
      contentHtml,
      data
    }
  };
}

export default function Home({ contentHtml, data }) {
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme) {
        setDarkMode(storedTheme === "dark");
      } else {
        // Default to user's preferred color scheme
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(prefersDark);
        localStorage.setItem("theme", prefersDark ? "dark" : "light");
      }
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const downloadPDF = async () => {
    try {
      const element = document.getElementById('cv-content');
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default || html2pdfModule;
      
      const opt = {
        margin: [10, 10],
        filename: 'Ruan_Kruger_CV.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    }
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className={darkMode ? 'dark-mode' : 'light-mode'}>
      <Head>
        <title>{data.title} | {data.role}</title>
        <meta name="description" content={`${data.title} - ${data.role} - Professional CV`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <span>{data.title.split(' ')[0]}</span>
            <span className="last-name">{data.title.split(' ')[1]}</span>
          </div>
          <div className="nav-buttons">
            <button onClick={toggleDarkMode} className="theme-toggle" aria-label="Toggle dark mode">
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
              <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
            </button>
          </div>
        </div>

        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <ul>
            <li><button onClick={() => scrollToSection('profile')}>Profile</button></li>
            <li><button onClick={() => scrollToSection('experience')}>Experience</button></li>
            <li><button onClick={() => scrollToSection('skills')}>Skills</button></li>
            <li><button onClick={() => scrollToSection('education')}>Education</button></li>
            <li><button onClick={() => scrollToSection('interests')}>Interests</button></li>
            <li><button onClick={downloadPDF} className="download-button-mobile">Download CV</button></li>
          </ul>
        </div>
      </nav>

      <main>
        {/* Hero section */}
        <section className="hero">
          <div className="hero-content">
            <div className="hero-text">
              <h2>{data.role}</h2>
              <p className="subtitle">Passionate about performance optimization, scalable architectures, and delivering robust software solutions</p>
              <div className="cta-buttons">
                <a href="mailto:rkruger270@gmail.com" className="primary-button">Contact Me</a>
                <button onClick={downloadPDF} className="secondary-button">Download CV</button>
              </div>
            </div>
            <div className="hero-image">
              <div className="profile-image-container">
                <img src="/profile-image.jpg" alt={data.title} className="profile-image" />
              </div>
            </div>
          </div>
        </section>

        {/* CV Content */}
        <div id="cv-content" className="cv-container">
          <section id="profile" className="cv-section">
            <h3 className="section-title">Personal Profile</h3>
            <div className="card">
              <p>Senior Software Engineer & Integration Expert with a strong technical background. Highly skilled in cloud architecture, microservices, and API development. Passionate about performance optimization, scalable architectures, and delivering robust software solutions.</p>
            </div>
            
            <div className="contact-info">
              <div className="contact-card">
                <h4>Contact Information</h4>
                <ul>
                  <li>📍 Location: Langebaan, Western Cape, South Africa</li>
                  <li>📧 Email: rkruger270@gmail.com</li>
                  <li>📱 Phone: 072 227 3736</li>
                  <li>🌐 Portfolio: <a href="https://rrkruger.co.za" target="_blank" rel="noopener noreferrer">rrkruger.co.za</a></li>
                  <li>🔗 LinkedIn: <a href="https://linkedin.com/in/rkruger" target="_blank" rel="noopener noreferrer">linkedin.com/in/rkruger</a></li>
                </ul>
              </div>
              
              <div className="contact-card">
                <h4>Career Objective</h4>
                <p>Seeking a challenging role where I can grow both technically and personally, while contributing to the success of the organization through innovation and leadership.</p>
              </div>
            </div>
          </section>

          <section id="skills" className="cv-section">
            <h3 className="section-title">Skills Summary</h3>
            <div className="skills-grid">
              <div className="skill-card">
                <h4>Languages & Frameworks</h4>
                <div className="skill-tags">
                  <span>.NET (9+ years)</span>
                  <span>C#</span>
                  <span>JavaScript</span>
                  <span>TypeScript</span>
                  <span>Angular</span>
                  <span>HTML</span>
                  <span>CSS</span>
                </div>
              </div>
              
              <div className="skill-card">
                <h4>Backend & Database</h4>
                <div className="skill-tags">
                  <span>SQL Server</span>
                  <span>Oracle</span>
                  <span>Web API</span>
                  <span>Azure CICD</span>
                  <span>API Management</span>
                </div>
              </div>
              
              <div className="skill-card">
                <h4>DevOps & CMS</h4>
                <div className="skill-tags">
                  <span>Sitefinity</span>
                  <span>Episerver</span>
                  <span>Umbraco</span>
                  <span>PowerBI</span>
                </div>
              </div>
              
              <div className="skill-card">
                <h4>Testing & Performance</h4>
                <div className="skill-tags">
                  <span>Unit Tests</span>
                  <span>TDD</span>
                  <span>Code Optimization</span>
                </div>
              </div>
              
              <div className="skill-card">
                <h4>Soft Skills</h4>
                <div className="skill-tags">
                  <span>Technical Leadership</span>
                  <span>Teamwork</span>
                  <span>Propblem solving</span>
                  <span>Adaptability</span>
                  <span>Mentorship</span>
                </div>
              </div>
            </div>
          </section>

          <section id="experience" className="cv-section">
            <h3 className="section-title">Work Experience</h3>
            
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-date">2021 - Present</div>
                <div className="timeline-content">
                  <h4>Senior Software Engineer | Tech Lead @ MRI Software</h4>
                  <ul className="job-details">
                    <li>Leading the Commercial Team on a large-scale central data API hub project</li>
                    <li>Developed and maintained integration services using .NET Core, SQL, and Umbraco</li>
                    <li>Technical oversight on architectural design, code reviews, and pull request approvals</li>
                    <li>Mentoring junior developers and staying up-to-date with emerging tech trends</li>
                  </ul>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-date">2020 - Present</div>
                <div className="timeline-content">
                  <h4>Lead Developer @ CS Diamonds</h4>
                  <ul className="job-details">
                    <li>Developed an online diamond tender system using .NET Core & Angular</li>
                    <li>Implemented headless architecture with API-driven backend</li>
                    <li>Processed tenders over $30M each since 2021</li>
                  </ul>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-date">2017 - 2021</div>
                <div className="timeline-content">
                  <h4>Software Engineer @ Responsive Studio</h4>
                  <ul className="job-details">
                    <li>Built enterprise CMS projects for Old Mutual, Casino Royal, and Milan Fashion Week</li>
                    <li>Integrated Power BI analytics, Episerver CMS, and secure form data transfers</li>
                    <li>Led API integrations for global companies (UK, Italy, South Africa)</li>
                  </ul>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-date">2016 - 2017</div>
                <div className="timeline-content">
                  <h4>IT Developer @ Truworths</h4>
                  <ul className="job-details">
                    <li>Developed fashion & online applications in Angular, .NET, and Oracle</li>
                    <li>Designed an automated image migration system for enterprise data</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
          
          <section id="education" className="cv-section">
            <h3 className="section-title">Education & Certifications</h3>
            <div className="education-container">
              <div className="education-card">
                <h4>BSc Computer Science</h4>
                <p className="institution">North-West University (2012 - 2015)</p>
              </div>
              <div className="education-card">
                <p>Matriculated from Diamantveld High School (2011)</p>
              </div>
            </div>
          </section>
          
          <section id="interests" className="cv-section">
            <h3 className="section-title">Personal Interests & Hobbies</h3>
            <div className="interests-container">
              <div className="interest-card">
                <h4>Tech & Development</h4>
                <p>Performance optimization, AI, cloud computing</p>
              </div>
              <div className="interest-card">
                <h4>Outdoor Activities</h4>
                <p>Fishing, snowboarding, kite surfing, traveling</p>
              </div>
              <div className="interest-card">
                <h4>Sports</h4>
                <p>Rugby, cricket, tennis, cross-country</p>
              </div>
            </div>
            <div className="closing-note">
              <p>Interested in discussing opportunities? Let's connect! 🚀</p>
            </div>
          </section>
        </div>
      </main>

      <footer>
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Ruán Kruger. All Rights Reserved.</p>
          <div className="social-links">
            <a href="https://linkedin.com/in/rkruger" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a href="https://github.com/rkruger" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}