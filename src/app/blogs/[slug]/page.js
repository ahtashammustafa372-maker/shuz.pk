import React from 'react';
import { notFound } from 'next/navigation';
const db = require('../../../lib/db');

export default async function Page({ params }) {
  const { slug } = await params;
  
  let pageData = null;
  
  try {
    const pages = db.getPages();
    pageData = pages.find(p => p.slug === slug && p.type === 'blog');
  } catch (err) {
    console.error("Failed to fetch blog data:", err);
  }

  if (!pageData) {
    notFound();
  }

  return (
    <div className="fluid-container" style={{ padding: '60px 20px', minHeight: '60vh' }}>
      <div className="section-title-wrap">
        <h1 className="section-title" style={{ fontSize: '42px', marginBottom: '10px' }}>{pageData.title}</h1>
        <p style={{ color: 'var(--color-foreground-secondary)' }}>
          Published on {new Date(pageData.created_at).toLocaleDateString()}
        </p>
      </div>
      <div 
        className="page-content blog-content" 
        style={{ maxWidth: '800px', margin: '40px auto 0', fontSize: '18px', lineHeight: '1.8' }}
        dangerouslySetInnerHTML={{ __html: pageData.content }}
      />
    </div>
  );
}
