"use client";

import { useMemo, useState } from "react";

type Property = {
  id: number;
  address: string;
  suburb: string;
  type: string;
  price: number | null;
  priceDisplay: string;
  rent: number;
  landValue: number;
  beds: number;
  baths: number;
  cars: number;
  landSize?: number;
  listingUrl?: string;
  rentSource?: string;
};

const properties: Property[] = [
  {
    id: 1,
    address: "19/11 Starcevich Crescent",
    suburb: "Jacka",
    type: "Townhouse",
    price: null,
    priceDisplay: "Auction",
    rent: 680,
    landValue: 0,
    beds: 2,
    baths: 2,
    cars: 2,
    landSize: 93,
    listingUrl:
      "https://www.realestate.com.au/property-townhouse-act-jacka-152097148",
  },
  {
    id: 2,
    address: "10/147 Bill Ferguson Circuit",
    suburb: "Bonner",
    type: "Townhouse",
    price: 730000,
    priceDisplay: "$730,000+",
    rent: 680,
    landValue: 0,
    beds: 3,
    baths: 2,
    cars: 2,
    landSize: 152,
    listingUrl:
      "https://www.realestate.com.au/property-townhouse-act-bonner-151418112",
    rentSource: "Previous advertised lease",
  },
  {
    id: 3,
    address: "307/100 De Burgh Street",
    suburb: "Lyneham",
    type: "Apartment",
    price: 639000,
    priceDisplay: "$639,000+",
    rent: 600,
    landValue: 0,
    beds: 2,
    baths: 2,
    cars: 2,
    landSize: 78,
    listingUrl:
      "https://www.realestate.com.au/property-apartment-act-lyneham-152096712",
  },
  {
    id: 4,
    address: "206/70 Allara Street",
    suburb: "City",
    type: "Apartment",
    price: 1029900,
    priceDisplay: "$1,029,900",
    rent: 850,
    landValue: 0,
    beds: 3,
    baths: 2,
    cars: 2,
    landSize: 107,
    listingUrl:
      "https://www.realestate.com.au/property-apartment-act-city-151241276",
  },
  {
    id: 5,
    address: "103/72 Allara Street",
    suburb: "City",
    type: "Apartment",
    price: 780900,
    priceDisplay: "$780,900",
    rent: 700,
    landValue: 0,
    beds: 2,
    baths: 2,
    cars: 1,
    landSize: 83,
    listingUrl:
      "https://www.realestate.com.au/property-apartment-act-city-151241016",
  },
  {
    id: 6,
    address: "10 Helmrich Street",
    suburb: "Moncrieff",
    type: "House",
    price: 1100000,
    priceDisplay: "$1.1m+",
    rent: 750,
    landValue: 0,
    beds: 4,
    baths: 2,
    cars: 2,
    landSize: 468,
  },
  {
    id: 7,
    address: "18 Carmody Street",
    suburb: "Casey",
    type: "House",
    price: 1039000,
    priceDisplay: "$1.039m+",
    rent: 720,
    landValue: 0,
    beds: 4,
    baths: 2,
    cars: 2,
    landSize: 447,
  },
  {
    id: 8,
    address: "24/1 Bon Scott Crescent",
    suburb: "Moncrieff",
    type: "Townhouse",
    price: 719000,
    priceDisplay: "$719,000+",
    rent: 650,
    landValue: 0,
    beds: 3,
    baths: 2,
    cars: 2,
    landSize: 146,
  },
  {
    id: 9,
    address: "15/16 Everist Street",
    suburb: "Taylor",
    type: "Townhouse",
    price: 588000,
    priceDisplay: "$588,000+",
    rent: 580,
    landValue: 0,
    beds: 2,
    baths: 2,
    cars: 2,
    landSize: 106,
  },
  {
    id: 10,
    address: "18/2 Romano Street",
    suburb: "Denman Prospect",
    type: "Townhouse",
    price: 795000,
    priceDisplay: "$795,000+",
    rent: 680,
    landValue: 0,
    beds: 3,
    baths: 2,
    cars: 2,
    landSize: 180,
  },
  {
    id: 11,
    address: "66/41 Philip Hodgins Street",
    suburb: "Wright",
    type: "Townhouse",
    price: 690000,
    priceDisplay: "$690,000",
    rent: 620,
    landValue: 0,
    beds: 3,
    baths: 2,
    cars: 2,
    landSize: 171,
  },
  {
    id: 12,
    address: "34/4 Skuta Place",
    suburb: "Denman Prospect",
    type: "Townhouse",
    price: 900000,
    priceDisplay: "$900,000+",
    rent: 750,
    landValue: 0,
    beds: 4,
    baths: 3,
    cars: 2,
    landSize: 205,
  },
  {
    id: 13,
    address: "4/2 Bellette Street",
    suburb: "Weston",
    type: "Townhouse",
    price: 709000,
    priceDisplay: "$709,000+",
    rent: 620,
    landValue: 0,
    beds: 3,
    baths: 2,
    cars: 2,
  },
  {
    id: 14,
    address: "16/31 Moyes Crescent",
    suburb: "Holt",
    type: "Townhouse",
    price: 590000,
    priceDisplay: "$590,000",
    rent: 560,
    landValue: 0,
    beds: 2,
    baths: 1,
    cars: 1,
    landSize: 82,
  },
  {
    id: 15,
    address: "8/4 Lind Close",
    suburb: "Fraser",
    type: "Townhouse",
    price: 780000,
    priceDisplay: "Offers over $780,000",
    rent: 650,
    landValue: 0,
    beds: 3,
    baths: 2,
    cars: 2,
    landSize: 141,
  },
  {
    id: 16,
    address: "5/21 Temperley Street",
    suburb: "Nicholls",
    type: "Townhouse",
    price: 0,
    priceDisplay: "Contact Agent",
    rent: 650,
    landValue: 0,
    beds: 3,
    baths: 2,
    cars: 2,
    landSize: 165,
    listingUrl:
      "https://www.realestate.com.au/property-townhouse-act-nicholls-151523264",
  },
  {
    id: 17,
    address: "8 Quandong Street",
    suburb: "O'Connor",
    type: "House",
    price: 1320000,
    priceDisplay: "$1,320,000",
    rent: 700,
    landValue: 0,
    beds: 3,
    baths: 1,
    cars: 1,
    landSize: 670,
  },
  {
    id: 18,
    address: "2 Parkhill Street",
    suburb: "Pearce",
    type: "House",
    price: null,
    priceDisplay: "Auction",
    rent: 750,
    landValue: 0,
    beds: 4,
    baths: 2,
    cars: 3,
    landSize: 1132,
  },
  {
    id: 19,
    address: "294 Goyder Street",
    suburb: "Narrabundah",
    type: "House",
    price: null,
    priceDisplay: "Auction",
    rent: 650,
    landValue: 0,
    beds: 3,
    baths: 1,
    cars: 1,
    landSize: 714,
  },
  {
    id: 20,
    address: "12 Hensman Street",
    suburb: "Latham",
    type: "House",
    price: 999000,
    priceDisplay: "$999,000+",
    rent: 700,
    landValue: 0,
    beds: 4,
    baths: 2,
    cars: 2,
    landSize: 1131,
    listingUrl:
      "https://www.realestate.com.au/property-house-act-latham-151972712",
  },
];

const money = (value: number) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);

export default function Home() {
  const [selected, setSelected] = useState<Property>(properties[0]);

  const [query, setQuery] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("All");

  const [price, setPrice] = useState(selected.price ?? 0);
  const [rent, setRent] = useState(selected.rent);
  const [loan, setLoan] = useState(selected.price ?? 0);
  const [interest, setInterest] = useState(6);
  const [expenses, setExpenses] = useState(7500);
  const [loanTerm, setLoanTerm] = useState(30);

  const [loanType, setLoanType] =
    useState<"P&I" | "Interest Only">("P&I");

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      `${property.address} ${property.suburb} ${property.type}`
        .toLowerCase()
        .includes(query.toLowerCase());

    const matchesType =
      propertyFilter === "All" ||
      property.type === propertyFilter;

    return matchesSearch && matchesType;
  });

  const analysis = useMemo(() => {
    const annualRent = rent * 52;

    const grossYield =
      price > 0 ? (annualRent / price) * 100 : 0;

    const monthlyRate = interest / 100 / 12;
    const payments = loanTerm * 12;

    let monthlyRepayment = 0;
    let annualInterest = 0;
    let annualPrincipal = 0;
    let annualLoanRepayment = 0;

    if (loanType === "Interest Only") {
      annualInterest = loan * (interest / 100);
      monthlyRepayment = annualInterest / 12;
      annualLoanRepayment = annualInterest;
    } else if (monthlyRate === 0) {
      monthlyRepayment =
        payments > 0 ? loan / payments : 0;

      annualLoanRepayment =
        monthlyRepayment * 12;

      annualPrincipal = annualLoanRepayment;
    } else if (loan > 0) {
      monthlyRepayment =
        loan *
        ((monthlyRate *
          Math.pow(1 + monthlyRate, payments)) /
          (Math.pow(1 + monthlyRate, payments) - 1));

      annualLoanRepayment =
        monthlyRepayment * 12;

      let balance = loan;
      let firstYearInterest = 0;

      for (let month = 0; month < 12; month++) {
        const interestPayment =
          balance * monthlyRate;

        const principalPayment =
          monthlyRepayment - interestPayment;

        firstYearInterest += interestPayment;

        balance = Math.max(
          0,
          balance - principalPayment
        );
      }

      annualInterest = firstYearInterest;

      annualPrincipal = Math.max(
        0,
        annualLoanRepayment - annualInterest
      );
    }

    const annualCashFlow =
      annualRent -
      annualLoanRepayment -
      expenses;

    const weeklyCashFlow =
      annualCashFlow / 52;

    const score =
      price > 0
        ? Math.max(
            0,
            Math.min(
              100,
              Math.round(
                50 +
                  (grossYield - 4) * 12 +
                  weeklyCashFlow / 100
              )
            )
          )
        : 0;

    return {
      annualRent,
      grossYield,
      monthlyRepayment,
      annualInterest,
      annualPrincipal,
      annualLoanRepayment,
      annualCashFlow,
      weeklyCashFlow,
      score,
    };
  }, [
    price,
    rent,
    loan,
    interest,
    expenses,
    loanTerm,
    loanType,
  ]);

  function selectProperty(property: Property) {
    setSelected(property);

    const nextPrice = property.price ?? 0;

    setPrice(nextPrice);
    setRent(property.rent);
    setLoan(nextPrice);
  }

  return (
    <main className="app">
      <header className="nav">
        <div className="brand">
          <div className="brandMark">⌂</div>

          <div>
            <div className="brandName">
              Canberra Property Scanner
            </div>

            <div className="brandSub">
              ACT PROPERTY ANALYSIS
            </div>
          </div>
        </div>

        <div className="navStatus">
          <span className="statusDot" />
          V1 • ACT
        </div>
      </header>

      <section className="hero">
        <div className="heroContent">
          <div className="heroEyebrow">
            PROPERTY INVESTMENT
          </div>

          <h1>
            Find the property.
            <br />
            <span>Run the numbers.</span>
          </h1>

          <p>
            Analyse Canberra properties, rental returns,
            financing and cash flow from one screen.
          </p>
        </div>

        <div className="heroCard">
          <div className="heroCardLabel">
            CURRENT PROPERTY
          </div>

          <div className="heroCardAddress">
            {selected.address}
          </div>

          <div className="heroCardLocation">
            {selected.suburb}, ACT
          </div>

          <div className="heroCardPrice">
            {selected.priceDisplay}
          </div>
        </div>
      </section>

      <section className="searchPanel">
        <div className="searchBox">
          <span>⌕</span>

          <input
            placeholder="Search Canberra suburb or address..."
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
          />
        </div>

        <div className="filters">
          {[
            "All",
            "House",
            "Townhouse",
            "Apartment",
          ].map((type) => (
            <button
              key={type}
              className={
                propertyFilter === type
                  ? "filter active"
                  : "filter"
              }
              onClick={() =>
                setPropertyFilter(type)
              }
            >
              {type}
            </button>
          ))}
        </div>
      </section>

      <section className="propertyStrip">
        {filteredProperties.map((property) => {
          const propertyYield =
            property.price && property.price > 0
              ? ((property.rent * 52) /
                  property.price) *
                100
              : null;

          const active =
            selected.id === property.id;

          return (
            <button
              key={property.id}
              className={
                active
                  ? "propertyMini active"
                  : "propertyMini"
              }
              onClick={() =>
                selectProperty(property)
              }
            >
              <div className="miniTop">
                <span>{property.type}</span>

                <b>
                  {propertyYield !== null
                    ? `${propertyYield.toFixed(1)}%`
                    : "—"}
                </b>
              </div>

              <strong>
                {property.address}
              </strong>

              <small>
                {property.suburb}
              </small>

              <div className="miniBottom">
                <b>
                  {property.priceDisplay}
                </b>

                <span>
                  ${property.rent}/wk*
                </span>
              </div>
            </button>
          );
        })}
      </section>

      <section className="dashboard">
        <div className="propertyIntro glass">
          <div>
            <div className="eyebrow">
              {selected.type.toUpperCase()}
            </div>

            <h2>
              {selected.address}
            </h2>

            <p>
              {selected.suburb}, ACT
              <span>•</span>
              {selected.beds} bed
              <span>•</span>
              {selected.baths} bath
              <span>•</span>
              {selected.cars} car
              {selected.landSize ? (
                <>
                  <span>•</span>
                  {selected.landSize}m²
                </>
              ) : null}
            </p>
          </div>

          <div className="scoreBox">
            <div>INVESTMENT SCORE</div>

            <strong>
              {analysis.score}
            </strong>

            <span>/100</span>
          </div>
        </div>

        <div className="snapshotGrid">
          <div className="metric glass">
            <span>GROSS YIELD</span>

            <strong>
              {analysis.grossYield.toFixed(2)}%
            </strong>

            <small>
              Based on current rent assumption
            </small>
          </div>

          <div className="metric glass">
            <span>WEEKLY RENT</span>

            <strong>
              {money(rent)}
            </strong>

            <small>
              Editable assumption
            </small>
          </div>

          <div className="metric glass">
            <span>WEEKLY CASH FLOW</span>

            <strong
              className={
                analysis.weeklyCashFlow >= 0
                  ? "green"
                  : "red"
              }
            >
              {money(
                analysis.weeklyCashFlow
              )}
            </strong>

            <small>
              After loan + expenses
            </small>
          </div>

          <div className="metric glass">
            <span>LAND SIZE</span>

            <strong>
              {selected.landSize
                ? `${selected.landSize}m²`
                : "—"}
            </strong>

            <small>
              Where available
            </small>
          </div>
        </div>

        <div className="mainGrid">
          <div className="glass assumptions">
            <div className="sectionHeading">
              <div>
                <div className="eyebrow">
                  LIVE CALCULATOR
                </div>

                <h3>
                  Investment assumptions
                </h3>
              </div>

              <div className="liveBadge">
                <span />
                LIVE
              </div>
            </div>

            <div className="fieldGrid">
              <div className="field">
                <label>
                  PURCHASE PRICE
                </label>

                <div className="inputMoney">
                  <span>$</span>

                  <input
                    type="number"
                    value={price}
                    onChange={(e) =>
                      setPrice(
                        Number(e.target.value)
                      )
                    }
                  />
                </div>

                {selected.price === null && (
                  <small>
                    Enter a price to analyse this
                    property.
                  </small>
                )}
              </div>

              <div className="field">
                <label>
                  WEEKLY RENT
                </label>

                <div className="inputMoney">
                  <span>$</span>

                  <input
                    type="number"
                    value={rent}
                    onChange={(e) =>
                      setRent(
                        Number(e.target.value)
                      )
                    }
                  />

                  <em>/wk</em>
                </div>

                <small>
                  *Initial estimate — editable
                </small>
              </div>

              <div className="field">
                <label>
                  LOAN AMOUNT
                </label>

                <div className="inputMoney">
                  <span>$</span>

                  <input
                    type="number"
                    value={loan}
                    onChange={(e) =>
                      setLoan(
                        Number(e.target.value)
                      )
                    }
                  />
                </div>

                <small>
                  Default: 100% borrowing
                </small>
              </div>

              <div className="field">
                <label>
                  ANNUAL EXPENSES
                </label>

                <div className="inputMoney">
                  <span>$</span>

                  <input
                    type="number"
                    value={expenses}
                    onChange={(e) =>
                      setExpenses(
                        Number(e.target.value)
                      )
                    }
                  />

                  <em>/yr</em>
                </div>
              </div>
            </div>

            <div className="rateSection">
              <div className="rateHeader">
                <div>
                  <label>
                    INTEREST RATE
                  </label>

                  <small>
                    Current assumption
                  </small>
                </div>

                <strong>
                  {interest.toFixed(2)}%
                </strong>
              </div>

              <input
                className="range"
                type="range"
                min="2"
                max="10"
                step="0.05"
                value={interest}
                onChange={(e) =>
                  setInterest(
                    Number(e.target.value)
                  )
                }
              />

              <div className="rangeLabels">
                <span>2%</span>
                <span>10%</span>
              </div>
            </div>

            <div className="loanSection">
              <div className="loanHeader">
                <label>
                  LOAN TYPE
                </label>

                <label>
                  LOAN TERM
                </label>
              </div>

              <div className="loanControls">
                <div className="segmented">
                  <button
                    className={
                      loanType === "P&I"
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      setLoanType("P&I")
                    }
                  >
                    Principal & Interest
                  </button>

                  <button
                    className={
                      loanType ===
                      "Interest Only"
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      setLoanType(
                        "Interest Only"
                      )
                    }
                  >
                    Interest Only
                  </button>
                </div>

                <select
                  value={loanTerm}
                  onChange={(e) =>
                    setLoanTerm(
                      Number(e.target.value)
                    )
                  }
                >
                  <option value={20}>
                    20 years
                  </option>

                  <option value={25}>
                    25 years
                  </option>

                  <option value={30}>
                    30 years
                  </option>

                  <option value={35}>
                    35 years
                  </option>
                </select>
              </div>
            </div>

            {selected.listingUrl && (
              <a
                href={selected.listingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="listingButton"
              >
                View original listing ↗
              </a>
            )}
          </div>

          <div className="glass cashflow">
            <div className="sectionHeading">
              <div>
                <div className="eyebrow">
                  CASH FLOW
                </div>

                <h3>
                  Investment result
                </h3>
              </div>
            </div>

            <div className="cashHero">
              <span>
                ESTIMATED WEEKLY CASH FLOW
              </span>

              <strong
                className={
                  analysis.weeklyCashFlow >= 0
                    ? "green"
                    : "red"
                }
              >
                {money(
                  analysis.weeklyCashFlow
                )}
              </strong>

              <small>
                {analysis.weeklyCashFlow >= 0
                  ? "Positive cash flow"
                  : "Negative cash flow"}
              </small>
            </div>

            <div className="breakdown">
              <div>
                <span>
                  Annual rental income
                </span>

                <b className="green">
                  +{money(
                    analysis.annualRent
                  )}
                </b>
              </div>

              <div>
                <span>
                  Annual loan repayment
                </span>

                <b>
                  -{money(
                    analysis.annualLoanRepayment
                  )}
                </b>
              </div>

              <div>
                <span>
                  Interest — Year 1
                </span>

                <b>
                  -{money(
                    analysis.annualInterest
                  )}
                </b>
              </div>

              <div>
                <span>
                  Principal — Year 1
                </span>

                <b className="blue">
                  {money(
                    analysis.annualPrincipal
                  )}
                </b>
              </div>

              <div>
                <span>
                  Other expenses
                </span>

                <b>
                  -{money(expenses)}
                </b>
              </div>

              <div className="breakdownTotal">
                <span>
                  Annual cash flow
                </span>

                <strong
                  className={
                    analysis.annualCashFlow >= 0
                      ? "green"
                      : "red"
                  }
                >
                  {money(
                    analysis.annualCashFlow
                  )}
                </strong>
              </div>
            </div>

            <div className="repayment">
              <div>
                <span>
                  MONTHLY REPAYMENT
                </span>

                <strong>
                  {money(
                    analysis.monthlyRepayment
                  )}
                </strong>
              </div>

              <div>
                <span>
                  PRINCIPAL PAID — YEAR 1
                </span>

                <strong>
                  {money(
                    analysis.annualPrincipal
                  )}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div className="bottomNote glass">
          <div className="noteIcon">
            ✓
          </div>

          <div>
            <strong>
              V1 live Canberra dataset
            </strong>

            <p>
              Properties are based on current
              Canberra market listings. Asking
              prices marked as auction/contact
              agent are intentionally not guessed.
              Rental figures are initial editable
              assumptions and should be replaced
              with verified rental evidence as we
              build the data integration.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}