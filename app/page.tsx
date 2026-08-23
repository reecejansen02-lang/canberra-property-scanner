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

const money = (n: number) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(n);

export default function Home() {
  const [selected, setSelected] = useState<Property>(properties[0]);
  const [query, setQuery] = useState("");

  const [price, setPrice] = useState(selected.price);
  const [rent, setRent] = useState(selected.rent);
  const [interest, setInterest] = useState(6);
  const [loan, setLoan] = useState(selected.price);
  const [expenses, setExpenses] = useState(7500);

  const [loanType, setLoanType] = useState<"P&I" | "Interest Only">("P&I");
  const [loanTerm, setLoanTerm] = useState(30);

  const filtered = properties.filter((p) =>
    `${p.address} ${p.suburb} ${p.type}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const analysis = useMemo(() => {
    const annualRent = rent * 52;

    const grossYield = price > 0 ? (annualRent / price) * 100 : 0;

    const monthlyRate = interest / 100 / 12;
    const numberOfPayments = loanTerm * 12;

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
      monthlyRepayment = loan / numberOfPayments;
      annualLoanRepayment = monthlyRepayment * 12;
      annualPrincipal = annualLoanRepayment;
      annualInterest = 0;
    } else {
      monthlyRepayment =
        loan *
        (monthlyRate *
          Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

      annualLoanRepayment = monthlyRepayment * 12;

      const firstYearInterest = loan * monthlyRate;
      let balance = loan;
      let interestFirstYear = 0;

      for (let month = 0; month < 12; month++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = monthlyRepayment - interestPayment;

        interestFirstYear += interestPayment;
        balance = Math.max(0, balance - principalPayment);
      }

      annualInterest = interestFirstYear;
      annualPrincipal = Math.max(
        0,
        annualLoanRepayment - annualInterest
      );
    }

    const annualCashFlow =
      annualRent - annualLoanRepayment - expenses;

    const weeklyCashFlow = annualCashFlow / 52;

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
    interest,
    loan,
    expenses,
    loanType,
    loanTerm,
  ]);

  function chooseProperty(property: Property) {
    setSelected(property);
    setPrice(property.price);
    setRent(property.rent);
    setLoan(property.price);
  }

  return (
    <main>
      <header className="topbar">
        <div>
          <div className="eyebrow">ACT • V1</div>

          <h1>Canberra Property Scanner</h1>

          <p>
            Find a property, run the numbers, and decide if it
            deserves a closer look.
          </p>
        </div>

        <div className="pill">Skeleton mode</div>
      </header>

      <section className="hero">
        <div>
          <span className="eyebrow">PROPERTY INVESTING</span>

          <h2>
            Scan Canberra properties in seconds.
          </h2>

          <p>
            Analyse purchase price, rental income, financing,
            expenses and cash flow from one screen.
          </p>
        </div>

        <div className="heroStat">
          <span>Selected property</span>

          <strong>{selected.suburb}</strong>

          <small>{selected.type}</small>
        </div>
      </section>

      <div className="layout">
        <aside className="sidebar">
          <div className="sectionTitle">
            <div>
              <span className="eyebrow">
                ACT PROPERTIES
              </span>

              <h3>Property search</h3>
            </div>

            <span className="count">
              {filtered.length}
            </span>
          </div>

          <input
            className="search"
            placeholder="Search suburb, address or type..."
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
          />

          <div className="cards">
            {filtered.map((property) => {
              const propertyYield =
                (property.rent * 52) /
                property.price *
                100;

              return (
                <button
                  className={`propertyCard ${
                    selected.id === property.id
                      ? "active"
                      : ""
                  }`}
                  key={property.id}
                  onClick={() =>
                    chooseProperty(property)
                  }
                >
                  <div className="cardTop">
                    <span className="type">
                      {property.type}
                    </span>

                    <span className="yield">
                      {propertyYield.toFixed(1)}% yield
                    </span>
                  </div>

                  <strong>
                    {property.address}
                  </strong>

                  <span className="suburb">
                    {property.suburb}, ACT
                  </span>

                  <div className="cardBottom">
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
          </div>
        </aside>

        <section className="analysis">
          <div className="propertyHeader">
            <div>
              <span className="eyebrow">
                {selected.type.toUpperCase()}
              </span>

              <h2>
                {selected.address}
              </h2>

              <p>
                {selected.suburb}, ACT •{" "}
                {selected.beds} bed •{" "}
                {selected.baths} bath
              </p>
            </div>

            <div className="score">
              <span>
                INVESTMENT SCORE
              </span>

              <strong>
                {analysis.score}
              </strong>

              <small>/100</small>
            </div>
          </div>

          <div className="metrics">
            <div>
              <span>Gross yield</span>

              <strong>
                {analysis.grossYield.toFixed(2)}%
              </strong>
            </div>

            <div>
              <span>Weekly cash flow</span>

              <strong
                className={
                  analysis.weeklyCashFlow >= 0
                    ? "positive"
                    : "negative"
                }
              >
                {money(
                  analysis.weeklyCashFlow
                )}
              </strong>
            </div>

            <div>
              <span>Annual rent</span>

              <strong>
                {money(
                  analysis.annualRent
                )}
              </strong>
            </div>

            <div>
              <span>Land value</span>

              <strong>
                {money(
                  selected.landValue
                )}
              </strong>
            </div>
          </div>

          <div className="panel">
            <div className="panelHeader">
              <div>
                <span className="eyebrow">
                  LIVE CALCULATOR
                </span>

                <h3>
                  Investment assumptions
                </h3>
              </div>

              <span className="live">
                ● LIVE
              </span>
            </div>

            <div className="inputs">
              <label>
                Purchase price

                <input
                  type="number"
                  value={price}
                  onChange={(e) =>
                    setPrice(
                      Number(e.target.value)
                    )
                  }
                />
              </label>

              <label>
                Weekly rent

                <input
                  type="number"
                  value={rent}
                  onChange={(e) =>
                    setRent(
                      Number(e.target.value)
                    )
                  }
                />
              </label>

              <label>
                Loan amount

                <input
                  type="number"
                  value={loan}
                  onChange={(e) =>
                    setLoan(
                      Number(e.target.value)
                    )
                  }
                />
              </label>

              <label>
                Interest rate %

                <input
                  type="number"
                  step="0.1"
                  value={interest}
                  onChange={(e) =>
                    setInterest(
                      Number(e.target.value)
                    )
                  }
                />
              </label>

              <label>
                Annual expenses

                <input
                  type="number"
                  value={expenses}
                  onChange={(e) =>
                    setExpenses(
                      Number(e.target.value)
                    )
                  }
                />
              </label>

              <label>
                Loan term

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
              </label>
            </div>

            <div className="loanType">
              <span>Loan type</span>

              <div className="loanButtons">
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
                    loanType === "Interest Only"
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
            </div>

            <div className="breakdown">
              <div>
                <span>
                  Monthly loan repayment
                </span>

                <b>
                  {money(
                    analysis.monthlyRepayment
                  )}
                </b>
              </div>

              <div>
                <span>
                  Annual rent
                </span>

                <b>
                  {money(
                    analysis.annualRent
                  )}
                </b>
              </div>

              <div>
                <span>
                  Annual interest
                </span>

                <b>
                  -{money(
                    analysis.annualInterest
                  )}
                </b>
              </div>

              <div>
                <span>
                  Principal paid — Year 1
                </span>

                <b>
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

              <div className="total">
                <span>
                  Estimated annual cash flow
                </span>

                <b
                  className={
                    analysis.annualCashFlow >= 0
                      ? "positive"
                      : "negative"
                  }
                >
                  {money(
                    analysis.annualCashFlow
                  )}
                </b>
              </div>

              <div className="total">
                <span>
                  Estimated weekly cash flow
                </span>

                <b
                  className={
                    analysis.weeklyCashFlow >= 0
                      ? "positive"
                      : "negative"
                  }
                >
                  {money(
                    analysis.weeklyCashFlow
                  )}
                </b>
              </div>
            </div>
          </div>

          <div className="note">
            <strong>Next:</strong>{" "}
            connect legitimate ACT/Domain data sources,
            add sales history and rental evidence,
            then replace the sample properties with
            live property records.
          </div>
        </section>
      </div>
    </main>
  );
}