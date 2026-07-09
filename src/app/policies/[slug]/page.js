import React from 'react';
import { notFound } from 'next/navigation';
const db = require('../../../lib/db');

export default async function PolicyView({ params }) {
  const { slug } = await params;
  
  let pageData = null;
  
  try {
    const pages = db.getPages();
    pageData = pages.find(p => p.slug === slug && p.type === 'policy');
  } catch (err) {
    console.error("Failed to fetch policy data:", err);
  }

  if (!pageData) {
    notFound();
  }

  return (
      <div className="fluid-container" style={{ padding: '60px 20px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '700', textAlign: 'center', marginBottom: '10px' }}>{pageData.title}</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '50px' }}>
          Home / <span style={{ color: '#000' }}>{pageData.title}</span>
        </p>
        
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
          <div className="prose" dangerouslySetInnerHTML={{ __html: pageData.content }} style={{ lineHeight: '1.8', fontSize: '16px', color: '#333' }} />
        </div>
      </div>
  );
}
