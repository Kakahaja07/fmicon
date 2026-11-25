import type { CSSProperties } from "react";
import * as I from "~/components/icons/Icons";
import type { IconComponent } from "~/components/icons/Icons";
import { paletteVar, type PaletteColor } from "~/lib/palette";
import s from "./IconField.module.css";

// A wall of real FMUI icons behind the hero. Mostly quiet; a few light up in colour, one after another.
const wall: IconComponent[] = [
  I.HomeIcon, I.WalletIcon, I.SearchNormalIcon, I.HeartIcon, I.CameraIcon, I.MusicIcon, I.CloudIcon, I.SettingIcon,
  I.CalendarIcon, I.MessageIcon, I.LockIcon, I.UserIcon, I.GiftIcon, I.LocationIcon, I.BagIcon, I.BookmarkIcon,
  I.MicrophoneIcon, I.GalleryIcon, I.MapIcon, I.NotificationIcon, I.TrashIcon, I.EditIcon, I.LinkIcon, I.SendIcon,
  I.GlobalIcon, I.ChartIcon, I.CupIcon, I.DiamondsIcon, I.CrownIcon, I.FlashIcon, I.GameIcon, I.PetIcon,
  I.CoffeeIcon, I.BrushIcon, I.ShapesIcon, I.StickerIcon, I.FolderIcon, I.CopyIcon, I.CodeIcon, I.CommandIcon,
  I.EmojiHappyIcon, I.MagicStarIcon, I.StarIcon, I.LampIcon, I.GhostIcon, I.CakeIcon, I.DropIcon, I.MoonIcon,
];

const ROWS = 6;
const COLS = 16;

// Which cells glow, their colour, and when (seconds into the loop).
const lit: Record<number, { color: PaletteColor; delay: number }> = {
  3: { color: "blue", delay: 0 },
  20: { color: "pink", delay: 1.4 },
  30: { color: "orange", delay: 2.8 },
  45: { color: "green", delay: 4.2 },
  51: { color: "purple", delay: 5.6 },
  60: { color: "yellow", delay: 7 },
  70: { color: "teal", delay: 8.4 },
  83: { color: "red", delay: 9.8 },
  92: { color: "indigo", delay: 11.2 },
};

/** `footer`: three quiet rows that fade out from the top of the footer. */
export function IconField({ variant }: { variant?: "footer" }) {
  const rows = variant === "footer" ? 3 : ROWS;
  return (
    <div className={variant === "footer" ? s.footerField : s.field} aria-hidden="true">
      <div className={s.grid} style={{ "--cols": COLS } as CSSProperties}>
        {Array.from({ length: rows * COLS }, (_, i) => {
          const Icon = wall[(i * 7 + Math.floor(i / COLS) * 3) % wall.length];
          const glow = lit[i];
          return (
            <span
              key={i}
              className={glow ? s.lit : s.cell}
              style={glow ? ({ "--c": paletteVar(glow.color), "--d": `${glow.delay}s` } as CSSProperties) : undefined}
            >
              <Icon size={22} />
            </span>
          );
        })}
      </div>
    </div>
  );
}
