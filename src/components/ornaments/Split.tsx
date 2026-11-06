import { Fragment, type ReactNode } from "react";

type Props = {
  text: string;
  /** Character splitting is for Latin display names; Devanagari stays whole-word so conjuncts never break. */
  by?: "words" | "chars";
};

const DEVANAGARI = /[ऀ-ॿ]/;

function words(text: string, by: "words" | "chars", keyBase: string): ReactNode[] {
  return text.split(/(\s+)/).map((part, i) => {
    if (!part) return null;
    if (/^\s+$/.test(part)) return " ";
    const key = `${keyBase}-${i}`;
    if (by === "chars" && !DEVANAGARI.test(part)) {
      return (
        <span key={key} className="split-word">
          {Array.from(part).map((ch, j) => (
            <span key={j} className="split-w">
              <span className="split-i">{ch}</span>
            </span>
          ))}
        </span>
      );
    }
    return (
      <span key={key} className="split-w">
        <span className="split-i">{part}</span>
      </span>
    );
  });
}

/**
 * Renders text as masked word (or character) spans for reveal animations.
 * `*accent*` becomes <em>, and "\n" a line break.
 */
export function Split({ text, by = "words" }: Props) {
  return (
    <>
      {text.split("\n").map((line, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          {line.split(/(\*[^*]+\*)/).map((seg, si) => {
            if (!seg) return null;
            const key = `${li}-${si}`;
            if (seg.startsWith("*") && seg.endsWith("*")) {
              const inner = seg.slice(1, -1);
              return (
                <em key={key} className={inner === "&" ? "amp" : undefined}>
                  {words(inner, by, key)}
                </em>
              );
            }
            return <Fragment key={key}>{words(seg, by, key)}</Fragment>;
          })}
        </Fragment>
      ))}
    </>
  );
}

/** Plain-text version of the markup, for aria-labels and messages. */
export const plain = (text: string) => text.replace(/\*/g, "").replace(/\n/g, " ");

/** Inline markup without splitting: `*accent*` → <em>, "\n" → <br>. */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          {line.split(/(\*[^*]+\*)/).map((seg, si) =>
            seg.startsWith("*") && seg.endsWith("*") ? (
              <em key={si} className={seg === "*&*" ? "amp" : undefined}>
                {seg.slice(1, -1)}
              </em>
            ) : (
              <Fragment key={si}>{seg}</Fragment>
            ),
          )}
        </Fragment>
      ))}
    </>
  );
}
