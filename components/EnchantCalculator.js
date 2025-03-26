import { useState } from "react";
import ProgressBar from "./ProgressBar"; // 게이지 바 컴포넌트

const ENCHANT_OPTIONS = {
  무기: [
    { name: "물리/마법 최대대미지%", min: 1, max: 221 },
    { name: "물리/마법 최소대미지%", min: 1, max: 251 },
    { name: "물리/마법 크리티컬 대미지%", min: 1, max: 151 },
    { name: "무기공격력/속성력+", min: 1, max: 251 },
    { name: "무기공격력/속성력%", min: 1, max: 15 },
    { name: "올스탯+", min: 1, max: 18001 },
    { name: "올스탯%", min: 1, max: 15 },
    { name: "근력/마법력+", min: 1, max: 22001 },
    { name: "물리/마법 백어택대미지%", min: 1, max: 251 },
    { name: "물리/마법 고정대미지%", min: 1, max: 11 },
    { name: "물리/마법 고정대미지+", min: 1, max: 25001 },
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
    { name: "스킬 쿨타임 감소%", min: 0.1, max: 5.1 },
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
    { name: "물리/마법 고정대미지+", min: 1, max: 25001 },
    { name: "최대 HP%", min: 1, max: 9 },
  ],
  안경: [
    { name: "물리/마법 명중률%", min: 1, max: 86 },
    { name: "물리/마법 최대대미지%", min: 1, max: 81 },
    { name: "물리/마법 최소대미지%", min: 1, max: 101 },
    { name: "올스탯+", min: 1, max: 12001 },
    { name: "무기공격력/속성력%", min: 1, max: 11 },
    { name: "무기공격력/속성력+", min: 1, max: 151 },
    { name: "근력/마법력+", min: 1, max: 16001 },
    { name: "물리/마법 고정대미지+", min: 1, max: 25001 },
    { name: "최대 HP%", min: 1, max: 9 },
  ],
  스타킹: [
    { name: "최소/최대 대미지%", min: 1, max: 71 },
    { name: "물리/마법 최소대미지%", min: 1, max: 101 },
    { name: "일반 몬스터 지배력%", min: 1, max: 3.3 },
    { name: "이동속도%", min: 1, max: 71 },
    { name: "올스탯+", min: 1, max: 12001 },
    { name: "무기공격력/속성력+", min: 1, max: 151 },
    { name: "근력/마법력+", min: 1, max: 16001 },
    { name: "물리/마법 고정대미지+", min: 1, max: 25001 },
    { name: "최대 HP%", min: 1, max: 9 },
  ],
};

const ENCHANT_BOOSTS = {
  무기: {
    "물리/마법 최대대미지%": { "3강": { value: 26, max: 26 }, "풀강": { value: 52, max: 52 } },
    "물리/마법 최소대미지%": { "3강": { value: 30, max: 30 }, "풀강": { value: 60, max: 60 } },
    "물리/마법 크리티컬 대미지%": { "3강": { value: 18, max: 18 }, "풀강": { value: 36, max: 36 } },
    "올스탯%": { "3강": { value: 1, max: 1 }, "풀강": { value: 3, max: 3 } },
    "올스탯+": { "3강": { value: 2200, max: 2200 }, "풀강": { value: 4400, max: 4400 } },
    "무기공격력/속성력%": { "3강": { value: 1, max: 1 }, "풀강": { value: 3, max: 3 } },
    "무기공격력/속성력+": { "3강": { value: 30, max: 30 }, "풀강": { value: 60, max: 60 } },
    "근력/마법력+": { "3강": { value: 2600, max: 2600 }, "풀강": { value: 5200, max: 5200 } },
    "물리/마법 백어택대미지": { "3강": { value: 30, max: 30 }, "풀강": { value: 60, max: 60 } },
    "물리/마법 고정대미지%": { "3강": { value: 1, max: 1 }, "풀강": { value: 3, max: 3 } },
    "물리/마법 고정대미지+": { "3강": { value: 3000, max: 3000 }, "풀강": { value: 6000, max: 6000 } },
  },
  정령석: {
    "물리/마법 최대대미지%": { "3강": { value: 14, max: 14 }, "풀강": { value: 28, max: 28 } },
    "물리/마법 최소대미지%": { "3강": { value: 18, max: 18 }, "풀강": { value: 36, max: 36 } },
    "올스탯%": { "3강": { value: 1, max: 1 }, "풀강": { value: 3, max: 3 } },
    "올스탯+": { "3강": { value: 1300, max: 1300 }, "풀강": { value: 2600, max: 2600 } },
    "무기공격력/속성력+": { "3강": { value: 18, max: 18 }, "풀강": { value: 36, max: 36 } },
    "근력/마법력%": { "3강": { value: 1, max: 1 }, "풀강": { value: 3, max: 3 } },
    "근력/마법력+": { "3강": { value: 1700, max: 1700 }, "풀강": { value: 3400, max: 3400 } },
  },
  타투: {
    "물리/마법 크리티컬 대미지%": { "3강": { value: 12, max: 12 }, "풀강": { value: 24, max: 24 } },
    "물리/마법 최소대미지%": { "3강": { value: 15, max: 15 }, "풀강": { value: 30, max: 30 } },
    "보스 몬스터 지배력%": { "3강": { value: 0.4, max: 0.4 }, "풀강": { value: 0.8, max: 0.8 } },
    "올스탯%": { "3강": { value: 1, max: 1 }, "풀강": { value: 3, max: 3 } },
    "올스탯+": { "3강": { value: 1800, max: 1800 }, "풀강": { value: 3600, max: 3600 } },
    "무기공격력/속성력+": { "3강": { value: 22, max: 22 }, "풀강": { value: 44, max: 44 } },
    "근력/마법력+": { "3강": { value: 2400, max: 2400 }, "풀강": { value: 4800, max: 4800 } },
    "물리/마법 고정대미지+": { "3강": { value: 3750, max: 3750 }, "풀강": { value: 7500, max: 7500 } },
    "최대 HP%": { "3강": { value: 1, max: 1 }, "풀강": { value: 3, max: 3 } },
  },
  안경: {
    "물리/마법 최대대미지%": { "3강": { value: 12, max: 12 }, "풀강": { value: 24, max: 24 } },
    "물리/마법 최소대미지%": { "3강": { value: 15, max: 15 }, "풀강": { value: 30, max: 30 } },
    "물리/마법 명중률%": { "3강": { value: 12, max: 12 }, "풀강": { value: 24, max: 24 } },
    "올스탯+": { "3강": { value: 1800, max: 1800 }, "풀강": { value: 3600, max: 3600 } },
    "무기공격력/속성력%": { "3강": { value: 1, max: 1 }, "풀강": { value: 3, max: 3 } },
    "무기공격력/속성력+": { "3강": { value: 22, max: 22 }, "풀강": { value: 44, max: 44 } },
    "근력/마법력+": { "3강": { value: 2400, max: 2400 }, "풀강": { value: 4800, max: 4800 } },
    "물리/마법 고정대미지+": { "3강": { value: 3750, max: 3750 }, "풀강": { value: 7500, max: 7500 } },
    "최대 HP%": { "3강": { value: 1, max: 1 }, "풀강": { value: 3, max: 3 } },
  },
  스타킹: {
    "최소/최대대미지%": { "3강": { value: 10, max: 10 }, "풀강": { value: 20, max: 20 } },
    "물리/마법 최소대미지%": { "3강": { value: 15, max: 15 }, "풀강": { value: 30, max: 30 } },
    "일반 몬스터 지배력%": { "3강": { value: 0.4, max: 0.4 }, "풀강": { value: 0.8, max: 0.8 } },
    "올스탯+": { "3강": { value: 1800, max: 1800 }, "풀강": { value: 3600, max: 3600 } },
    "무기공격력/속성력+": { "3강": { value: 22, max: 22 }, "풀강": { value: 44, max: 44 } },
    "근력/마법력+": { "3강": { value: 2400, max: 2400 }, "풀강": { value: 4800, max: 4800 } },
    "물리/마법 고정대미지+": { "3강": { value: 3750, max: 3750 }, "풀강": { value: 7500, max: 7500 } },
    "최대 HP%": { "3강": { value: 1, max: 1 }, "풀강": { value: 3, max: 3 } },
    "이동속도%": { "3강": { value: 10, max: 10 }, "풀강": { value: 20, max: 20 } },
  },
  헬멧: {
    "물리/마법 크리티컬 대미지%": { "3강": { value: 7, max: 15 }, "풀강": { value: 14, max: 30 } },
    "물리/마법 명중률%": { "3강": { value: 11, max: 23 }, "풀강": { value: 22, max: 46 } },
    "올스탯+": { "3강": { value: 1200, max: 2400 }, "풀강": { value: 2400, max: 4800 } },
    "일반 몬스터 지배력%": { "3강": { value: 0.3, max: 0.6 }, "풀강": { value: 0.6, max: 1.2 } },
    "무기공격력/속성력+": { "3강": { value: 12, max: 25 }, "풀강": { value: 24, max: 50 } },
    "근력/마법력+": { "3강": { value: 1500, max: 3000 }, "풀강": { value: 3000, max: 6000 } },
  },
  플레이트: {
    "물리/마법 최대대미지%": { "3강": { value: 7, max: 15 }, "풀강": { value: 14, max: 30 } },
    "물리/마법 최소대미지%": { "3강": { value: 7, max: 15 }, "풀강": { value: 14, max: 30 } },
    "올스탯%": { "3강": { value: 1, max: 3 }, "풀강": { value: 2, max: 6 } },
    "올스탯+": { "3강": { value: 1200, max: 2400 }, "풀강": { value: 2400, max: 4800 } },
    "무기공격력/속성력%": { "3강": { value: 1, max: 2 }, "풀강": { value: 2, max: 4 } },
    "무기공격력/속성력+": { "3강": { value: 12, max: 25 }, "풀강": { value: 24, max: 50 } },
    "근력/마법력+": { "3강": { value: 1500, max: 3000 }, "풀강": { value: 3000, max: 6000 } },
  },
  클립: {
    "물리/마법 최대대미지%": { "3강": { value: 7, max: 15 }, "풀강": { value: 14, max: 30 } },
    "물리/마법 최소대미지%": { "3강": { value: 7, max: 15 }, "풀강": { value: 14, max: 30 } },
    "올스탯%": { "3강": { value: 1, max: 3 }, "풀강": { value: 2, max: 6 } },
    "올스탯+": { "3강": { value: 1200, max: 2400 }, "풀강": { value: 2400, max: 4800 } },
    "무기공격력/속성력%": { "3강": { value: 1, max: 2 }, "풀강": { value: 2, max: 4 } },
    "무기공격력/속성력+": { "3강": { value: 12, max: 25 }, "풀강": { value: 24, max: 50 } },
    "근력/마법력+": { "3강": { value: 1500, max: 3000 }, "풀강": { value: 3000, max: 6000 } },
  },
  글러브: {
    "물리/마법 크리티컬 대미지%": { "3강": { value: 7, max: 15 }, "풀강": { value: 14, max: 30 } },
    "물리/마법 최소대미지%": { "3강": { value: 7, max: 15 }, "풀강": { value: 14, max: 30 } },
    "보스 몬스터 지배력%": { "3강": { value: 0.3, max: 0.6 }, "풀강": { value: 0.6, max: 1.2 } },
    "올스탯+": { "3강": { value: 1200, max: 2400 }, "풀강": { value: 2400, max: 4800 } },
    "무기공격력/속성력%": { "3강": { value: 1, max: 2 }, "풀강": { value: 2, max: 4 } },
    "무기공격력/속성력+": { "3강": { value: 12, max: 25 }, "풀강": { value: 24, max: 50 } },
    "근력/마법력+": { "3강": { value: 1500, max: 3000 }, "풀강": { value: 3000, max: 6000 } },
  },
  부츠: {
    "물리/마법 크리티컬 대미지%": { "3강": { value: 11, max: 23 }, "풀강": { value: 22, max: 46 } },
    "물리/마법 최소대미지%": { "3강": { value: 7, max: 15 }, "풀강": { value: 14, max: 30 } },
    "이동속도%": { "3강": { value: 11, max: 23 }, "풀강": { value: 22, max: 46 } },
    "올스탯%": { "3강": { value: 1, max: 3 }, "풀강": { value: 2, max: 6 } },
    "올스탯+": { "3강": { value: 1200, max: 2400 }, "풀강": { value: 2400, max: 4800 } },
    "무기공격력/속성력+": { "3강": { value: 12, max: 25 }, "풀강": { value: 24, max: 50 } },
    "근력/마법력+": { "3강": { value: 1500, max: 3000 }, "풀강": { value: 3000, max: 6000 } },
  },
  귀걸이: {
    "물리/마법 크리티컬 대미지%": { "3강": { value: 5, max: 10 }, "풀강": { value: 10, max: 20 } },
    "물리/마법 최대대미지%": { "3강": { value: 5, max: 10 }, "풀강": { value: 10, max: 20 } },
    "물리/마법 최소대미지%": { "3강": { value: 5, max: 10 }, "풀강": { value: 10, max: 20 } },
    "올스탯+": { "3강": { value: 825, max: 1650 }, "풀강": { value: 1650, max: 3300 } },
    "무기공격력/속성력+": { "3강": { value: 9, max: 18 }, "풀강": { value: 18, max: 36 } },
    "물리/마법 관통력%": { "3강": { value: 825, max: 1650 }, "풀강": { value: 1650, max: 3300 } },
    "근력/마법력+": { "3강": { value: 1050, max: 2100 }, "풀강": { value: 2100, max: 4200 } },
    "물리/마법 고정대미지": { "3강": { value: 1200, max: 1200 }, "풀강": { value: 2400, max: 2400 } },
  },
  망토: {
    "물리/마법 크리티컬 대미지%": { "3강": { value: 5, max: 10 }, "풀강": { value: 10, max: 20 } },
    "물리/마법 최소대미지%": { "3강": { value: 5, max: 10 }, "풀강": { value: 10, max: 20 } },
    "올스탯%": { "3강": { value: 1, max: 2 }, "풀강": { value: 2, max: 4 } },
    "올스탯+": { "3강": { value: 825, max: 1650 }, "풀강": { value: 1650, max: 3300 } },
    "무기공격력/속성력+": { "3강": { value: 12, max: 24 }, "풀강": { value: 24, max: 48 } },
    "근력/마법력+": { "3강": { value: 1050, max: 2100 }, "풀강": { value: 2100, max: 4200 } },
    "물리/마법 고정대미지": { "3강": { value: 1200, max: 1200 }, "풀강": { value: 2400, max: 2400 } },
  },
  반지: {
    "물리/마법 최대대미지%": { "3강": { value: 5, max: 10 }, "풀강": { value: 10, max: 20 } },
    "물리/마법 최소대미지%": { "3강": { value: 5, max: 10 }, "풀강": { value: 10, max: 20 } },
    "스킬 쿨타임 감소%": { "3강": { value: 0.4, max: 0.8 }, "풀강": { value: 0.8, max: 1.6 } },
    "올스탯+": { "3강": { value: 825, max: 1650 }, "풀강": { value: 1650, max: 3300 } },
    "무기공격력/속성력%": { "3강": { value: 1, max: 2 }, "풀강": { value: 2, max: 4 } },
    "무기공격력/속성력+": { "3강": { value: 9, max: 18 }, "풀강": { value: 18, max: 36 } },
    "근력/마법력+": { "3강": { value: 1050, max: 2100 }, "풀강": { value: 2100, max: 4200 } },
    "물리/마법 고정대미지": { "3강": { value: 1200, max: 1200 }, "풀강": { value: 2400, max: 2400 } },
  }
};

export default function EnchantCalculator() {
  const [selectedPart, setSelectedPart] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [result, setResult] = useState(null);
  const [level, setLevel] = useState("노강");
  const [hasCalculated, setHasCalculated] = useState(false);

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
    const boosts = ENCHANT_BOOSTS[selectedPart] || {};
    const values = selected.map((opt) => {
      const rawValue = parseFloat(inputValues[opt.name]);
      const baseMax = opt.max;
      let baseValue = rawValue;
  
      let bonus = 0;
      let bonusMax = 0;
  
      if (level !== "노강" && boosts[opt.name]) {
        bonus = boosts[opt.name][level]?.value || 0;
        bonusMax = boosts[opt.name][level]?.max || 0;
        baseValue += bonus;
      }
  
      const correctedMax = baseMax + bonusMax;
  
      const percentage = rawValue && rawValue >= opt.min
        ? Math.min(100, ((baseValue / correctedMax) * 100).toFixed(1))
        : 0;
  
      const isRangeBoost =
        level !== "노강" &&
        boosts[opt.name] &&
        boosts[opt.name][level].value !== boosts[opt.name][level].max;
  
      const percentageMin = isRangeBoost
        ? Math.min(100, ((rawValue + boosts[opt.name][level].value) / correctedMax * 100).toFixed(1))
        : percentage;
  
      const percentageMax = isRangeBoost
        ? Math.min(100, ((rawValue + boosts[opt.name][level].max) / correctedMax * 100).toFixed(1))
        : percentage;
  
      return {
        ...opt,
        value: rawValue,
        correctedValueMin: level === "노강" ? rawValue : rawValue + (boosts[opt.name]?.[level]?.value || 0),
        correctedValueMax: level === "노강" ? rawValue : rawValue + (boosts[opt.name]?.[level]?.max || 0),
        correctedMax,
        percentage,
        percentageMin,
        percentageMax,
        isRangeBoost,
      };
    });
  
    let avgMin = 0, avgMax = 0;
    if (values.length > 0) {
      avgMin = (values.reduce((acc, cur) => acc + parseFloat(cur.percentageMin), 0) / values.length).toFixed(1);
      avgMax = (values.reduce((acc, cur) => acc + parseFloat(cur.percentageMax), 0) / values.length).toFixed(1);
    }
  
    setResult({ details: values, averageMin: avgMin, averageMax: avgMax });
    setHasCalculated(true); // 🔥 여기가 핵심! 계산 후에 3강/풀강 버튼 활성화
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
            className={`cursor-pointer px-4 py-2 rounded-full font-medium border transition 
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

      {/* 강화 레벨 선택 */}
      <div className="flex justify-center gap-4 mb-4">
        {["노강", "3강", "풀강"].map((lvl) => (
          <button
            key={lvl}
            onClick={() => {
              if (lvl === "노강" || hasCalculated) setLevel(lvl);
            }}
            className={`px-4 py-1 rounded-md font-medium border transition 
              ${level === lvl
                ? "bg-purple-700 text-white border-purple-700"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }
              ${lvl !== "노강" && !hasCalculated ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            disabled={lvl !== "노강" && !hasCalculated}
          >
            {lvl}
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
              className="cursor-pointer px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow"
            >
              계산
            </button>
          </div>
        </div>
      )}

      {/* 결과 출력 */}
      {result && (
        <div className="mt-8 bg-blue-50 border border-blue-200 p-6 rounded-lg shadow-inner">
          <h2 className="text-lg font-bold text-blue-700 mb-4">📊 {level} 기준 결과</h2>
          <ul className="space-y-4 text-gray-800">
            {result.details.map((opt) => (
              <li key={opt.name}>
                <div className="flex justify-between mb-1">
                  <span>
                    {opt.name} (
                      {opt.correctedValueMin.toLocaleString()}
                      {opt.isRangeBoost && ` ~ ${opt.correctedValueMax.toLocaleString()}`} 
                      / 보정된 Max: {opt.correctedMax.toLocaleString()}
                    )
                  </span>
                  <span className="font-semibold text-blue-600">
                    {opt.percentageMin !== opt.percentageMax
                      ? `${opt.percentageMin}% ~ ${opt.percentageMax}%`
                      : `${opt.percentage}%`}
                  </span>
                </div>
                <ProgressBar min={opt.percentageMin} max={opt.percentageMax} />
              </li>
            ))}
          </ul>
          <div className="mt-6 text-center">
            <p className="text-xl font-bold text-green-700">
              👉 평균 인챈트 수준: {result.averageMin}%
              {result.averageMin !== result.averageMax ? ` ~ ${result.averageMax}%` : ""}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}