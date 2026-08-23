"use client";

import { useMemo, useState } from "react";
import { properties, Property } from "./properties";

const money = (value: number) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);

const number = (value: number) =>
  new Intl.NumberFormat("en-AU").format(value);

function calculateProperty(property: Property) {
  const price = property.price ?? 0;
  const annualRent = property.rent * 52;

  const grossYield =
    price > 0 ? (annualRent / price) * 100 : 0;

  /*
   * V1 default financing:
   * 100% borrowing at 6% P&I over 30 years.
   */
  const loan = price;
  const rate = 0.06 / 12;
  const payments = 30 * 12;

  let annualLoan = 0;

  if (loan > 0) {
    const monthly =
      rate === 0
        ? loan / payments
        : loan *
          ((rate * Math.pow(1 + rate, payments)) /
            (Math.pow(1 + rate, payments) - 1));

    annualLoan = monthly * 12;
  }

  /*
   * Simple V1 expense assumption.
   * This is deliberately visible to the user rather than
   * pretending we know the actual expenses for each property.
   */
  const annualExpenses = 7500;

  const annualCashFlow =
    annualRent - annualLoan - annualExpenses;

  const weeklyCashFlow =
    annualCashFlow / 52;

  /*
   * Investment score is NOT a valuation.
   * It is simply a ranking mechanism for this app.
   */
  const yieldScore = Math.min(grossYield * 10, 40);
  const growthScore = Math.min(
    property.capitalGrowth * 5,
    25
  );

  const cashScore = Math.max(
    Math.min(weeklyCashFlow / 10, 25),
    -20
  );

  const priceScore =
    price > 0
      ? Math.max(0, 15 - price / 150000)
      : 5;

  const score = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        35 +
          yieldScore +
          growthScore +
          cashScore +
          priceScore
      )
    )
  );

  return {
    annualRent,
    grossYield,
    annualLoan,
    annualExpenses,
    annualCashFlow,
    weeklyCashFlow,
    score,
  };
}

function parseNumber(value: string) {
  const cleaned = value
    .replace(/[$,%]/g, "")
    .replace(/,/g, "")
    .trim();

  const result = Number(cleaned);

  return Number.isFinite(result) ? result : null;
}

function matchesNaturalSearch(
  property: Property,
  query: string
) {
  if (!query.trim()) return true;

  const q = query
    .toLowerCase()
    .replace(/,/g, " ")
    .replace(/\$/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const analysis = calculateProperty(property);

  const searchable = `
    ${property.address}
    ${property.suburb}
    ${property.type}
    ${property.beds} bedroom
    ${property.baths} bathroom
    ${property.beds} bed
    ${property.baths} bath
    ${property.price ?? ""}
    ${property.rent}
    ${property.capitalGrowth}
    ${analysis.grossYield}
    ${analysis.weeklyCashFlow}
    ${analysis.score}
  `.toLowerCase();

  /*
   * Plain text search.
   */
  if (
    searchable.includes(q) ||
    q.split(" ").every((word) =>
      searchable.includes(word)
    )
  ) {
    return true;
  }

  /*
   * Property type.
   */
  if (
    q.includes("house") &&
    property.type === "House"
  ) {
    return true;
  }

  if (
    q.includes("townhouse") &&
    property.type === "Townhouse"
  ) {
    return true;
  }

  if (
    (q.includes("unit") || q.includes("apartment")) &&
    (property.type === "Unit" ||
      property.type === "Apartment")
  ) {
    return true;
  }

  /*
   * Bedroom searches.
   */
  const bedroomMatch = q.match(
    /(\d+)\s*(?:bed|beds|bedroom|bedrooms)/
  );

  if (bedroomMatch) {
    const beds = Number(bedroomMatch[1]);

    if (
      q.includes("plus") ||
      q.includes("+")
    ) {
      if (property.beds >= beds) return true;
    } else {
      if (property.beds === beds) return true;
    }
  }

  /*
   * Price searches.
   */
  const underMatch = q.match(
    /(?:under|below|less than|max)\s*(\d+(?:\.\d+)?)\s*(k|m)?/
  );

  if (underMatch) {
    let value = Number(underMatch[1]);

    if (underMatch[2] === "k") value *= 1000;
    if (underMatch[2] === "m") value *= 1000000;

    if (
      property.price !== null &&
      property.price <= value
    ) {
      return true;
    }
  }

  /*
   * Yield searches.
   */
  const yieldMatch = q.match(
    /(?:yield|gross yield)\s*(?:over|above|>|at least)?\s*(\d+(?:\.\d+)?)/
  );

  if (yieldMatch) {
    const requested = Number(yieldMatch[1]);

    if (analysis.grossYield >= requested) {
      return true;
    }
  }

  /*
   * Growth searches.
   */
  const growthMatch = q.match(
    /(?:growth|capital growth)\s*(?:over|above|>|at least)?\s*(\d+(?:\.\d+)?)/
  );

  if (growthMatch) {
    const requested = Number(growthMatch[1]);

    if (
      property.capitalGrowth >= requested
    ) {
      return true;
    }
  }

  /*
   * Cash-flow searches.
   */
  if (
    q.includes("cash flow positive") ||
    q.includes("positive cash flow")
  ) {
    return analysis.weeklyCashFlow > 0;
  }

  if (
    q.includes("cash flow negative") ||
    q.includes("negative cash flow")
  ) {
    return analysis.weeklyCashFlow < 0;
  }

  /*
   * Score searches.
   */
  const scoreMatch = q.match(
    /(?:score)\s*(?:over|above|>|at least)?\s*(\d+)/
  );

  if (scoreMatch) {
    return (
      analysis.score >= Number(scoreMatch[1])
    );
  }

  return false;
}

export default function Home() {
  const [selected, setSelected] =
    useState<Property>(properties[0]);

  const [query, setQuery] = useState("");

  const [propertyFilter, setPropertyFilter] =
    useState("All");

  const [sort, setSort] =
    useState("score");

  const [priceMax, setPriceMax] =
    useState("");

  const [yieldMin, setYieldMin] =
    useState("");

  const [growthMin, setGrowthMin] =
    useState("");

  const [bedsMin, setBedsMin] =
    useState("");

  const [positiveCashFlow, setPositiveCashFlow] =
    useState(false);

  const [price, setPrice] =
    useState(selected.price ?? 0);

  const [rent, setRent] =
    useState(selected.rent);

  const [loan, setLoan] =
    useState(selected.price ?? 0);

  const [interest, setInterest] =
    useState(6);

  const [expenses, setExpenses] =
    useState(7500);

  const [loanTerm, setLoanTerm] =
    useState(30);

  const [loanType, setLoanType] =
    useState<"P&I" | "Interest Only">("P&I");

  const filteredProperties =
    useMemo(() => {
      const result = properties.filter(
        (property) => {
          const analysis =
            calculateProperty(property);

          const matchesType =
            propertyFilter === "All" ||
            property.type === propertyFilter;

          const matchesSearch =
            matchesNaturalSearch(
              property,
              query
            );

          const matchesPrice =
            !priceMax ||
            property.price === null ||
            property.price <=
              Number(priceMax);

          const matchesYield =
            !yieldMin ||
            analysis.grossYield >=
              Number(yieldMin);

          const matchesGrowth =
            !growthMin ||
            property.capitalGrowth >=
              Number(growthMin);

          const matchesBeds =
            !bedsMin ||
            property.beds >=
              Number(bedsMin);

          const matchesCash =
            !positiveCashFlow ||
            analysis.weeklyCashFlow > 0;

          return (
            matchesType &&
            matchesSearch &&
            matchesPrice &&
            matchesYield &&
            matchesGrowth &&
            matchesBeds &&
            matchesCash
          );
        }
      );

      return [...result].sort(
        (a, b) => {
          const aa =
            calculateProperty(a);
          const bb =
            calculateProperty(b);

          switch (sort) {
            case "yield":
              return (
                bb.grossYield -
                aa.grossYield
              );

            case "cashflow":
              return (
                bb.weeklyCashFlow -
                aa.weeklyCashFlow
              );

            case "growth":
              return (
                b.capitalGrowth -
                a.capitalGrowth
              );

            case "price":
              return (
                (a.price ?? Infinity) -
                (b.price ?? Infinity)
              );

            default:
              return (
                bb.score -
                aa.score
              );
          }
        }
      );
    }, [
      query,
      propertyFilter,
      sort,
      priceMax,
      yieldMin,
      growthMin,
      bedsMin,
      positiveCashFlow,
    ]);

  const analysis = useMemo(() => {
    const annualRent =
      rent * 52;

    const grossYield =
      price > 0
        ? (annualRent / price) * 100
        : 0;

    const monthlyRate =
      interest / 100 / 12;

    const payments =
      loanTerm * 12;

    let monthlyRepayment = 0;
    let annualInterest = 0;
    let annualPrincipal = 0;
    let annualLoanRepayment = 0;

    if (
      loanType === "Interest Only"
    ) {
      annualInterest =
        loan *
        (interest / 100);

      monthlyRepayment =
        annualInterest / 12;

      annualLoanRepayment =
        annualInterest;
    } else if (
      monthlyRate === 0
    ) {
      monthlyRepayment =
        loan / payments;

      annualLoanRepayment =
        monthlyRepayment * 12;

      annualPrincipal =
        annualLoanRepayment;
    } else {
      monthlyRepayment =
        loan *
        ((monthlyRate *
          Math.pow(
            1 + monthlyRate,
            payments
          )) /
          (Math.pow(
            1 + monthlyRate,
            payments
          ) - 1));

      annualLoanRepayment =
        monthlyRepayment * 12;

      let balance = loan;
      let firstYearInterest = 0;

      for (
        let month = 0;
        month < 12;
        month++
      ) {
        const interestPayment =
          balance * monthlyRate;

        const principalPayment =
          monthlyRepayment -
          interestPayment;

        firstYearInterest +=
          interestPayment;

        balance = Math.max(
          0,
          balance -
            principalPayment
        );
      }

      annualInterest =
        firstYearInterest;

      annualPrincipal =
        Math.max(
          0,
          annualLoanRepayment -
            annualInterest
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
            weeklyCashFlow / 100 +
            (selected.capitalGrowth -
              4) *
              5
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
    selected.capitalGrowth,
  ]);

  function selectProperty(
    property: Property
  ) {
    setSelected(property);

    setPrice(
      property.price ?? 0
    );

    setRent(property.rent);

    setLoan(
      property.price ?? 0
    );
  }

  return (
    <main className="app">
      <header className="nav">
        <div className="brand">
          <div className="brandMark">
            ⌂
          </div>

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
          V2 • ACT
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
            <span>
              Run the numbers.
            </span>
          </h1>

          <p>
            Search Canberra property
            across price, suburb,
            yield, cash flow,
            capital growth and
            investment score.
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
            {price > 0
              ? money(price)
              : "Price unavailable"}
          </div>
        </div>
      </section>

      <section className="searchPanel">
        <div className="searchBox">
          <span>⌕</span>

          <input
            placeholder="Try: Gungahlin under 700k yield > 5 cash flow positive..."
            value={query}
            onChange={(e) =>
              setQuery(
                e.target.value
              )
            }
          />
        </div>

        <div className="filters">
          {[
            "All",
            "House",
            "Townhouse",
            "Unit",
            "Apartment",
          ].map((type) => (
            <button
              key={type}
              className={
                propertyFilter ===
                type
                  ? "filter active"
                  : "filter"
              }
              onClick={() =>
                setPropertyFilter(
                  type
                )
              }
            >
              {type}
            </button>
          ))}
        </div>
      </section>

      <section className="advancedSearch glass">
        <div className="advancedHeader">
          <div>
            <div className="eyebrow">
              SMART FILTERS
            </div>

            <h3>
              Investment search
            </h3>
          </div>

          <strong>
            {filteredProperties.length}{" "}
            matches
          </strong>
        </div>

        <div className="advancedGrid">
          <div className="filterField">
            <label>
              MAX PRICE
            </label>

            <input
              type="number"
              placeholder="e.g. 800000"
              value={priceMax}
              onChange={(e) =>
                setPriceMax(
                  e.target.value
                )
              }
            />
          </div>

          <div className="filterField">
            <label>
              MIN YIELD %
            </label>

            <input
              type="number"
              step="0.1"
              placeholder="e.g. 4.5"
              value={yieldMin}
              onChange={(e) =>
                setYieldMin(
                  e.target.value
                )
              }
            />
          </div>

          <div className="filterField">
            <label>
              MIN GROWTH %
            </label>

            <input
              type="number"
              step="0.1"
              placeholder="e.g. 4"
              value={growthMin}
              onChange={(e) =>
                setGrowthMin(
                  e.target.value
                )
              }
            />
          </div>

          <div className="filterField">
            <label>
              MIN BEDROOMS
            </label>

            <select
              value={bedsMin}
              onChange={(e) =>
                setBedsMin(
                  e.target.value
                )
              }
            >
              <option value="">
                Any
              </option>

              <option value="1">
                1+
              </option>

              <option value="2">
                2+
              </option>

              <option value="3">
                3+
              </option>

              <option value="4">
                4+
              </option>
            </select>
          </div>

          <div className="filterField">
            <label>
              SORT BY
            </label>

            <select
              value={sort}
              onChange={(e) =>
                setSort(
                  e.target.value
                )
              }
            >
              <option value="score">
                Investment Score
              </option>

              <option value="yield">
                Gross Yield
              </option>

              <option value="cashflow">
                Cash Flow
              </option>

              <option value="growth">
                Capital Growth
              </option>

              <option value="price">
                Lowest Price
              </option>
            </select>
          </div>

          <button
            className={
              positiveCashFlow
                ? "cashFilter active"
                : "cashFilter"
            }
            onClick={() =>
              setPositiveCashFlow(
                !positiveCashFlow
              )
            }
          >
            <span>
              ✓
            </span>

            Positive cash flow
          </button>
        </div>
      </section>

      <section className="propertyStrip">
        {filteredProperties.map(
          (property) => {
            const propertyAnalysis =
              calculateProperty(
                property
              );

            const active =
              selected.id ===
              property.id;

            return (
              <button
                key={property.id}
                className={
                  active
                    ? "propertyMini active"
                    : "propertyMini"
                }
                onClick={() =>
                  selectProperty(
                    property
                  )
                }
              >
                <div className="miniTop">
                  <span>
                    {property.type}
                  </span>

                  <b>
                    {propertyAnalysis.grossYield.toFixed(
                      1
                    )}
                    %
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
                    {property.price
                      ? money(
                          property.price
                        )
                      : "Price est."}
                  </b>

                  <span>
                    ~$
                    {property.rent}
                    /wk
                  </span>
                </div>
              </button>
            );
          }
        )}
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
            </p>
          </div>

          <div className="scoreBox">
            <div>
              INVESTMENT SCORE
            </div>

            <strong>
              {analysis.score}
            </strong>

            <span>
              /100
            </span>
          </div>
        </div>

        <div className="snapshotGrid">
          <div className="metric glass">
            <span>
              GROSS YIELD
            </span>

            <strong>
              {analysis.grossYield.toFixed(
                2
              )}
              %
            </strong>

            <small>
              Based on{" "}
              {selected.rentStatus ===
              "estimated"
                ? "estimated"
                : "verified"}{" "}
              rent
            </small>
          </div>

          <div className="metric glass">
            <span>
              WEEKLY RENT
            </span>

            <strong>
              ~$
              {number(rent)}
            </strong>

            <small>
              {selected.rentStatus ===
              "estimated"
                ? "ESTIMATED"
                : "VERIFIED"}
            </small>
          </div>

          <div className="metric glass">
            <span>
              WEEKLY CASH FLOW
            </span>

            <strong
              className={
                analysis.weeklyCashFlow >=
                0
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
            <span>
              CAPITAL GROWTH
            </span>

            <strong>
              {selected.capitalGrowth.toFixed(
                1
              )}
              %
            </strong>

            <small>
              {selected.capitalGrowthStatus ===
              "estimated"
                ? "ESTIMATED"
                : "VERIFIED"}
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
                  <span>
                    $
                  </span>

                  <input
                    type="number"
                    value={price}
                    onChange={(e) =>
                      setPrice(
                        Number(
                          e.target.value
                        )
                      )
                    }
                  />
                </div>

                <small>
                  {selected.priceStatus ===
                  "estimated"
                    ? "ESTIMATED"
                    : "VERIFIED LISTING PRICE"}
                </small>
              </div>

              <div className="field">
                <label>
                  WEEKLY RENT
                </label>

                <div className="inputMoney">
                  <span>
                    $
                  </span>

                  <input
                    type="number"
                    value={rent}
                    onChange={(e) =>
                      setRent(
                        Number(
                          e.target.value
                        )
                      )
                    }
                  />

                  <em>
                    /wk
                  </em>
                </div>

                <small>
                  Editable assumption
                </small>
              </div>

              <div className="field">
                <label>
                  LOAN AMOUNT
                </label>

                <div className="inputMoney">
                  <span>
                    $
                  </span>

                  <input
                    type="number"
                    value={loan}
                    onChange={(e) =>
                      setLoan(
                        Number(
                          e.target.value
                        )
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
                  <span>
                    $
                  </span>

                  <input
                    type="number"
                    value={expenses}
                    onChange={(e) =>
                      setExpenses(
                        Number(
                          e.target.value
                        )
                      )
                    }
                  />

                  <em>
                    /yr
                  </em>
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
                  {interest.toFixed(
                    2
                  )}
                  %
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
                    Number(
                      e.target.value
                    )
                  )
                }
              />

              <div className="rangeLabels">
                <span>
                  2%
                </span>

                <span>
                  10%
                </span>
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
                      loanType ===
                      "P&I"
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      setLoanType(
                        "P&I"
                      )
                    }
                  >
                    Principal &
                    Interest
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
                      Number(
                        e.target.value
                      )
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
                className="listingButton"
                href={
                  selected.listingUrl
                }
                target="_blank"
                rel="noreferrer"
              >
                VIEW ORIGINAL LISTING ↗
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
                  analysis.weeklyCashFlow >=
                  0
                    ? "green"
                    : "red"
                }
              >
                {money(
                  analysis.weeklyCashFlow
                )}
              </strong>

              <small>
                Based on current assumptions
              </small>
            </div>

            <div className="breakdown">
              <div>
                <span>
                  Annual rental income
                </span>

                <b className="green">
                  +
                  {money(
                    analysis.annualRent
                  )}
                </b>
              </div>

              <div>
                <span>
                  Annual loan repayment
                </span>

                <b>
                  -
                  {money(
                    analysis.annualLoanRepayment
                  )}
                </b>
              </div>

              <div>
                <span>
                  Interest — Year 1
                </span>

                <b>
                  -
                  {money(
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
                  -
                  {money(
                    expenses
                  )}
                </b>
              </div>

              <div className="breakdownTotal">
                <span>
                  Annual cash flow
                </span>

                <strong
                  className={
                    analysis.annualCashFlow >=
                    0
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
              Data transparency
            </strong>

            <p>
              Listing information is sourced
              from current public property
              search results. Prices, rents
              and capital growth are clearly
              identified as verified or
              estimated. Estimates are
              assumptions for investment
              analysis, not guarantees.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}