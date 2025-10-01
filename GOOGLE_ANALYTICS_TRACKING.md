# Google Analytics Tracking - Landing Page

This document outlines all the Google Analytics events implemented in the Landing.jsx component to help you track user engagement and optimize your targeting strategy.

## Setup Required

Before the tracking events work, you need to:

1. **Add Google Analytics to your site** by adding this to your `src/app/layout.js` or main layout file in the `<head>` section:

```jsx
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=YOUR_GA_MEASUREMENT_ID`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'YOUR_GA_MEASUREMENT_ID');
  `}
</Script>
```

Replace `YOUR_GA_MEASUREMENT_ID` with your actual Google Analytics 4 measurement ID (format: G-XXXXXXXXXX).

## Tracked Events

### 1. Page View
**Event Name:** `page_view`
- **Triggered:** When the landing page loads
- **Parameters:**
  - `page_title`: "Landing Page"
  - `page_location`: Full URL
- **Use:** Track total page visits and traffic sources

### 2. Section Views
**Event Name:** `section_view`
- **Triggered:** When user scrolls and a section becomes 50% visible
- **Parameters:**
  - `section_name`: One of:
    - `hero`
    - `situations`
    - `core_capabilities`
    - `download_info`
    - `cloud_option`
    - `final_cta`
- **Use:** Understand which sections users actually read and engagement depth

### 3. Pilot Request Events

#### Pilot Request Started
**Event Name:** `pilot_request_start`
- **Triggered:** When user clicks Submit on the pilot request form
- **Parameters:**
  - `utility`: Company/utility name entered
  - `country`: Country entered
  - `device`: "desktop" or "mobile"
- **Use:** Track conversion funnel start and understand audience composition

#### Pilot Request Success
**Event Name:** `pilot_request_success`
- **Triggered:** When pilot request is successfully submitted
- **Parameters:**
  - `utility`: Company/utility name
  - `country`: Country
  - `device`: "desktop" or "mobile"
- **Use:** Track successful lead generation and segment by geography/company

#### Pilot Request Failed
**Event Name:** `pilot_request_failed`
- **Triggered:** When server returns an error
- **Parameters:**
  - `error`: Error message from server
  - `device`: "desktop" or "mobile"
- **Use:** Identify and fix form issues

#### Pilot Request Error
**Event Name:** `pilot_request_error`
- **Triggered:** When network/client error occurs
- **Parameters:**
  - `error`: Error message
  - `device`: "desktop" or "mobile"
- **Use:** Diagnose technical issues

### 4. Download Info Events

#### Download Info Started
**Event Name:** `download_info_start`
- **Triggered:** When user clicks "Send Me the Information"
- **Parameters:**
  - `company`: Company name entered
- **Use:** Track interest in detailed materials

#### Download Info Success
**Event Name:** `download_info_success`
- **Triggered:** When download request succeeds
- **Parameters:**
  - `company`: Company name
- **Use:** Track successful information distribution and target companies

#### Download Info Failed/Error
**Event Names:** `download_info_failed`, `download_info_error`
- **Parameters:**
  - `error`: Error details
- **Use:** Identify and fix download form issues

### 5. Sign In Events

**Event Name:** `sign_in_toggle`
- **Triggered:** When user switches between sign in and request access forms
- **Parameters:**
  - `location`: One of:
    - `desktop_form_header`
    - `desktop_form_bottom`
    - `mobile_form_header`
    - `desktop_signin`
    - `mobile_signin`
  - `action`: "open" or "back_to_request"
- **Use:** Track existing customer engagement

**Event Name:** `sign_in_attempt`
- **Triggered:** When user clicks Sign In button
- **Parameters:**
  - `location`: "desktop_form" or "mobile_form"
- **Use:** Monitor login activity

### 6. Interaction Events

#### Situation Card Clicks
**Event Name:** `situation_card_click`
- **Triggered:** When user clicks on a situation/use case card
- **Parameters:**
  - `category`: Type of situation (e.g., "Data Request", "New Analysis Needed")
  - `position`: Card position (1-8)
- **Use:** Understand which use cases resonate most with your audience

#### Capability Card Clicks
**Event Name:** `capability_card_click`
- **Triggered:** When user clicks on a core capability card
- **Parameters:**
  - `capability`: One of:
    - `data_stays_with_you`
    - `nerc_cip_compliant`
    - `smart_triaging`
    - `document_automation`
    - `custom_llm_deployment`
    - `real_time_synthesis`
- **Use:** Identify most compelling features for your audience

#### Final CTA Click
**Event Name:** `final_cta_click`
- **Triggered:** When user clicks the bottom "Request Free Pilot" button
- **Parameters:**
  - `cta_location`: "bottom_section"
  - `cta_text`: "Request Free Pilot"
- **Use:** Track engagement from bottom of page

## Viewing Your Data in Google Analytics

### In GA4 Dashboard:

1. **Go to Reports > Engagement > Events**
   - See all event counts and top events
   - Click on any event name to see parameter details

2. **Create Custom Reports:**
   - Go to Explore
   - Create a new exploration
   - Add dimensions: Event name, Custom parameters
   - Add metrics: Event count, Users

### Key Reports to Create:

#### Conversion Funnel
1. Page views
2. Section views (how far users scroll)
3. Pilot request starts
4. Pilot request successes

#### Geographic Insights
- Filter `pilot_request_success` by `country` parameter
- See which countries show most interest

#### Company Analysis
- Filter `pilot_request_success` by `utility` parameter
- Track which types of companies are interested

#### Use Case Interest
- Filter `situation_card_click` by `category`
- See which situations resonate most

#### Feature Interest
- Filter `capability_card_click` by `capability`
- Identify most compelling features

#### Device Performance
- Compare `pilot_request_success` by `device` parameter
- Optimize for desktop vs mobile

## Targeting Recommendations

Based on the tracked data, you can:

1. **Geographic Targeting:** Focus marketing in countries with high `pilot_request_success` rates
2. **Content Optimization:** Emphasize use cases with high `situation_card_click` rates
3. **Feature Messaging:** Highlight capabilities with high click rates
4. **Form Optimization:** Fix issues causing `pilot_request_failed` events
5. **Device Strategy:** Optimize experience for device type with better conversion
6. **Engagement Depth:** If users don't reach later sections, consider reordering content

## Next Steps

1. Set up Google Analytics 4 measurement ID
2. Add GA script to your site layout
3. Test events in GA4 DebugView (add `?debug_mode=true` to URL)
4. Create custom dashboards for key metrics
5. Set up conversion goals for `pilot_request_success` and `download_info_success`
6. Review data weekly to optimize targeting and content

## Privacy Considerations

The tracking captures:
- **NO personal emails** (not sent to GA)
- Company/utility names (for B2B context)
- Geographic info (country only)
- Interaction patterns

Ensure this aligns with your privacy policy and GDPR/compliance requirements.