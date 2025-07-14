// app/tools/unit-converter/unit-converter-client.tsx
"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";

// ─── Tür ve Veri Tanımları ───────────────────────────────────────────────────
type LengthUnits = "m" | "km" | "cm" | "mm" | "mi" | "yd" | "ft" | "in";
type MassUnits = "kg" | "g" | "mg" | "lb" | "oz";
type VolumeUnits = "L" | "mL" | "m3" | "gal" | "qt" | "pt" | "cup";
type TemperatureUnits = "C" | "F" | "K";
type TimeUnits = "s" | "min" | "h" | "d";
type DataUnits =
  | "B"
  | "KB"
  | "MB"
  | "GB"
  | "TB"
  | "bit"
  | "kb"
  | "mb"
  | "gb"
  | "tb";

interface CategoryDef<U extends string> {
  label: string;
  units: Record<U, string>;
  factors?: Record<U, number>;
}

const CATEGORIES = {
  length: {
    label: "Length",
    units: {
      m: "Meter",
      km: "Kilometer",
      cm: "Centimeter",
      mm: "Millimeter",
      mi: "Mile",
      yd: "Yard",
      ft: "Foot",
      in: "Inch",
    },
    factors: {
      m: 1,
      km: 1000,
      cm: 0.01,
      mm: 0.001,
      mi: 1609.344,
      yd: 0.9144,
      ft: 0.3048,
      in: 0.0254,
    },
  } as CategoryDef<LengthUnits>,
  mass: {
    label: "Mass",
    units: {
      kg: "Kilogram",
      g: "Gram",
      mg: "Milligram",
      lb: "Pound",
      oz: "Ounce",
    },
    factors: {
      kg: 1,
      g: 0.001,
      mg: 0.000001,
      lb: 0.45359237,
      oz: 0.0283495231,
    },
  } as CategoryDef<MassUnits>,
  volume: {
    label: "Volume",
    units: {
      L: "Liter",
      mL: "Milliliter",
      m3: "Cubic meter",
      gal: "Gallon",
      qt: "Quart",
      pt: "Pint",
      cup: "Cup",
    },
    factors: {
      L: 1,
      mL: 0.001,
      m3: 1000,
      gal: 3.78541178,
      qt: 0.946352946,
      pt: 0.473176473,
      cup: 0.24,
    },
  } as CategoryDef<VolumeUnits>,
  temperature: {
    label: "Temperature",
    units: {
      C: "Celsius",
      F: "Fahrenheit",
      K: "Kelvin",
    },
  } as CategoryDef<TemperatureUnits>,
  time: {
    label: "Time",
    units: {
      s: "Second",
      min: "Minute",
      h: "Hour",
      d: "Day",
    },
    factors: {
      s: 1,
      min: 60,
      h: 3600,
      d: 86400,
    },
  } as CategoryDef<TimeUnits>,
  data: {
    label: "Data",
    units: {
      B: "Byte",
      KB: "Kilobyte",
      MB: "Megabyte",
      GB: "Gigabyte",
      TB: "Terabyte",
      bit: "Bit",
      kb: "Kilobit",
      mb: "Megabit",
      gb: "Gigabit",
      tb: "Terabit",
    },
    factors: {
      B: 1,
      KB: 1024,
      MB: 1024 ** 2,
      GB: 1024 ** 3,
      TB: 1024 ** 4,
      bit: 1 / 8,
      kb: 1024 / 8,
      mb: 1024 ** 2 / 8,
      gb: 1024 ** 3 / 8,
      tb: 1024 ** 4 / 8,
    },
  } as CategoryDef<DataUnits>,
};
type CategoryKey = keyof typeof CATEGORIES;

// ─── Dönüştürme Fonksiyonu ─────────────────────────────────────────────────
function convert(
  category: CategoryKey,
  from: string,
  to: string,
  value: number
): number {
  if (category === "temperature") {
    let c: number;
    switch (from as TemperatureUnits) {
      case "C":
        c = value;
        break;
      case "F":
        c = ((value - 32) * 5) / 9;
        break;
      default:
        c = value - 273.15;
    }
    switch (to as TemperatureUnits) {
      case "C":
        return c;
      case "F":
        return (c * 9) / 5 + 32;
      default:
        return c + 273.15;
    }
  }

  const def = CATEGORIES[category];
  if (!def.factors) {
    throw new Error(`Category "${category}" has no scaling factors.`);
  }
  const fromF = def.factors[from as keyof typeof def.factors];
  const toF = def.factors[to as keyof typeof def.factors];
  const base = value * fromF;
  return base / toF;
}

// ─── React Bileşeni ─────────────────────────────────────────────────────────
export default function UnitConverterClient() {
  const categoryKeys = Object.keys(CATEGORIES) as CategoryKey[];
  const [category, setCategory] = useState<CategoryKey>(categoryKeys[0]);

  const units = CATEGORIES[category].units;
  const unitKeys = Object.keys(units);

  const [fromUnit, setFromUnit] = useState(unitKeys[0]);
  const [toUnit, setToUnit] = useState(unitKeys[1] ?? unitKeys[0]);

  const [inputValue, setInputValue] = useState("1");
  const [outputValue, setOutputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const cat = e.target.value as CategoryKey;
    setCategory(cat);
    const newUnits = Object.keys(CATEGORIES[cat].units);
    setFromUnit(newUnits[0]);
    setToUnit(newUnits[1] ?? newUnits[0]);
    setInputValue("1");
    setOutputValue("");
    setError(null);
    inputRef.current?.focus();
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setOutputValue("");
    inputRef.current?.focus();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const num = parseFloat(inputValue);
      if (!Number.isFinite(num)) {
        setError("Lütfen geçerli bir sayı girin.");
        setOutputValue("");
        return;
      }
      if (num < 0 && category !== "temperature") {
        setError("Negatif değer kabul edilmiyor.");
        setOutputValue("");
        return;
      }
      if (Math.abs(num) > Number.MAX_SAFE_INTEGER) {
        setError("Değer çok büyük.");
        setOutputValue("");
        return;
      }
      try {
        setError(null);
        const result = convert(category, fromUnit, toUnit, num);
        setOutputValue(result.toFixed(6).replace(/\.?0+$/, ""));
      } catch (err) {
        setError((err as Error).message);
        setOutputValue("");
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [category, fromUnit, toUnit, inputValue]);

  return (
    <section
      id="unit-converter"
      aria-labelledby="unit-converter-heading"
      className="space-y-16 text-gray-900 antialiased"
    >
      {/* Başlık */}
      <div className="text-center space-y-4">
        <h1
          id="unit-converter-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          Unit Converter
        </h1>
        <div className="mx-auto mt-2 h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mx-auto max-w-3xl text-lg sm:text-xl text-gray-700 leading-relaxed">
          Uzunluk, kütle, hacim, sıcaklık, zaman, veri ve daha fazlasını çevirmek için—tamamen istemci tarafında.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="max-w-3xl mx-auto space-y-8 sm:px-0"
      >
        {/* Kategori */}
        <div>
          <label
            htmlFor="category-select"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            Kategori
          </label>
          <select
            id="category-select"
            value={category}
            onChange={handleCategoryChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7c3aed] transition"
          >
            {categoryKeys.map((key) => (
              <option key={key} value={key}>
                {CATEGORIES[key].label}
              </option>
            ))}
          </select>
        </div>

        {/* Birimler */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="from-unit"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Değer
            </label>
            <select
              id="from-unit"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7c3aed] transition"
            >
              {unitKeys.map((u) => (
                <option key={u} value={u}>
                  {units[u as keyof typeof units]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="to-unit"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Hedef
            </label>
            <select
              id="to-unit"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7c3aed] transition"
            >
              {unitKeys.map((u) => (
                <option key={u} value={u}>
                  {units[u as keyof typeof units]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap */}
        <div className="text-center">
          <button
            type="button"
            onClick={swapUnits}
            className="text-indigo-600 hover:underline focus:outline-none transition"
          >
            Birimleri Değiştir
          </button>
        </div>

        {/* Giriş */}
        <div>
          <label
            htmlFor="value-input"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            Miktar
          </label>
          <input
            id="value-input"
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Sayı girin"
            className="w-full p-3 font-mono border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7c3aed] transition"
          />
        </div>

        {/* Hata */}
        {error && (
          <p role="alert" className="text-red-700 text-sm">
            {error}
          </p>
        )}
      </form>

      {/* Çıktı */}
      {outputValue !== "" && (
        <div className="mt-12 max-w-3xl mx-auto text-center">
          <p className="text-xl font-medium">
            Sonuç:{" "}
            <span className="font-mono text-indigo-600">{outputValue}</span>{" "}
            {units[toUnit as keyof typeof units]}
          </p>
        </div>
      )}
    </section>
  );
}