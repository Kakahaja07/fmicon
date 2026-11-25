import * as I from "~/components/icons/Icons";
import s from "./DesktopArt.module.css";

const macIcons = [I.HomeIcon, I.HeartIcon, I.CameraIcon, I.MusicIcon, I.CloudIcon, I.StarIcon];
const winIcons = [I.FolderIcon, I.SettingIcon, I.CalendarIcon, I.MessageIcon, I.LockIcon, I.GiftIcon];

/** The same icons in two windows, one per package: open source, any framework. */
export function DesktopArt() {
  return (
    <div className={s.art}>
      <div className={`${s.window} ${s.mac}`}>
        <div className={s.bar}>
          <span className={s.lights}>
            <i />
            <i />
            <i />
          </span>
          @fmicons/react
        </div>
        <div className={s.grid}>
          {macIcons.map((Icon, i) => (
            <span key={i}>
              <Icon size={20} />
            </span>
          ))}
        </div>
      </div>

      <div className={`${s.window} ${s.win}`}>
        <div className={s.bar}>
          @fmicons/vue
          <span className={s.controls}>
            <I.MinusIcon size={12} />
            <i className={s.max} />
            <I.AddIcon size={13} className={s.close} />
          </span>
        </div>
        <div className={s.grid}>
          {winIcons.map((Icon, i) => (
            <span key={i}>
              <Icon size={20} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
