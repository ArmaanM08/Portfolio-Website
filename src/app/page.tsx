import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Certifications from '../components/Certifications';
import Skills from '../components/Skills';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import fs from 'fs';
import path from 'path';

export const revalidate = 0;

export default async function Home() {
  const filePath = path.join(process.cwd(), 'src/data/portfolio.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const portfolioData = JSON.parse(fileContents);

  return (
    <>
      <Hero data={portfolioData.hero} resume={portfolioData.resume} />
      <Marquee />
      <Experience data={portfolioData.experience} education={portfolioData.education} />
      <Projects data={portfolioData.projects} />
      <Certifications data={portfolioData.certifications} />
      <Skills data={portfolioData.skills} projectsCount={portfolioData.projects.length} />
      <Contact data={portfolioData.contact} />
      <Footer contact={portfolioData.contact} resume={portfolioData.resume} />
    </>
  );
}