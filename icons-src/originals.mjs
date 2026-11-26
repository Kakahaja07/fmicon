// fmicon originals: icons drawn for fmicon, for things the FMUI set doesn't cover.
// Each is drawn once from simple parts (see engine.mjs); the build turns it into all nine styles.
// Ids follow the library's "category--name" pattern. Keep names unique across the whole set.
import { arc, body, circle, curve, detail, dot, ellipse, faint, line, path, poly, rect } from "./engine.mjs";

export const categories = {
  "ai-dev": "AI & Dev",
  "science-nature": "Science & Nature",
  everyday: "Everyday",
};

export const originals = [
  /* ------------------------------ AI & Dev ------------------------------ */
  {
    id: "ai-dev--robot",
    parts: [
      body(rect(4, 8, 16, 12.5, 4.5)),
      detail(dot(9.25, 13.5, 1.15)),
      detail(dot(14.75, 13.5, 1.15)),
      detail(line(10, 17.25, 14, 17.25)),
      detail(line(12, 8, 12, 5.25)),
      detail(dot(12, 3.75, 1.25)),
      detail(line(2, 12.5, 2, 15.5)),
      detail(line(22, 12.5, 22, 15.5)),
    ],
  },
  {
    id: "ai-dev--chip",
    parts: [
      body(rect(5.5, 5.5, 13, 13, 3.5)),
      detail(rect(9.25, 9.25, 5.5, 5.5, 1.5), { ring: true }),
      ...[9, 12, 15].flatMap((v) => [
        detail(line(v, 2.5, v, 5.5)),
        detail(line(v, 18.5, v, 21.5)),
        detail(line(2.5, v, 5.5, v)),
        detail(line(18.5, v, 21.5, v)),
      ]),
    ],
  },
  {
    id: "ai-dev--terminal",
    parts: [
      body(rect(2, 3.5, 20, 17, 5)),
      detail(poly([[7, 9.5], [9.5, 12], [7, 14.5]])),
      detail(line(12.5, 14.5, 17, 14.5)),
    ],
  },
  {
    id: "ai-dev--git-branch",
    parts: [
      body(circle(6, 5, 2.5)),
      body(circle(6, 19, 2.5)),
      body(circle(18, 6.5, 2.5)),
      detail(line(6, 7.5, 6, 16.5)),
      detail(curve([18, 9], [[18, 13.5], [6, 12], [6, 16.5]])),
    ],
  },
  {
    id: "ai-dev--git-merge",
    parts: [
      body(circle(6, 5, 2.5)),
      body(circle(6, 19, 2.5)),
      body(circle(18, 15, 2.5)),
      detail(line(6, 7.5, 6, 16.5)),
      detail(curve([6, 7.5], [[6, 12.5], [10.5, 15], [15.5, 15]])),
    ],
  },
  {
    id: "ai-dev--git-pull-request",
    parts: [
      body(circle(6, 5, 2.5)),
      body(circle(6, 19, 2.5)),
      body(circle(18, 19, 2.5)),
      detail(line(6, 7.5, 6, 16.5)),
      detail(curve([18, 16.5], [[18, 9.5], [17.5, 6], [12.5, 6]])),
      detail(poly([[14.5, 3.75], [12.25, 6], [14.5, 8.25]])),
    ],
  },
  {
    id: "ai-dev--database",
    parts: [
      body(path("M4 6A8 3 0 0 1 20 6V18A8 3 0 0 1 4 18Z", [4, 3, 20, 21])),
      // the front halves of the top and middle ellipses (rx 8, ry 3)
      detail(curve([4, 6], [[4, 10], [20, 10], [20, 6]])),
      detail(curve([4, 12], [[4, 16], [20, 16], [20, 12]])),
    ],
  },
  {
    id: "ai-dev--server",
    parts: [
      body(rect(3, 3, 18, 8, 3)),
      body(rect(3, 13, 18, 8, 3)),
      detail(dot(7, 7, 1.1)),
      detail(dot(7, 17, 1.1)),
      detail(line(12.5, 7, 17, 7)),
      detail(line(12.5, 17, 17, 17)),
    ],
  },
  {
    id: "ai-dev--bug",
    parts: [
      body(rect(7, 7.5, 10, 14, 5)),
      detail(line(12, 11.5, 12, 18)),
      detail(arc(12, 7.5, 3, 180, 360)),
      detail(line(7, 12.5, 3.5, 11.5)),
      detail(line(17, 12.5, 20.5, 11.5)),
      detail(line(7, 17, 4, 19)),
      detail(line(17, 17, 20, 19)),
      detail(line(10, 5, 8.75, 3)),
      detail(line(14, 5, 15.25, 3)),
    ],
  },
  {
    id: "ai-dev--plug",
    parts: [
      body(path("M5.5 8.25H18.5V11.5A6.5 6.5 0 0 1 5.5 11.5Z", [5.5, 8.25, 18.5, 18])),
      detail(line(9, 2.75, 9, 8.25)),
      detail(line(15, 2.75, 15, 8.25)),
      detail(line(12, 18, 12, 21.5)),
    ],
  },
  {
    id: "ai-dev--puzzle",
    parts: [
      body(path("M4 8H8.25A2.25 2.25 0 1 1 12.75 8H17V12.25A2.25 2.25 0 1 1 17 16.75V21H4Z", [4, 5.75, 19.25, 21])),
    ],
  },
  {
    id: "ai-dev--rocket",
    parts: [
      body(path("M12 2.5C15.25 5 16.5 8.75 16.5 12.5V17H7.5V12.5C7.5 8.75 8.75 5 12 2.5Z", [7.5, 2.5, 16.5, 17])),
      body(path("M7.5 12L4.5 15V19L7.5 17Z", [4.5, 12, 7.5, 19])),
      body(path("M16.5 12L19.5 15V19L16.5 17Z", [16.5, 12, 19.5, 19])),
      detail(circle(12, 10, 1.75), { ring: true }),
      detail(line(10.5, 19.5, 10.5, 21.5)),
      detail(line(13.5, 19.5, 13.5, 21.5)),
    ],
  },

  /* -------------------------- Science & Nature -------------------------- */
  {
    id: "science-nature--leaf",
    parts: [
      body(path("M5.5 18.5C5.5 9.5 10 4.5 20 4C19.5 14 14.5 18.5 5.5 18.5Z", [5.5, 4, 20, 18.5])),
      detail(line(9, 15, 15, 9)),
      detail(line(3, 21, 5.5, 18.5)),
    ],
  },
  {
    id: "science-nature--plant",
    parts: [
      body(path("M6.5 14H17.5L16.4 19.75A2 2 0 0 1 14.45 21.5H9.55A2 2 0 0 1 7.6 19.75Z", [6.5, 14, 17.5, 21.5])),
      body(path("M12 11.25C12 7.5 9.5 5.5 5.5 5.5C5.5 9.25 8 11.25 12 11.25Z", [5.5, 5.5, 12, 11.25])),
      body(path("M12 9C12 5.25 14.5 2.75 18.5 2.75C18.5 6.5 16 9 12 9Z", [12, 2.75, 18.5, 9])),
      detail(line(12, 9, 12, 14)),
    ],
  },
  {
    id: "science-nature--planet",
    parts: [
      body(circle(12, 12, 6.5)),
      detail(ellipse(12, 12, 10.5, 3.25, -22), { ring: true }),
    ],
  },
  {
    id: "science-nature--atom",
    parts: [
      body(circle(12, 12, 2.25)),
      detail(ellipse(12, 12, 10, 4, 0), { ring: true }),
      detail(ellipse(12, 12, 10, 4, 60), { ring: true }),
      detail(ellipse(12, 12, 10, 4, 120), { ring: true }),
    ],
  },
  {
    id: "science-nature--dna",
    parts: [
      detail(curve([7, 2.5], [[7, 7.5], [17, 7.5], [17, 12]], [[17, 16.5], [7, 16.5], [7, 21.5]])),
      detail(curve([17, 2.5], [[17, 7.5], [7, 7.5], [7, 12]], [[7, 16.5], [17, 16.5], [17, 21.5]])),
      faint(line(8.25, 5, 15.75, 5)),
      faint(line(9.75, 8.75, 14.25, 8.75)),
      faint(line(9.75, 15.25, 14.25, 15.25)),
      faint(line(8.25, 19, 15.75, 19)),
    ],
  },
  {
    id: "science-nature--mountain",
    parts: [
      body(path("M2.5 20L9 8.5L13 15L15.5 11.5L21.5 20Z", [2.5, 8.5, 21.5, 20])),
      detail(circle(17.5, 5.5, 2), { ring: true }),
    ],
  },

  /* ------------------------------ Everyday ------------------------------ */
  {
    id: "everyday--pill",
    parts: [
      body(rect(7.25, 2, 9.5, 20, 4.75, 45)),
      detail(line(8.9, 8.9, 15.1, 15.1)),
    ],
  },
  {
    id: "everyday--paw",
    parts: [
      body(path("M12 13C9 13 6.5 16 6.5 18.25C6.5 20 8 20.85 9.5 20.4C10.5 20.1 11.2 19.9 12 19.9S13.5 20.1 14.5 20.4C16 20.85 17.5 20 17.5 18.25C17.5 16 15 13 12 13Z", [6.5, 13, 17.5, 20.85])),
      body(ellipse(4.75, 10.75, 1.75, 2.25, -20)),
      body(ellipse(9, 6.25, 1.9, 2.5, -8)),
      body(ellipse(15, 6.25, 1.9, 2.5, 8)),
      body(ellipse(19.25, 10.75, 1.75, 2.25, 20)),
    ],
  },
  {
    id: "everyday--compass",
    parts: [
      body(circle(12, 12, 10)),
      detail(poly([[15.75, 8.25], [13.6, 13.6], [8.25, 15.75], [10.4, 10.4]], true)),
    ],
  },
  {
    id: "everyday--dice",
    parts: [
      body(rect(3, 3, 18, 18, 5)),
      detail(dot(8.25, 8.25, 1.6)),
      detail(dot(12, 12, 1.6)),
      detail(dot(15.75, 15.75, 1.6)),
    ],
  },
  {
    id: "everyday--target",
    parts: [
      body(circle(12, 12, 10)),
      detail(circle(12, 12, 5.75), { ring: true }),
      detail(dot(12, 12, 1.75)),
    ],
  },
  {
    id: "everyday--hourglass",
    parts: [
      body(path("M6.5 2.5H17.5V6C17.5 9 14.75 10.75 13.25 12C14.75 13.25 17.5 15 17.5 18V21.5H6.5V18C6.5 15 9.25 13.25 10.75 12C9.25 10.75 6.5 9 6.5 6Z", [6.5, 2.5, 17.5, 21.5])),
      detail(line(4.5, 2.5, 19.5, 2.5)),
      detail(line(4.5, 21.5, 19.5, 21.5)),
      detail(poly([[9.25, 18.75], [14.75, 18.75], [12, 16.25]], true)),
    ],
  },
  {
    id: "everyday--qr-code",
    parts: [
      body(rect(3, 3, 7, 7, 2.5)),
      body(rect(14, 3, 7, 7, 2.5)),
      body(rect(3, 14, 7, 7, 2.5)),
      detail(dot(6.5, 6.5, 1)),
      detail(dot(17.5, 6.5, 1)),
      detail(dot(6.5, 17.5, 1)),
      detail(rect(14, 14, 2.75, 2.75, 0.9)),
      detail(rect(18.25, 14, 2.75, 2.75, 0.9)),
      detail(rect(14, 18.25, 2.75, 2.75, 0.9)),
      detail(rect(18.25, 18.25, 2.75, 2.75, 0.9)),
    ],
  },
];
