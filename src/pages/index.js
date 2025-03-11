import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

export async function getStaticProps() {
    const filePath = path.join(process.cwd(), 'cv.md');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { content, data } = matter(fileContents);

    const processedContent = remark().use(html).processSync(content);
    const contentHtml = processedContent.toString();

    return { props: { contentHtml, data } };
}

export default function Home({ contentHtml, data }) {
    return (
        <div style={{ maxWidth: '800px', margin: 'auto', fontFamily: 'Arial' }}>
            <h1>{data.title}</h1>
            <h2>{data.role}</h2>
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </div>
    );
}
