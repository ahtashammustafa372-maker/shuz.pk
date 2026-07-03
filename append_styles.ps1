$css = @"

/* =========================================
   NEW HEADER STYLES (JUTAY CLONE)
   ========================================= */

.site-header {
  width: 100%;
  font-family: var(--font-body);
}

.top-bar {
  background-color: #b11e22; /* Deep Red */
  color: #ffffff;
  font-size: 13px;
  font-weight: 500;
  padding: 8px 0;
}

.top-bar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top-bar-left {
  display: flex;
  gap: 20px;
}

.social-link-top {
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  color: #fff;
}

.social-link-top:hover {
  opacity: 0.8;
}

.top-bar-center {
  flex: 1;
  text-align: center;
}

.top-bar-right {
  text-align: right;
}

.middle-bar {
  background-color: #ffffff;
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
}

.middle-bar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
}

.middle-bar-search {
  display: flex;
  align-items: center;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 8px 12px;
  width: 250px;
}

.search-icon {
  color: #666;
  margin-right: 8px;
}

.search-input-box {
  border: none;
  outline: none;
  font-size: 14px;
  width: 100%;
}

.middle-bar-logo {
  text-align: center;
}

.logo-img {
  height: 60px;
  width: auto;
}

.middle-bar-icons {
  display: flex;
  justify-content: flex-end;
  gap: 25px;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #000;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  color: #b11e22;
}

.cart-count-badge {
  position: absolute;
  top: -5px;
  right: -8px;
  background-color: #b11e22;
  color: #fff;
  font-size: 10px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bottom-nav {
  background-color: #000000;
  color: #ffffff;
}

.bottom-nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

.nav-list {
  display: flex;
  justify-content: center;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-list li {
  margin: 0 15px;
}

.nav-list a {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ffffff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  padding: 16px 5px;
  text-transform: capitalize;
  transition: color 0.2s;
}

.nav-list a:hover {
  color: #b11e22;
}

/* =========================================
   NEW FOOTER STYLES (JUTAY CLONE)
   ========================================= */

.site-footer {
  background-color: #000000;
  color: #ffffff;
  padding: 60px 0 20px;
  font-family: var(--font-body);
  position: relative;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 3fr 1.5fr 1.5fr 3fr;
  gap: 40px;
  margin-bottom: 40px;
}

.footer-col-1 .footer-logo-img {
  height: 80px;
  margin-bottom: 15px;
}

.footer-desc {
  font-size: 13px;
  line-height: 1.6;
  color: #cccccc;
  max-width: 300px;
}

.footer-heading {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 25px;
  color: #ffffff;
}

.footer-heading-large {
  font-size: 26px;
  font-weight: 400;
  margin-bottom: 15px;
  color: #ffffff;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: #cccccc;
  text-decoration: none;
  font-size: 13px;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #ffffff;
}

.footer-newsletter-desc {
  font-size: 13px;
  color: #cccccc;
  margin-bottom: 20px;
}

.footer-newsletter-form {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 320px;
}

.footer-input {
  width: 100%;
  padding: 12px 15px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
}

.footer-subscribe-btn {
  background-color: #ffffff;
  color: #000000;
  border: none;
  border-radius: 4px;
  padding: 12px 15px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 150px;
}

.footer-subscribe-btn:hover {
  background-color: #e0e0e0;
}

.footer-social {
  display: flex;
  gap: 15px;
}

.social-icon-btn {
  background-color: #ffffff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: opacity 0.2s;
}

.social-icon-btn:hover {
  opacity: 0.8;
}

.footer-bottom {
  border-top: 1px solid #333333;
  padding-top: 20px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  font-size: 13px;
  color: #cccccc;
  gap: 5px;
}

.ozbix-text {
  color: #b11e22;
  font-weight: 700;
}

/* Floating Elements */
.whatsapp-float {
  position: fixed;
  bottom: 20px;
  right: 40px; /* Offset to not overlap with review tab */
  background-color: #25d366;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  z-index: 1000;
  transition: transform 0.2s;
}

.whatsapp-float:hover {
  transform: scale(1.1);
}

.reviews-tab {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%) rotate(-90deg);
  transform-origin: right bottom;
  background-color: #000000;
  color: #ffffff;
  padding: 8px 15px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid #333333;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  z-index: 900;
  margin-right: -14px;
}

.star-icon {
  color: #f1c40f;
  font-size: 18px;
}

"@

Add-Content -Path "src\app\globals.css" -Value $css
