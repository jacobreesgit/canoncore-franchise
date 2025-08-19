const { chromium } = require('playwright');

async function testFontFix() {
  console.log('🔧 Testing Tor-compatible font fix...');
  
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    console.log('📍 Navigating to CanonCore with font fixes...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Check font usage after fix
    const fontInfo = await page.evaluate(() => {
      const computedStyle = window.getComputedStyle(document.body);
      return {
        bodyFont: computedStyle.fontFamily,
        h1Font: window.getComputedStyle(document.querySelector('h1') || document.body).fontFamily,
        buttonFont: window.getComputedStyle(document.querySelector('button') || document.body).fontFamily,
        textRendering: computedStyle.textRendering,
        fontSmoothing: computedStyle.webkitFontSmoothing
      };
    });
    
    console.log('📊 Font configuration after fix:');
    console.log(`   Body: ${fontInfo.bodyFont}`);
    console.log(`   H1: ${fontInfo.h1Font}`);  
    console.log(`   Button: ${fontInfo.buttonFont}`);
    console.log(`   Text Rendering: ${fontInfo.textRendering}`);
    console.log(`   Font Smoothing: ${fontInfo.fontSmoothing}`);
    
    // Take comparison screenshot
    await page.screenshot({ 
      path: 'canoncore-font-fixed.png',
      fullPage: true
    });
    
    console.log('✅ Fixed font screenshot saved as canoncore-font-fixed.png');
    
    // Verify Tor-compatible fonts are being used
    const isTorCompatible = fontInfo.bodyFont.includes('Arial') || 
                           fontInfo.bodyFont.includes('Liberation Sans');
    
    console.log(`🛡️  Tor Browser Compatible: ${isTorCompatible ? '✅ YES' : '❌ NO'}`);
    
    if (isTorCompatible) {
      console.log('🎉 Font fix successfully applied!');
      console.log('   • Arial-based font stack for maximum compatibility');
      console.log('   • Liberation fonts for Linux compatibility');
      console.log('   • Enhanced text rendering for better legibility');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testFontFix();