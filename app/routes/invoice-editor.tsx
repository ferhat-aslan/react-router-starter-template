import {useMemo, useState} from "react";
import {type MetaFunction} from "react-router";
import Layout from "~/components/layout";

type LineItem = {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
};

const money = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

const fieldClass =
  "w-full rounded-[6px] border border-gray-200 bg-white px-3 text-[14px] text-gray-900 shadow-[0_1px_1px_rgba(0,0,0,0.02)] outline-none transition duration-150 placeholder:text-gray-400 focus-visible:border-blue-700 focus-visible:ring-2 focus-visible:ring-blue-700/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const inputClass = `${fieldClass} h-10`;
const selectClass = `${fieldClass} h-10`;
const textAreaClass = `${fieldClass} min-h-24 py-2.5`;

const panelClass =
  "rounded-[12px] border border-gray-200 bg-white shadow-[0_2px_2px_rgba(0,0,0,0.04)]";

const primaryButtonClass =
  "inline-flex h-10 items-center justify-center rounded-[6px] bg-gray-950 px-4 text-[14px] font-semibold text-white shadow-[0_1px_1px_rgba(0,0,0,0.02)] transition duration-150 hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const secondaryButtonClass =
  "inline-flex h-10 items-center justify-center rounded-[6px] border border-gray-200 bg-white px-4 text-[14px] font-semibold text-gray-950 shadow-[0_1px_1px_rgba(0,0,0,0.02)] transition duration-150 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const tertiaryButtonClass =
  "inline-flex h-10 items-center justify-center rounded-[6px] px-4 text-[14px] font-semibold text-gray-950 transition duration-150 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const initialItems: LineItem[] = [
  {
    id: 1,
    description: "Konzept und UX-Design für Rechnungseditor",
    quantity: 1,
    unitPrice: 1800,
    taxRate: 19,
  },
  {
    id: 2,
    description: "Implementierung von Eingabeformularen und Live-Vorschau",
    quantity: 6,
    unitPrice: 140,
    taxRate: 19,
  },
  {
    id: 3,
    description: "Feinschliff, Testing und Abnahme",
    quantity: 2,
    unitPrice: 220,
    taxRate: 19,
  },
];

const formatItemMoney = (value: number) => money.format(value);

const calcLineTotal = (item: LineItem) => item.quantity * item.unitPrice;

export const meta: MetaFunction = () => [
  {
    title: "Rechnungseditor – Geist Testpage",
  },
  {
    name: "description",
    content:
      "German invoice creator and editor page built to test Geist design tokens, layout, and form states.",
  },
];

export default function InvoiceEditor() {
  const [invoiceNumber, setInvoiceNumber] = useState("RE-2026-019");
  const [issueDate, setIssueDate] = useState("2026-06-19");
  const [dueDate, setDueDate] = useState("2026-07-03");
  const [clientName, setClientName] = useState("Muster GmbH");
  const [clientContact, setClientContact] = useState("Anna Schneider");
  const [projectName, setProjectName] = useState(
    "Brand refresh und Rechnungsworkflow",
  );
  const [reference, setReference] = useState("PO-24819");
  const [notes, setNotes] = useState(
    "Vielen Dank für den Auftrag. Zahlung innerhalb von 14 Tagen ohne Abzug.",
  );
  const [items, setItems] = useState<LineItem[]>(initialItems);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + calcLineTotal(item), 0),
    [items],
  );

  const taxTotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + calcLineTotal(item) * (item.taxRate / 100),
        0,
      ),
    [items],
  );

  const grossTotal = subtotal + taxTotal;

  const updateItem = (
    id: number,
    field: keyof LineItem,
    value: string | number,
  ) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) {
          return item;
        }

        return {
          ...item,
          [field]:
            field === "description"
              ? value
              : field === "taxRate"
                ? Number(value)
                : Number(value),
        } as LineItem;
      }),
    );
  };

  const addItem = () => {
    setItems((current) => [
      ...current,
      {
        id: Date.now(),
        description: "Neue Position",
        quantity: 1,
        unitPrice: 0,
        taxRate: 19,
      },
    ]);
  };

  const removeItem = (id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  return (
    <Layout>
      <div
        className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#fafafa_100%)]"
        style={{
          fontFamily:
            '"Geist Sans", "Geist", Inter, ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="absolute right-8 top-14 h-60 w-60 rounded-full bg-gray-100 blur-3xl" />
          <div className="absolute left-0 top-24 h-48 w-48 rounded-full bg-teal-100/70 blur-3xl" />
        </div>

        <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-blue-200 bg-blue-100 px-3 py-1 text-[12px] font-semibold text-blue-900">
                Geist test page
              </span>
              <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[12px] font-normal text-gray-700">
                Auto gespeichert
              </span>
              <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[12px] font-normal text-gray-700">
                Rechnungsentwurf
              </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)]">
              <div className="space-y-6">
                <header className="space-y-4">
                  <div className="max-w-3xl space-y-4">
                    <h1 className="text-[2.4rem] font-semibold tracking-[-0.04em] text-gray-950 sm:text-[3.4rem] lg:text-[4.3rem]">
                      Rechnungseditor für deutsche Rechnungen
                    </h1>
                    <p className="max-w-2xl text-[16px] leading-7 text-gray-700 sm:text-[18px]">
                      Eine Geist-orientierte Testseite mit Formularen, Live-Vorschau
                      und klaren Zuständen für Entwurf, Bearbeitung und Export.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button type="button" className={primaryButtonClass}>
                      PDF exportieren
                    </button>
                    <button type="button" className={secondaryButtonClass}>
                      Als Vorlage speichern
                    </button>
                    <button type="button" className={tertiaryButtonClass}>
                      Teilen
                    </button>
                  </div>
                </header>

                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    {label: "Netto", value: formatItemMoney(subtotal)},
                    {label: "Umsatzsteuer", value: formatItemMoney(taxTotal)},
                    {label: "Brutto", value: formatItemMoney(grossTotal)},
                  ].map((entry) => (
                    <div key={entry.label} className={panelClass + " p-5"}>
                      <p className="text-[13px] font-normal uppercase tracking-[0.08em] text-gray-500">
                        {entry.label}
                      </p>
                      <p className="mt-2 text-[1.7rem] font-semibold tracking-[-0.04em] text-gray-950">
                        {entry.value}
                      </p>
                    </div>
                  ))}
                </div>

                <section className={panelClass + " p-6 sm:p-7"}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-[20px] font-semibold tracking-[-0.03em] text-gray-950">
                        Rechnungsdaten
                      </h2>
                      <p className="mt-1 text-[14px] leading-6 text-gray-600">
                        Saubere Eingaben mit sichtbarem Fokus, klaren Abständen und
                        neutralen Oberflächen.
                      </p>
                    </div>
                    <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[12px] font-normal text-gray-600">
                      Geprüft für 1024px bis Mobile
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-[14px] font-normal text-gray-900">
                        Rechnungsnummer
                      </span>
                      <input
                        className={inputClass}
                        value={invoiceNumber}
                        onChange={(event) => setInvoiceNumber(event.target.value)}
                        placeholder="RE-2026-019"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-[14px] font-normal text-gray-900">
                        Projekttitel
                      </span>
                      <input
                        className={inputClass}
                        value={projectName}
                        onChange={(event) => setProjectName(event.target.value)}
                        placeholder="Projektname"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-[14px] font-normal text-gray-900">
                        Rechnungsdatum
                      </span>
                      <input
                        className={inputClass}
                        type="date"
                        value={issueDate}
                        onChange={(event) => setIssueDate(event.target.value)}
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-[14px] font-normal text-gray-900">
                        Fällig am
                      </span>
                      <input
                        className={inputClass}
                        type="date"
                        value={dueDate}
                        onChange={(event) => setDueDate(event.target.value)}
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-[14px] font-normal text-gray-900">
                        Kundin oder Kunde
                      </span>
                      <input
                        className={inputClass}
                        value={clientName}
                        onChange={(event) => setClientName(event.target.value)}
                        placeholder="Muster GmbH"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-[14px] font-normal text-gray-900">
                        Ansprechpartner
                      </span>
                      <input
                        className={inputClass}
                        value={clientContact}
                        onChange={(event) => setClientContact(event.target.value)}
                        placeholder="Kontaktperson"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-[14px] font-normal text-gray-900">
                        Referenz
                      </span>
                      <input
                        className={inputClass}
                        value={reference}
                        onChange={(event) => setReference(event.target.value)}
                        placeholder="PO-24819"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-[14px] font-normal text-gray-900">
                        Zahlung
                      </span>
                      <select className={selectClass} defaultValue="14 Tage netto">
                        <option>14 Tage netto</option>
                        <option>30 Tage netto</option>
                        <option>Sofort zahlbar</option>
                      </select>
                    </label>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr]">
                    <label className="space-y-2">
                      <span className="text-[14px] font-normal text-gray-900">
                        Rechnungsadresse
                      </span>
                      <textarea
                        className={textAreaClass}
                        defaultValue={"Muster GmbH\nAnna Schneider\nRosenstraße 12\n10115 Berlin"}
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-[14px] font-normal text-gray-900">
                        Interne Notiz
                      </span>
                      <textarea
                        className={textAreaClass}
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                        placeholder="Notiz für Buchhaltung oder Kundin"
                      />
                    </label>
                  </div>
                </section>

                <section className={panelClass + " p-6 sm:p-7"}>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-[20px] font-semibold tracking-[-0.03em] text-gray-950">
                        Positionen
                      </h2>
                      <p className="mt-1 text-[14px] leading-6 text-gray-600">
                        Tabellenartige Eingaben für Beträge, Mengen und Steuersätze.
                      </p>
                    </div>
                    <button
                      type="button"
                      className={secondaryButtonClass}
                      onClick={addItem}
                    >
                      Position hinzufügen
                    </button>
                  </div>

                  <div className="mt-6 overflow-hidden rounded-[12px] border border-gray-200">
                    <div className="grid grid-cols-[minmax(0,2.2fr)_96px_128px_96px_72px] gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3 text-[12px] font-normal uppercase tracking-[0.08em] text-gray-500">
                      <span>Beschreibung</span>
                      <span className="text-right">Menge</span>
                      <span className="text-right">Einzelpreis</span>
                      <span className="text-right">MwSt.</span>
                      <span className="text-right">Aktion</span>
                    </div>

                    <div className="divide-y divide-gray-200">
                      {items.map((item) => {
                        const lineTotal = calcLineTotal(item);

                        return (
                          <div
                            key={item.id}
                            className="grid grid-cols-1 gap-3 px-4 py-4 md:grid-cols-[minmax(0,2.2fr)_96px_128px_96px_72px] md:items-center"
                          >
                            <label className="space-y-1 md:space-y-0">
                              <span className="sr-only">Beschreibung</span>
                              <input
                                className={inputClass}
                                value={item.description}
                                onChange={(event) =>
                                  updateItem(item.id, "description", event.target.value)
                                }
                              />
                            </label>

                            <label className="space-y-1 md:space-y-0">
                              <span className="sr-only">Menge</span>
                              <input
                                className={`${inputClass} text-right font-mono`}
                                type="number"
                                min={1}
                                step={1}
                                value={item.quantity}
                                onChange={(event) =>
                                  updateItem(item.id, "quantity", event.target.value)
                                }
                              />
                            </label>

                            <label className="space-y-1 md:space-y-0">
                              <span className="sr-only">Einzelpreis</span>
                              <input
                                className={`${inputClass} text-right font-mono`}
                                type="number"
                                min={0}
                                step={10}
                                value={item.unitPrice}
                                onChange={(event) =>
                                  updateItem(item.id, "unitPrice", event.target.value)
                                }
                              />
                            </label>

                            <label className="space-y-1 md:space-y-0">
                              <span className="sr-only">Steuersatz</span>
                              <select
                                className={`${selectClass} text-right font-mono`}
                                value={item.taxRate}
                                onChange={(event) =>
                                  updateItem(item.id, "taxRate", event.target.value)
                                }
                              >
                                <option value={19}>19%</option>
                                <option value={7}>7%</option>
                                <option value={0}>0%</option>
                              </select>
                            </label>

                            <div className="flex items-center justify-between gap-3 md:justify-end">
                              <span className="text-[14px] font-semibold text-gray-950 md:hidden">
                                {formatItemMoney(lineTotal)}
                              </span>
                              <button
                                type="button"
                                className="rounded-[6px] px-2 py-1 text-[13px] font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                                onClick={() => removeItem(item.id)}
                                aria-label={`Position ${item.id} entfernen`}
                              >
                                Entfernen
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-[12px] border border-gray-200 bg-gray-50 px-4 py-3">
                    <div>
                      <p className="text-[13px] font-normal text-gray-600">
                        Positionen gesamt
                      </p>
                      <p className="text-[14px] font-semibold text-gray-950">
                        {items.length} Positionen
                      </p>
                    </div>
                    <p className="text-[14px] font-semibold text-gray-950">
                      {formatItemMoney(subtotal)}
                    </p>
                  </div>
                </section>

                <section className={panelClass + " p-6 sm:p-7"}>
                  <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-4">
                      <h2 className="text-[20px] font-semibold tracking-[-0.03em] text-gray-950">
                        Zahlung und Hinweise
                      </h2>
                      <div className="rounded-[12px] border border-gray-200 bg-gray-50 p-4">
                        <p className="text-[13px] uppercase tracking-[0.08em] text-gray-500">
                          Bankverbindung
                        </p>
                        <p className="mt-2 text-[14px] leading-6 text-gray-700">
                          IBAN: DE12 3456 7890 1234 5678 90
                          <br />
                          BIC: GENODEF1SXX
                          <br />
                          Verwendungszweck: {invoiceNumber}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[12px] border border-gray-200 bg-gray-50 p-4">
                      <p className="text-[13px] uppercase tracking-[0.08em] text-gray-500">
                        Zahlungshinweis
                      </p>
                      <p className="mt-2 text-[14px] leading-6 text-gray-700">
                        {notes}
                      </p>
                      <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
                        <div className="flex items-center justify-between text-[14px]">
                          <span className="text-gray-600">Netto</span>
                          <span className="font-semibold text-gray-950">
                            {formatItemMoney(subtotal)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[14px]">
                          <span className="text-gray-600">USt. 19%</span>
                          <span className="font-semibold text-gray-950">
                            {formatItemMoney(taxTotal)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-[16px]">
                          <span className="font-semibold text-gray-950">Gesamt</span>
                          <span className="font-semibold text-gray-950">
                            {formatItemMoney(grossTotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
                <section className={panelClass + " p-5 sm:p-6"}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[12px] font-normal uppercase tracking-[0.08em] text-gray-500">
                        Live Vorschau
                      </p>
                      <h2 className="mt-2 text-[20px] font-semibold tracking-[-0.03em] text-gray-950">
                        Rechnung {invoiceNumber}
                      </h2>
                    </div>
                    <span className="rounded-full border border-green-200 bg-green-100 px-3 py-1 text-[12px] font-semibold text-green-900">
                      Bereit
                    </span>
                  </div>

                  <div className="mt-6 rounded-[12px] border border-gray-200 bg-white p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[13px] font-semibold text-gray-950">
                          Kleinbyte Studio
                        </p>
                        <p className="mt-1 text-[13px] leading-5 text-gray-600">
                          Musterstraße 18
                          <br />
                          80331 München
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[12px] uppercase tracking-[0.08em] text-gray-500">
                          Rechnungsnummer
                        </p>
                        <p className="text-[14px] font-semibold text-gray-950">
                          {invoiceNumber}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 border-t border-gray-200 pt-5 sm:grid-cols-2">
                      <div>
                        <p className="text-[12px] uppercase tracking-[0.08em] text-gray-500">
                          Rechnung an
                        </p>
                        <p className="mt-1 text-[14px] font-semibold text-gray-950">
                          {clientName}
                        </p>
                        <p className="text-[13px] text-gray-600">{clientContact}</p>
                      </div>
                      <div>
                        <p className="text-[12px] uppercase tracking-[0.08em] text-gray-500">
                          Daten
                        </p>
                        <p className="mt-1 text-[13px] leading-5 text-gray-600">
                          Rechnungsdatum: {issueDate}
                          <br />
                          Fällig am: {dueDate}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-[12px] bg-gray-50 p-4">
                      <p className="text-[13px] font-semibold text-gray-950">
                        {projectName}
                      </p>
                      <p className="mt-1 text-[13px] leading-5 text-gray-600">
                        Referenz {reference}
                      </p>
                      <p className="mt-3 rounded-[10px] border border-gray-200 bg-white px-3 py-2 text-[13px] leading-5 text-gray-700">
                        {notes}
                      </p>
                    </div>

                    <div className="mt-5 overflow-hidden rounded-[12px] border border-gray-200">
                      <div className="grid grid-cols-[minmax(0,1fr)_64px_96px] gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3 text-[12px] font-normal uppercase tracking-[0.08em] text-gray-500">
                        <span>Position</span>
                        <span className="text-right">Menge</span>
                        <span className="text-right">Summe</span>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="grid grid-cols-[minmax(0,1fr)_64px_96px] gap-3 px-4 py-3 text-[13px] leading-5"
                          >
                            <div>
                              <p className="font-semibold text-gray-950">
                                {item.description}
                              </p>
                              <p className="text-gray-500">MwSt. {item.taxRate}%</p>
                            </div>
                            <p className="text-right font-[family-name:ui-monospace] text-gray-600">
                              {item.quantity}
                            </p>
                            <p className="text-right font-[family-name:ui-monospace] font-semibold text-gray-950">
                              {formatItemMoney(calcLineTotal(item))}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 space-y-3 border-t border-gray-200 pt-5">
                      <div className="flex items-center justify-between text-[14px]">
                        <span className="text-gray-600">Zwischensumme</span>
                        <span className="font-semibold text-gray-950">
                          {formatItemMoney(subtotal)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[14px]">
                        <span className="text-gray-600">Umsatzsteuer</span>
                        <span className="font-semibold text-gray-950">
                          {formatItemMoney(taxTotal)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-[16px]">
                        <span className="font-semibold text-gray-950">Gesamtbetrag</span>
                        <span className="font-semibold text-gray-950">
                          {formatItemMoney(grossTotal)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button type="button" className={primaryButtonClass}>
                      Exportieren
                    </button>
                    <button type="button" className={secondaryButtonClass}>
                      Freigeben
                    </button>
                  </div>
                </section>

                <section className={panelClass + " p-5 sm:p-6"}>
                  <h3 className="text-[16px] font-semibold tracking-[-0.02em] text-gray-950">
                    Geist Check
                  </h3>
                  <div className="mt-4 grid gap-3">
                    {[
                      "6px Rundung für Eingaben",
                      "12px Rundung für Karten",
                      "2px Schatten mit subtiler Tiefe",
                      "Blau als Fokus- und Aktionsfarbe",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between rounded-[12px] border border-gray-200 bg-gray-50 px-4 py-3"
                      >
                        <span className="text-[14px] text-gray-700">{item}</span>
                        <span className="text-[13px] font-semibold text-gray-950">
                          OK
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
