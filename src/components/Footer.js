'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
const InstagramIcon = ({ size = 24, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = ({ size = 24, color = "currentColor", fill = "none" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const { generalSettings } = useTheme();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [previewUrl, setPreviewUrl] = useState('');
  const [openSections, setOpenSections] = useState({ quick: false, info: false });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
        setPreviewUrl(data.previewUrl);
        setEmail('');
        alert(`Subscribed successfully! Notification sent.\n\n[Dev Only] Email preview: ${data.previewUrl}`);
      } else {
        setStatus('error');
        alert('Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
      alert('Failed to subscribe. Please try again.');
    }
  };
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Column 1: Logo & About */}
          <div className="footer-col footer-col-1">
            <Link href="/" className="footer-logo">
              <img 
                src="/images/logo.png" 
                alt="JUTAY" 
                className="footer-logo-img"
                onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} 
              />
              <span style={{ display: 'none', fontSize: '28px', fontWeight: '900', color: '#b11e22', textShadow: '2px 2px 0px #fff' }}>JUTAY</span>
            </Link>
            <p className="footer-desc">
              {generalSettings?.footer?.description || "Bringing the best of global sneaker culture to pakistan by selling Premium Shoes at fraction of the price of their brand-new counterparts"}
            </p>
          </div>

          {/* Column 4: Newsletter (Moved up on mobile via CSS order) */}
          <div className="footer-col footer-col-4">
            <h4 className="footer-heading-large">{generalSettings?.footer?.newsletterTitle || "Let's get in touch"}</h4>
            <p className="footer-newsletter-desc">{generalSettings?.footer?.newsletterDesc || "Sign up for our newsletter for updates and offers."}</p>
            <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="footer-input newsletter-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ color: '#000', backgroundColor: '#fff' }}
                required
              />
              <button type="submit" className="footer-subscribe-btn" disabled={status === 'loading'}>
                {status === 'loading' ? 'Subscribing...' : 'Subscribe now'}
              </button>
            </form>
            <div className="footer-social">
              {generalSettings?.socialLinks?.facebook && (
                <a href={generalSettings.socialLinks.facebook} className="social-icon-btn" target="_blank" rel="noopener noreferrer"><FacebookIcon size={18} color="#000" fill="#000" /></a>
              )}
              {generalSettings?.socialLinks?.instagram && (
                <a href={generalSettings.socialLinks.instagram} className="social-icon-btn" target="_blank" rel="noopener noreferrer"><InstagramIcon size={18} color="#000" /></a>
              )}
            </div>
          </div>

          {/* Column 2: Quick link */}
          <div className="footer-col footer-col-2">
            <div className="footer-heading-wrap" onClick={() => setOpenSections(prev => ({...prev, quick: !prev.quick}))}>
              <h4 className="footer-heading">Quick link</h4>
              <span className="footer-toggle-icon hide-on-desktop">{openSections.quick ? <ChevronDown size={18} /> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>}</span>
            </div>
            <ul className={`footer-links ${!openSections.quick ? 'mobile-hidden' : ''}`}>
              {generalSettings?.footerMenus?.quickLinks ? (
                generalSettings.footerMenus.quickLinks.map((link, idx) => (
                  <li key={idx}><Link href={link.url}>{link.label}</Link></li>
                ))
              ) : (
                <>
                  <li><Link href="/collections/men">Men</Link></li>
                  <li><Link href="/collections/major-loafers">Major Loafers</Link></li>
                  <li><Link href="/collections/new-arrival">New Arrival</Link></li>
                  <li><Link href="/collections/flash-sale">Flash Sale</Link></li>
                  <li><Link href="/collections/more">More</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Column 3: Information */}
          <div className="footer-col footer-col-3">
            <div className="footer-heading-wrap" onClick={() => setOpenSections(prev => ({...prev, info: !prev.info}))}>
              <h4 className="footer-heading">Information</h4>
              <span className="footer-toggle-icon hide-on-desktop">{openSections.info ? <ChevronDown size={18} /> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>}</span>
            </div>
            <ul className={`footer-links ${!openSections.info ? 'mobile-hidden' : ''}`}>
              {generalSettings?.footerMenus?.information ? (
                generalSettings.footerMenus.information.map((link, idx) => (
                  <li key={idx}><Link href={link.url}>{link.label}</Link></li>
                ))
              ) : (
                <>
                  <li><Link href="/pages/faqs">FAQs</Link></li>
                  <li><Link href="/pages/contact-us">Contact us</Link></li>
                  <li><Link href="/policies/privacy-policy">Privacy Policy</Link></li>
                  <li><Link href="/policies/terms-conditions">Terms & Conditions</Link></li>
                  <li><Link href="/policies/shipment-return-policy">Shipment & Return Policy</Link></li>
                  <li><Link href="/blogs/news">Blogs</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>{generalSettings?.footer?.copyrightText || generalSettings?.footerCopyrightText || `© Jutay ${new Date().getFullYear()} - All Rights Reserved`}</p>
          <p dangerouslySetInnerHTML={{ __html: generalSettings?.footer?.developerText || generalSettings?.footerDeveloperText || 'Developed By <span class="ozbix-text">Ozbix</span>' }} />
        </div>
      </div>
      
      {/* WhatsApp Floating Button */}
      <a href="https://wa.me/123456789" className="whatsapp-float" target="_blank" rel="noopener noreferrer">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="24" height="24" fill="#fff"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 414.7c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 334.3l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-2.1-3.6-.2-5.5 1.7-7.4 1.7-1.7 3.7-4.2 5.6-6.3 1.9-2.1 2.5-3.6 3.7-6 1.2-2.3 .6-4.4-.3-5.8-1.9-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
      </a>

      {/* Vertical Reviews Tab */}
      <div className="reviews-tab">
        <span className="star-icon">★</span> Our Reviews
      </div>
    </footer>
  );
}
