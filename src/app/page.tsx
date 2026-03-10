import Hero from '../components/Hero';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import Contact from '../components/Contact';
import fs from 'fs';
import path from 'path';

export const revalidate = 0; // Disable static caching so edits reflect immediately

export default async function Home() {
  const filePath = path.join(process.cwd(), 'src/data/portfolio.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const portfolioData = JSON.parse(fileContents);

  return (
    <>
      <Hero data={portfolioData.hero} />
      <Projects data={portfolioData.projects} />
      <Skills data={portfolioData.skills} />
      <Contact data={portfolioData.contact} />
    </>
  );
}
