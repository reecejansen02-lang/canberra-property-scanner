# Canberra Property Scanner

**A mobile-first web app for ACT residential property investment analysis.**

## Overview

Canberra Property Scanner helps you search and analyze residential properties in the ACT to determine if they're potentially good investments. V1 focuses on core functionality with sample data.

## Features

- 🔍 **Property Search** – Filter by suburb and property type
- 💰 **Investment Calculator** – Live calculations for rental yield and cash flow
- 📊 **Investment Score** – Quick assessment based on multiple metrics
- 📱 **Mobile-First** – Optimized for iPhone and mobile devices
- 🏠 **Sample Data** – 4 demo properties to explore

## Metrics & Calculations

- **Gross Rental Yield** – Annual rent ÷ Purchase price
- **Annual Rent** – Weekly rent × 52
- **Annual Interest** – (Loan amount × Interest rate) ÷ 100
- **Annual/Weekly Cash Flow** – Annual rent − Interest − Expenses
- **Investment Score** – Composite score (0–100) based on cash flow, yield, and equity

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Tech Stack

- **Next.js 14** – React framework
- **TypeScript** – Type safety
- **Tailwind CSS** – Mobile-first styling
- **Vercel** – Deployment

## Data Strategy

V1 uses **sample ACT property data**. Future versions will integrate legitimate property data sources:
- Domain API (pending application approval)
- ACT government open data
- Other ethical/licensed APIs

We do **not** scrape realestate.com.au or Domain due to ToS restrictions.

## V1 Scope

✅ ACT/Canberra only  
✅ Residential properties (houses, townhouses, units, apartments)  
✅ Property search/filter  
✅ Property detail page  
✅ Live investment calculator  
✅ Gross yield, annual rent, cash flow  
✅ Basic investment score  

## Future Enhancements (V2+)

- Real property data integration
- Historical price trends
- Suburb comparisons
- Loan amortization schedules
- Capital growth projections
- User saved properties
- Email alerts for new listings

## Deployment

Deployed on Vercel. Push to `main` branch to trigger automatic builds.

```bash
git push origin main
```

## License

MIT

## Author

Reece Jansen
