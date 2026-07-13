import React from 'react';
import { notFound } from 'next/navigation';
import dbConnect from '@/src/lib/mongoose';
import Setting from '@/src/models/Setting';
import Product from '@/src/models/Product';
import PageModel from '@/src/models/Page';

export default async function PageView({ params }) {
  const { slug } = await params;
  
  let pageData = null;
  
  try {
    await dbConnect();
    const pages = await PageModel.find({}).lean();
    pageData = pages.find(p => p.slug === slug && p.type === 'page');
  } catch (err) {
    console.error("Failed to fetch page data:", err);
  }

  if (!pageData) {
    notFound();
  }

  const settingsDoc = await Setting.findOne({ type: "seo" }).lean();
  const settings = settingsDoc ? settingsDoc.data : {};
  const contact = settings.contact || {
    address: "DHA Phase 5 Branch, Karach, See Our Stores",
    phone: "+92 323 2186889",
    facebookUrl: "#",
    instagramUrl: "#",
    karachiTimings: "01:00 PM – 12:30 AM",
    lahoreTimings: "01:30 PM – 10:30 PM"
  };

  return (
    <div className="container" style={{ padding: '60px 20px' }}>
      <h1 style={{ fontSize: '36px', fontWeight: '700', textAlign: 'center', marginBottom: '10px' }}>{pageData.title}</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '50px' }}>
        Home / <span style={{ color: '#000' }}>{pageData.title}</span>
      </p>
      
      {slug === 'contact-us' ? (
        <div className="page-layout-grid">
          {/* Left Column - Form */}
          <div className="page-layout-left">
            <div dangerouslySetInnerHTML={{ __html: pageData.content }} style={{ marginBottom: '30px' }} />
            
            <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '20px' }}>
                <input type="text" placeholder="Name" style={{ flex: '1', minWidth: '200px', padding: '15px', borderRadius: '4px', border: '1px solid #eaeaea', outline: 'none', fontSize: '15px' }} />
                <input type="email" placeholder="Email" required style={{ flex: '1', minWidth: '200px', padding: '15px', borderRadius: '4px', border: '1px solid #eaeaea', outline: 'none', fontSize: '15px' }} />
              </div>
              
              <textarea placeholder="Message" rows="8" style={{ padding: '15px', borderRadius: '4px', border: '1px solid #eaeaea', outline: 'none', fontSize: '15px', resize: 'vertical' }}></textarea>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                <input type="checkbox" id="save-info" style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                <label htmlFor="save-info" style={{ color: '#333', fontSize: '15px', cursor: 'pointer' }}>
                  Save my name, email, and website in this browser for the next time I comment.
                </label>
              </div>

              <div>
                <button type="button" style={{ backgroundColor: '#000', color: '#fff', padding: '14px 30px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold', marginTop: '10px', letterSpacing: '0.5px' }}>
                  Submit Now
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - Store Info */}
          <div className="page-layout-right">
            <div style={{ backgroundColor: '#f9f9f9', padding: '40px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>Address</h3>
                <p style={{ color: '#555', fontSize: '15px', margin: 0 }}>{contact.address}</p>
              </div>
              
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>Information</h3>
                <p style={{ color: '#555', fontSize: '15px', margin: 0 }}>{contact.phone}</p>
              </div>

              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>Social Media</h3>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <a href={contact.facebookUrl} style={{ color: '#000', fontSize: '20px' }}><i className="fab fa-facebook-f"></i></a>
                  <a href={contact.instagramUrl} style={{ color: '#000', fontSize: '20px' }}><i className="fab fa-instagram"></i></a>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>We're Open</h3>
                <p style={{ color: '#888', fontSize: '15px', marginBottom: '15px' }}>Our store has Opened for shopping</p>
                <p style={{ color: '#555', fontSize: '15px', margin: '0 0 10px 0' }}><span style={{ fontWeight: 'bold' }}>Karachi Timings:</span> {contact.karachiTimings}</p>
                <p style={{ color: '#555', fontSize: '15px', margin: 0 }}><span style={{ fontWeight: 'bold' }}>Lahore Timings:</span> {contact.lahoreTimings}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div 
          className="page-content" 
          style={{ fontSize: '16px', lineHeight: '1.8' }}
          dangerouslySetInnerHTML={{ __html: pageData.content }}
        />
      )}
    </div>
  );
}
