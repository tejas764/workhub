export function cn(...cls: (string|false|undefined|null)[]) { return cls.filter(Boolean).join(" "); }
export function initials(n: string) { return n.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase(); }

export function hov(el: EventTarget, bg: string, clr?: string) {
  const e = el as HTMLElement;
  e.style.background = bg;
  if(clr) e.style.color = clr;
}
export function unhov(el: EventTarget, bg: string, clr?: string) {
  const e = el as HTMLElement;
  e.style.background = bg;
  if(clr) e.style.color = clr;
}
