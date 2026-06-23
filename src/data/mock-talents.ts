// ─────────────────────────────────────────────────────────────────────────────
// Roster mock del CRM para el Flujo B (talento existente).
//
// PROD: estos talentos salen de GET /api/v1/talents (con sus plataformas,
// demografía guardada y tarifas unitarias actuales). Acá es data de ejemplo.
// ─────────────────────────────────────────────────────────────────────────────

import type { VerticalKey } from "@/data/benchmarks";
import type { Platform } from "@/lib/cotizador";

export interface TalentPlatform {
  handle: string;
  followers: number;
}

export interface CrmTalent {
  id: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  avatarColor: string;
  country: string;
  vertical: VerticalKey;
  platforms: Partial<Record<Platform, TalentPlatform>>;
  /** Demografía argentina (%) ya cargada en el CRM, por plataforma. */
  demographicsAr: Partial<Record<Platform, number>>;
  /** Tarifas unitarias actuales guardadas en el CRM (ARS). */
  currentTariffs: {
    postInstagram?: number;
    storyInstagram?: number;
    postTiktok?: number;
  };
}

export const CRM_TALENTS: CrmTalent[] = [
  {
    id: "tal_001",
    firstName: "Camila",
    lastName: "Aguirre",
    nickname: "Cami Beauty",
    avatarColor: "#E1306C",
    country: "AR",
    vertical: "beauty",
    platforms: {
      instagram: { handle: "camiaguirre", followers: 214_000 },
      tiktok: { handle: "camiaguirre", followers: 96_000 },
    },
    demographicsAr: { instagram: 84, tiktok: 80 },
    currentTariffs: { postInstagram: 780_000, storyInstagram: 260_000, postTiktok: 540_000 },
  },
  {
    id: "tal_002",
    firstName: "Federico",
    lastName: "Méndez",
    nickname: "Fede Cocina",
    avatarColor: "#F59E0B",
    country: "AR",
    vertical: "foodie",
    platforms: {
      instagram: { handle: "fedecocina", followers: 486_000 },
      tiktok: { handle: "fedecocina", followers: 312_000 },
    },
    demographicsAr: { instagram: 88, tiktok: 85 },
    currentTariffs: { postInstagram: 1_300_000, storyInstagram: 430_000, postTiktok: 980_000 },
  },
  {
    id: "tal_003",
    firstName: "Lola",
    lastName: "Ferrari",
    nickname: "Lola Trend",
    avatarColor: "#8B5CF6",
    country: "AR",
    vertical: "moda",
    platforms: {
      instagram: { handle: "lolatrend", followers: 1_420_000 },
      tiktok: { handle: "lolatrend", followers: 720_000 },
    },
    demographicsAr: { instagram: 72, tiktok: 70 },
    currentTariffs: { postInstagram: 2_400_000, storyInstagram: 800_000, postTiktok: 1_650_000 },
  },
  {
    id: "tal_004",
    firstName: "Ignacio",
    lastName: "Pérez",
    nickname: "Nacho Risas",
    avatarColor: "#10B981",
    country: "AR",
    vertical: "humor",
    platforms: {
      instagram: { handle: "nachorisas", followers: 98_000 },
      tiktok: { handle: "nachorisas", followers: 640_000 },
    },
    demographicsAr: { instagram: 90, tiktok: 88 },
    currentTariffs: { postInstagram: 520_000, storyInstagram: 170_000, postTiktok: 1_100_000 },
  },
  {
    id: "tal_005",
    firstName: "Julieta",
    lastName: "Sosa",
    nickname: "Juli Wellness",
    avatarColor: "#3B82F6",
    country: "AR",
    vertical: "lifestyle",
    platforms: {
      instagram: { handle: "juliwellness", followers: 38_500 },
    },
    demographicsAr: { instagram: 86 },
    currentTariffs: { postInstagram: 240_000, storyInstagram: 80_000 },
  },
  {
    id: "tal_006",
    firstName: "Tomás",
    lastName: "Bianchi",
    nickname: "Tomi Plays",
    avatarColor: "#4F46E5",
    country: "AR",
    vertical: "Other",
    platforms: {
      instagram: { handle: "tomiplays", followers: 152_000 },
      tiktok: { handle: "tomiplays", followers: 224_000 },
    },
    demographicsAr: { instagram: 78, tiktok: 76 },
    currentTariffs: { postInstagram: 600_000, storyInstagram: 200_000, postTiktok: 720_000 },
  },
  {
    id: "tal_007",
    firstName: "Marina",
    lastName: "Quiroga",
    nickname: "Indu Marina",
    avatarColor: "#0EA5E9",
    country: "AR",
    // Vertical Industria: dispara el fallback de reach (no hay benchmark de reach).
    vertical: "Industria",
    platforms: {
      instagram: { handle: "indumarina", followers: 64_000 },
    },
    demographicsAr: { instagram: 94 },
    currentTariffs: { postInstagram: 410_000, storyInstagram: 140_000 },
  },
];

export function fullName(t: CrmTalent): string {
  return `${t.firstName} ${t.lastName}`;
}

export function initials(t: CrmTalent): string {
  return `${t.firstName[0] ?? ""}${t.lastName[0] ?? ""}`.toUpperCase();
}
