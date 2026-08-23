"use client";

import { useMemo, useState } from "react";

type Property = {
  id: number;
  address: string;
  suburb: string;
  type: string;
  price: number;
  rent: number;
  landValue: number;
  beds: number;
  baths: number;
};

const properties: Property[] = [
  {
    id: 1,
    address: "12 Example Street",
    suburb: "Gungahlin",
    type: "House",
    price: 695000,
    rent: 680,
    landValue: 390000,
    beds: 3,
    baths: 2,
  },
  {
    id: 2,
    address: "48 Sample Avenue",
    suburb: "Belconnen",
    type: "Townhouse",
    price: 575000,
    rent: 590,
    landValue: 310000,
    beds: 3,
    baths: 2,
  },
  {
    id: 3,
    address: "7 Demo Place",
    suburb: "Tuggeranong",
    type: "Unit",
    price: 455000,
    rent: 520,
    landValue: 250000,
    beds: 2,
    baths: 1,
  },
  {
    id: 4,
    address: "91 Test Crescent",
    suburb: "Casey",
    type: "House",
    price: 780000,
    rent: 720,
    landValue: 430000,
    beds: 4,
    baths: 2,
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

  const [price, setPrice] = useState(selected.price);
  const [rent, setRent] = useState(selected.rent);
  const [loan, setLoan] = useState(selected.price);
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
      annualPrincipal = 0;
    } else if (monthlyRate === 0) {
      monthlyRepayment = loan / payments;
      annualLoanRepayment = monthlyRepayment * 12;
      annualPrincipal = annualLoanRepayment;
    } else {
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

    const score = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          50 +
            (grossYield - 4) * 12 +
            weeklyCashFlow / 100
        )
      )
    );

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

    setPrice(property.price);
    setRent(property.rent);

    // Default to 100% borrowing
    setLoan(property.price);
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
            {money(price)}
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
            "Unit",
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
            (property.rent * 52) /
            property.price *
            100;

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
                  {propertyYield.toFixed(1)}%
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
                  {money(property.price)}
                </b>

                <span>
                  ${property.rent}/wk
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
              Based on current rent
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
            <span>LAND VALUE</span>

            <strong>
              {money(
                selected.landValue
              )}
            </strong>

            <small>
              ACT unimproved value
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
              V1 investment engine
            </strong>

            <p>
              These calculations are estimates.
              Next we'll connect legitimate ACT
              property data, sales history and rental
              evidence so the scanner can analyse
              real properties automatically.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}