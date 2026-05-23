"use client";
import { useState } from "react";
import { ELEMENT_ICON, ELEMENT_COLOR, ATTACK_ICON } from "@/lib/icons";

const SKILL_TYPE_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  skill:    { label: "Skill",    color: "#FF8080", bg: "rgba(204,34,34,0.15)" },
  ex_skill: { label: "EX Skill", color: "#FFD966", bg: "rgba(200,160,34,0.15)" },
  passive:  { label: "Passive",  color: "#80FFAA", bg: "rgba(34,180,100,0.15)" },
};

export function ToggleSkillCard({ group }: { group: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const skill = group[activeIndex];
  const typeInfo  = SKILL_TYPE_LABEL[skill.skill_type] ?? { label: skill.skill_type, color: "#888", bg: "rgba(255,255,255,0.05)" };
  const elemColor = ELEMENT_COLOR[skill.element] ?? "#888";
  const elemIcon  = skill.element ? ELEMENT_ICON[skill.element] : null;
  const atkIcon   = skill.attack_type ? ATTACK_ICON[skill.attack_type] : null;

  function cycleToggle() {
    setActiveIndex((activeIndex + 1) % group.length);
  }

  return (
    <div
      onClick={cycleToggle}
      style={{
        background: "var(--hbr-card)",
        border: "0.5px solid var(--hbr-border)",
        borderRadius: 8, padding: "18px 22px", marginBottom: 10,
        borderLeft: `2px solid ${typeInfo.color}`,
        cursor: "pointer", position: "relative",
        transition: "border-color 0.2s",
        userSelect: "none",
      }}
    >
      {/* Toggle indicator — bottom right, big and obvious */}
      <div style={{
        marginTop: 16,
        display: "flex", alignItems: "center", gap: 8,
        justifyContent: "flex-end",
        borderTop: "0.5px solid var(--hbr-border)", paddingTop: 12,
      }}>
        <span style={{ fontSize: 10, color: "var(--hbr-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          ↻ Tap card to toggle element
        </span>
        {group.map((g: any, i: number) => {
          const gElemColor = ELEMENT_COLOR[g.element] ?? "#888";
          const gElemIcon  = ELEMENT_ICON[g.element];
          return (
            <span key={i} style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              fontSize: 12, padding: "5px 14px", borderRadius: 4,
              background: activeIndex === i ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${activeIndex === i ? gElemColor : "rgba(255,255,255,0.1)"}`,
              color: activeIndex === i ? gElemColor : "var(--hbr-muted)",
              textTransform: "capitalize", fontWeight: activeIndex === i ? 700 : 400,
              transition: "all 0.15s",
            }}>
              {gElemIcon && <img src={gElemIcon} alt={g.element} style={{ width: 14, height: 14, objectFit: "contain" }} />}
              {g.element}
            </span>
          );
        })}
      </div>

      {/* Type badge + skill name */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <span style={{
          fontSize: 10, padding: "3px 10px", borderRadius: 3,
          background: typeInfo.bg, color: typeInfo.color,
          fontWeight: 600, letterSpacing: "0.05em", flexShrink: 0, textTransform: "uppercase",
        }}>
          {typeInfo.label}
        </span>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{skill.skill_name}</span>
      </div>

      {/* Tags */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14, alignItems: "center" }}>
        {skill.attack_type && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, padding: "3px 10px", borderRadius: 3, background: "rgba(255,255,255,0.05)", color: "var(--hbr-muted)", textTransform: "capitalize", border: "0.5px solid var(--hbr-border)" }}>
            {atkIcon && <img src={atkIcon} alt={skill.attack_type} style={{ width: 13, height: 13, objectFit: "contain" }} />}
            {skill.attack_type}
          </span>
        )}
        {skill.element && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, padding: "3px 10px", borderRadius: 3, background: "rgba(255,255,255,0.05)", color: elemColor, textTransform: "capitalize", border: "0.5px solid var(--hbr-border)" }}>
            {elemIcon && <img src={elemIcon} alt={skill.element} style={{ width: 13, height: 13, objectFit: "contain" }} />}
            {skill.element}
          </span>
        )}
        {skill.hits && (
          <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 3, background: "rgba(255,255,255,0.05)", color: "var(--hbr-muted)", border: "0.5px solid var(--hbr-border)" }}>
            {skill.hits} hit{skill.hits > 1 ? "s" : ""}
          </span>
        )}
        {skill.target && (
          <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 3, background: "rgba(255,255,255,0.05)", color: "var(--hbr-muted)", border: "0.5px solid var(--hbr-border)" }}>
            {skill.target}
          </span>
        )}
        {skill.sp_cost != null && (
          <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 3, background: "rgba(80,160,255,0.1)", color: "#80AAFF", border: "0.5px solid rgba(80,160,255,0.25)" }}>
            {skill.sp_cost} SP
          </span>
        )}
        {skill.max_uses != null && (
          <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 3, background: "rgba(200,160,80,0.1)", color: "#C8A050", border: "0.5px solid rgba(200,160,80,0.25)" }}>
            {skill.max_uses}× uses
          </span>
        )}
      </div>

      {/* Description */}
      <p style={{ fontSize: 13, color: "var(--hbr-silver)", lineHeight: 1.7, marginBottom: skill.notes?.length > 0 ? 14 : 0 }}>
        {skill.power}
      </p>

      {/* Notes */}
      {skill.notes && skill.notes.length > 0 && (
        <div style={{ borderTop: "0.5px solid var(--hbr-border)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
          {(skill.notes as string[]).map((note: string, i: number) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ color: typeInfo.color, fontSize: 12, marginTop: 2, flexShrink: 0 }}>*</span>
              <span style={{ fontSize: 12, color: "var(--hbr-silver)", lineHeight: 1.6 }}>{note}</span>
            </div>
          ))}
        </div>
      )}

      {/* Toggle row — bottom of card */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end", borderTop: "0.5px solid var(--hbr-border)", paddingTop: 12 }}>
        <span style={{ fontSize: 10, color: "var(--hbr-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginRight: 4 }}>
          ↻ Tap to toggle
        </span>
        {group.map((g: any, i: number) => {
          const gElemColor = ELEMENT_COLOR[g.element] ?? "#888";
          const gElemIcon  = ELEMENT_ICON[g.element];
          return (
            <span key={i} style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              fontSize: 12, padding: "5px 14px", borderRadius: 4,
              background: activeIndex === i ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${activeIndex === i ? gElemColor : "rgba(255,255,255,0.1)"}`,
              color: activeIndex === i ? gElemColor : "var(--hbr-muted)",
              textTransform: "capitalize", fontWeight: activeIndex === i ? 700 : 400,
              transition: "all 0.15s",
            }}>
              {gElemIcon && <img src={gElemIcon} alt={g.element} style={{ width: 14, height: 14, objectFit: "contain" }} />}
              {g.element}
            </span>
          );
        })}
      </div>
    </div>
  );
}
