import { useState } from "react";

const ENCHANT_OPTIONS = {
  무기: [
    { name: "물리/마법 최대대미지%", min: 1, max: 221 },
    { name: "물리/마법 최소대미지%", min: 1, max: 251 },
    { name: "물리/마법 크리티컬 대미지%", min: 1, max: 151 },
    { name: "무기공격력/속성력+", min: 1, max: 251 },
    { name: "무기공격력/속성력%", min: 1, max: 14 },
    { name: "올스탯+", min: 1, max: 18001 },
    { name: "올스탯%", min: 1, max: 15 },
    { name: "근력/마법력+", min: 1, max: 22001 },
  ],
  정령석: [
    { name: "물리/마법 최대대미지%", min: 1, max: 121 },
    { name: "물리/마법 최소대미지%", min: 1, max: 151 },
    { name: "올스탯+", min: 1, max: 11001 },
    { name: "근력/마법력%", min: 1, max: 10 },
    { name: "근력/마법력+", min: 1, max: 14001 },
    { name: "무기공력력/속성력+", min: 1, max: 151 },
  ],
  헬멧: [
    { name: "물리/마법 크리티컬 대미지%", min: 1, max: 101 },
    { name: "물리/마법 명중률%", min: 1, max: 151 },
    { name: "올스탯+", min: 1, max: 16001 },
    { name: "일반 몬스터 지배력%", min: 1, max: 4.1 },
    { name: "무기공격력/속성력+", min: 1, max: 171 },
    { name: "근력/마법력+", min: 1, max: 20001 },
  ],
  플레이트: [
    { name: "물리/마법 최대대미지%", min: 1, max: 101 },
    { name: "물리/마법 최소대미지%", min: 1, max: 101 },
    { name: "올스탯%", min: 1, max: 19 },
    { name: "올스탯+", min: 1, max: 16001 },
    { name: "무기공격력/속성력%", min: 1, max: 16 },
    { name: "무기공격력/속성력+", min: 1, max: 171 },
    { name: "근력/마법력+", min: 1, max: 20001 },
  ],
  클립: [
    { name: "물리/마법 최대대미지%", min: 1, max: 101 },
    { name: "물리/마법 최소대미지%", min: 1, max: 101 },
    { name: "올스탯%", min: 1, max: 19 },
    { name: "올스탯+", min: 1, max: 16001 },
    { name: "무기공격력/속성력%", min: 1, max: 16 },
    { name: "무기공격력/속성력+", min: 1, max: 171 },
    { name: "근력/마법력+", min: 1, max: 20001 },
  ],
  글러브: [
    { name: "물리/마법 크리티컬 대미지%", min: 1, max: 101 },
    { name: "물리/마법 최소대미지%", min: 1, max: 101 },
    { name: "보스 몬스터 지배력%", min: 1, max: 4.1 },
    { name: "올스탯+", min: 1, max: 16001 },
    { name: "무기공격력/속성력%", min: 1, max: 16 },
    { name: "무기공격력/속성력+", min: 1, max: 171 },
    { name: "근력/마법력+", min: 1, max: 20001 },
  ],
  부츠: [
    { name: "물리/마법 크리티컬 대미지%", min: 1, max: 151 },
    { name: "물리/마법 최소대미지%", min: 1, max: 101 },
    { name: "이동속도%", min: 1, max: 151 },
    { name: "올스탯%", min: 1, max: 19 },
    { name: "올스탯+", min: 1, max: 16001 },
    { name: "무기공격력/속성력+", min: 1, max: 171 },
    { name: "근력/마법력+", min: 1, max: 20001 },
  ],
  망토: [
    { name: "물리/마법 크리티컬 대미지%", min: 1, max: 71 },
    { name: "물리/마법 최소대미지%", min: 1, max: 71 },
    { name: "올스탯%", min: 1, max: 13 },
    { name: "올스탯+", min: 1, max: 11001 },
    { name: "무기공격력/속성력+", min: 1, max: 161 },
    { name: "물리/마법 고정대미지+", min: 1, max: 30001 },
  ],
  귀걸이: [
    { name: "물리/마법 크리티컬 대미지%", min: 1, max: 71 },
    { name: "물리/마법 최대대미지%", min: 1, max: 71 },
    { name: "물리/마법 최소대미지%", min: 1, max: 71 },
    { name: "올스탯+", min: 1, max: 11001 },
    { name: "무기공격력/속성력+", min: 1, max: 121 },
    { name: "물리/마법 관통력%", min: 1, max: 41 },
    { name: "근력/마법력+", min: 1, max: 14001 },
    { name: "물리/마법 고정대미지+", min: 1, max: 30001 },
  ],
  반지: [
    { name: "물리/마법 최대대미지%", min: 1, max: 71 },
    { name: "물리/마법 최소대미지%", min: 1, max: 71 },
    { name: "스킬 쿨타임 감소%", min: 1, max: 5.1 },
    { name: "올스탯+", min: 1, max: 11001 },
    { name: "무기공격력/속성력%", min: 1, max: 11 },
    { name: "무기공격력/속성력+", min: 1, max: 121 },
    { name: "근력/마법력+", min: 1, max: 14001 },
    { name: "물리/마법 고정대미지+", min: 1, max: 30001 },
  ],
  타투: [
    { name: "물리/마법 크리티컬 대미지%", min: 1, max: 81 },
    { name: "물리/마법 최소대미지%", min: 1, max: 101 },
    { name: "보스 몬스터 지배력%", min: 1, max: 3.3 },
    { name: "올스탯%", min: 1, max: 13 },
    { name: "올스탯+", min: 1, max: 12001 },
    { name: "무기공격력/속성력+", min: 1, max: 121 },
    { name: "근력/마법력+", min: 1, max: 16001 },
  ],
  안경: [
    { name: "물리/마법 명중률%", min: 1, max: 86 },
    { name: "물리/마법 최대대미지%", min: 1, max: 81 },
    { name: "물리/마법 최소대미지%", min: 1, max: 101 },
    { name: "올스탯+", min: 1, max: 12001 },
    { name: "무기공격력/속성력%", min: 1, max: 11 },
    { name: "무기공격력/속성력+", min: 1, max: 151 },
    { name: "근력/마법력+", min: 1, max: 16001 },
  ],
  스타킹: [
    { name: "최소/최대 대미지%", min: 1, max: 71 },
    { name: "물리/마법 최소대미지%", min: 1, max: 101 },
    { name: "일반 몬스터 지배력%", min: 1, max: 3.3 },
    { name: "이동속도%", min: 1, max: 71 },
    { name: "올스탯+", min: 1, max: 12001 },
    { name: "무기공격력/속성력+", min: 1, max: 151 },
    { name: "근력/마법력+", min: 1, max: 16001 },
  ],
};

export default function EnchantCalculator() {
    const [selectedPart, setSelectedPart] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [inputValues, setInputValues] = useState({});
    const [result, setResult] = useState(null);
  
    const handleOptionToggle = (optionName) => {
      if (selectedOptions.includes(optionName)) {
        setSelectedOptions(selectedOptions.filter((opt) => opt !== optionName));
      } else {
        if (selectedOptions.length >= 5) return;
        setSelectedOptions([...selectedOptions, optionName]);
      }
    };
  
    const handleInputChange = (optionName, value) => {
      setInputValues({ ...inputValues, [optionName]: value });
    };
  
    const calculate = () => {
      const options = ENCHANT_OPTIONS[selectedPart];
      const selected = options.filter((opt) => selectedOptions.includes(opt.name));
      const values = selected.map((opt) => {
        const value = parseFloat(inputValues[opt.name]);
        const percentage =
          value && value >= opt.min
            ? Math.min(100, ((value / opt.max) * 100).toFixed(1))
            : 0;
        return { ...opt, value, percentage };
      });
  
      const avg =
        values.length > 0
          ? (
              values.reduce((acc, cur) => acc + parseFloat(cur.percentage), 0) /
              values.length
            ).toFixed(1)
          : 0;
  
      setResult({ details: values, average: avg });
    };
  
    return (
      <div className="max-w-3xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">✨ 인챈트 계산기</h1>
  
        {/* 부위 선택 */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {Object.keys(ENCHANT_OPTIONS).map((part) => (
            <button
              key={part}
              onClick={() => {
                setSelectedPart(part);
                setSelectedOptions([]);
                setInputValues({});
                setResult(null);
              }}
              className={`px-4 py-2 rounded-full font-medium border transition 
                ${
                  selectedPart === part
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
            >
              {part}
            </button>
          ))}
        </div>
  
        {/* 옵션 입력 */}
        {selectedPart && (
          <div className="space-y-4">
            {ENCHANT_OPTIONS[selectedPart].map((opt) => (
              <div
                key={opt.name}
                className={`flex items-center gap-3 border rounded-md px-4 py-2 shadow-sm ${
                  selectedOptions.includes(opt.name) ? "bg-blue-50 border-blue-300" : "bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(opt.name)}
                  onChange={() => handleOptionToggle(opt.name)}
                />
                <div className="flex-grow">
                  <label className="block font-medium text-gray-700">
                    {opt.name}
                    <span className="text-sm text-gray-400 ml-1">
                      ({opt.min} ~ {opt.max})
                    </span>
                  </label>
                </div>
                <input
                  type="number"
                  disabled={!selectedOptions.includes(opt.name)}
                  placeholder="수치 입력"
                  className="border px-3 py-1 rounded w-28 text-right focus:outline-none focus:ring focus:border-blue-400"
                  value={inputValues[opt.name] || ""}
                  onChange={(e) => handleInputChange(opt.name, e.target.value)}
                />
              </div>
            ))}
  
            <div className="text-center mt-6">
              <button
                onClick={calculate}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow"
              >
                계산
              </button>
            </div>
          </div>
        )}
  
        {/* 결과 출력 */}
        {result && (
          <div className="mt-8 bg-blue-50 border border-blue-200 p-6 rounded-lg shadow-inner">
            <h2 className="text-lg font-bold text-blue-700 mb-4">📊 결과 요약</h2>
            <ul className="space-y-2 text-gray-800">
              {result.details.map((opt) => (
                <li key={opt.name} className="flex justify-between">
                  <span>{opt.name} ({opt.value})</span>
                  <span className="font-semibold text-blue-600">{opt.percentage}%</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-center">
              <p className="text-xl font-bold text-green-700">
                👉 평균 인챈트 수준: {result.average}%
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }